import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import { deepFreeze, type JsonObject } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { DecisionId, EvidenceId, MissionId, TenantId } from "../../../shared/identity/index.js";
import { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { ApprovalReference, AssignmentReference, AuthorityReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import { Approval } from "./Approval.js";
import { ApprovalOutcome, type ApprovalOutcomeType } from "./ApprovalOutcome.js";
import type { ApproveDecisionCommand, CreateDecisionCommand, FinalizeDecisionCommand, RejectDecisionCommand } from "./GovernanceCommands.js";
import { DecisionCreated, DecisionApproved, DecisionRejected, ApprovalRecorded, DecisionFinalized, type GovernanceDomainEvent } from "./GovernanceEvents.js";
import { DecisionStatus, type DecisionStatusType } from "./DecisionStatus.js";
import { DecisionType, type DecisionTypeValue } from "./DecisionType.js";
import { GovernanceAuditMetadata } from "./GovernanceAuditMetadata.js";
import { HumanActorReference } from "./HumanActorReference.js";
import { CausationId, CorrelationId } from "../../../shared/common/index.js";
import { parseDecisionSnapshot, serializeDecisionSnapshot, type DecisionSnapshot } from "./DecisionSnapshot.js";

interface DecisionState { readonly status: DecisionStatusType; readonly approval: Approval | null; readonly version: Version; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly audit: GovernanceAuditMetadata; }
function evidenceFrom(value: JsonObject): EvidenceReference { return new EvidenceReference({ evidenceId: EvidenceId.from(String(value.evidenceId)), source: String(value.source), type: String(value.type), capturedAt: String(value.capturedAt), ...(typeof value.locator === "string" ? { locator: value.locator } : {}), ...(typeof value.limitation === "string" ? { limitation: value.limitation } : {}) }); }
function lineageFrom(value: JsonObject): LineageReference { return new LineageReference({ sourceId: String(value.sourceId), targetId: String(value.targetId), relationship: String(value.relationship) as "references", declaredAt: String(value.declaredAt), ...(typeof value.reason === "string" ? { reason: value.reason } : {}) }); }

export class Decision extends AggregateRoot<DecisionId> {
  private readonly decisionTenantId: TenantId;
  private readonly decisionMissionId: MissionId;
  private readonly decisionType: DecisionTypeValue;
  private readonly decisionAuthority: AuthorityReference;
  private readonly decisionAssignment: AssignmentReference | undefined;
  private decisionStatus: DecisionStatusType;
  private decisionApproval: Approval | null;
  private decisionEvidence: EvidenceReference[];
  private decisionLineage: LineageReference[];
  private decisionAudit: GovernanceAuditMetadata;

  private constructor(id: DecisionId, tenantId: TenantId, missionId: MissionId, decisionType: DecisionTypeValue, authorityReference: AuthorityReference, assignmentReference: AssignmentReference | undefined, state: DecisionState) {
    super(id, state.version); this.decisionTenantId = tenantId; this.decisionMissionId = missionId; this.decisionType = decisionType; this.decisionAuthority = authorityReference; this.decisionAssignment = assignmentReference; this.decisionStatus = state.status; this.decisionApproval = state.approval; this.decisionEvidence = [...state.evidence]; this.decisionLineage = [...state.lineage]; this.decisionAudit = state.audit;
    if (state.evidence.length === 0) throw new InvariantViolation("Decision must preserve Evidence");
    if (state.lineage.length === 0) throw new InvariantViolation("Decision must preserve Lineage");
    Object.defineProperty(this, "decisionTenantId", { writable: false, configurable: false }); Object.defineProperty(this, "decisionMissionId", { writable: false, configurable: false }); Object.defineProperty(this, "decisionType", { writable: false, configurable: false }); Object.defineProperty(this, "decisionAuthority", { writable: false, configurable: false }); Object.defineProperty(this, "decisionAssignment", { writable: false, configurable: false });
    this.assertState();
  }

  public static create(command: CreateDecisionCommand): Decision {
    if (!Object.values(DecisionType).includes(command.decisionType)) throw new InvariantViolation("DecisionType is invalid");
    const decision = new Decision(command.decisionId, command.tenantId, command.missionId, command.decisionType, command.authorityReference, command.assignmentReference, { status: DecisionStatus.PROPOSED, approval: null, version: Version.initial(), evidence: command.evidence, lineage: command.lineage, audit: new GovernanceAuditMetadata({ createdAt: command.occurredAt, updatedAt: command.occurredAt, correlationId: command.correlationId, ...(command.causationId === undefined ? {} : { causationId: command.causationId }), version: Version.initial(), actorReference: command.actorReference.value, reason: command.reason, evidence: command.evidence, lineage: command.lineage }) });
    decision.emit(DecisionCreated, command.occurredAt, { status: DecisionStatus.PROPOSED, missionId: command.missionId.toString(), decisionType: command.decisionType });
    return decision;
  }

  public static rehydrate(snapshot: DecisionSnapshot): Decision {
    const parsed = parseDecisionSnapshot(snapshot);
    const audit = parsed.audit;
    return new Decision(DecisionId.from(parsed.decisionId), TenantId.from(parsed.tenantId), MissionId.from(parsed.missionId), parsed.decisionType as DecisionTypeValue, AuthorityReference.fromJSON(parsed.authorityReference as { id: string; tenantId: string }), parsed.assignmentReference === null ? undefined : AssignmentReference.fromJSON(parsed.assignmentReference as { id: string; tenantId: string }), { status: parsed.status, approval: parsed.approval === null ? null : Approval.fromSnapshot(parsed.approval), version: Version.from(parsed.version), evidence: parsed.evidence.map(evidenceFrom), lineage: parsed.lineage.map(lineageFrom), audit: new GovernanceAuditMetadata({ createdAt: String(audit.createdAt), updatedAt: String(audit.updatedAt), correlationId: importCorrelation(String(audit.correlationId)), ...(typeof audit.causationId === "string" ? { causationId: importCausation(String(audit.causationId)) } : {}), version: Version.from(parsed.version), actorReference: String(audit.actorReference), reason: String(audit.reason), evidence: parsed.evidence.map(evidenceFrom), lineage: parsed.lineage.map(lineageFrom) }) });
  }

  public get tenantId(): TenantId { return this.decisionTenantId; }
  public get missionId(): MissionId { return this.decisionMissionId; }
  public get decisionTypeValue(): DecisionTypeValue { return this.decisionType; }
  public get authorityReference(): AuthorityReference { return this.decisionAuthority; }
  public get assignmentReference(): AssignmentReference | undefined { return this.decisionAssignment; }
  public get status(): DecisionStatusType { return this.decisionStatus; }
  public get approval(): Approval | null { return this.decisionApproval; }
  public get evidence(): readonly EvidenceReference[] { return [...this.decisionEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.decisionLineage]; }
  public get approvalReference(): ApprovalReference | undefined { return this.approval === null ? undefined : new ApprovalReference(this.approval.id, this.tenantId); }

  public approve(command: ApproveDecisionCommand): void {
    this.assertMutable(); if (this.status !== DecisionStatus.PROPOSED) throw new InvariantViolation("Only a proposed Decision can be approved");
    this.assertApprovalAuthority(command.authorityReference, command.assignmentReference);
    this.decisionApproval = Approval.create({ id: command.approvalId, tenantId: this.tenantId, outcome: command.outcome ?? ApprovalOutcome.APPROVED, authorityReference: command.authorityReference, ...(command.assignmentReference === undefined ? {} : { assignmentReference: command.assignmentReference }), actorReference: command.actorReference, reason: command.reason, occurredAt: command.occurredAt, evidence: command.evidence });
    this.decisionStatus = DecisionStatus.APPROVED; this.mutate(command, DecisionApproved, { approvalId: command.approvalId.toString(), outcome: this.decisionApproval.outcome });
    this.recordAdditionalEvent(command, ApprovalRecorded, { approvalId: command.approvalId.toString(), outcome: this.decisionApproval.outcome });
  }
  public reject(command: RejectDecisionCommand): void {
    this.assertMutable(); if (this.status !== DecisionStatus.PROPOSED) throw new InvariantViolation("Only a proposed Decision can be rejected");
    this.assertApprovalAuthority(command.authorityReference, command.assignmentReference);
    this.decisionApproval = Approval.create({ id: command.approvalId, tenantId: this.tenantId, outcome: ApprovalOutcome.REJECTED, authorityReference: command.authorityReference, ...(command.assignmentReference === undefined ? {} : { assignmentReference: command.assignmentReference }), actorReference: command.actorReference, reason: command.reason, occurredAt: command.occurredAt, evidence: command.evidence });
    this.decisionStatus = DecisionStatus.REJECTED; this.mutate(command, DecisionRejected, { approvalId: command.approvalId.toString(), outcome: ApprovalOutcome.REJECTED });
    this.recordAdditionalEvent(command, ApprovalRecorded, { approvalId: command.approvalId.toString(), outcome: ApprovalOutcome.REJECTED });
  }
  public finalize(command: FinalizeDecisionCommand): void {
    this.assertMutable(); if (!([DecisionStatus.APPROVED, DecisionStatus.REJECTED] as readonly DecisionStatusType[]).includes(this.status) || this.approval === null) throw new InvariantViolation("Decision requires an outcome and Approval before finalization");
    this.decisionStatus = DecisionStatus.FINALIZED; this.mutate(command, DecisionFinalized, { status: this.status, approvalId: this.approval.id.toString() });
  }

  public toSnapshot(): DecisionSnapshot { return deepFreeze({ schemaVersion: 1, decisionId: this.id.toString(), tenantId: this.tenantId.toString(), missionId: this.missionId.toString(), decisionType: this.decisionTypeValue, status: this.status, authorityReference: this.authorityReference.toJSON(), assignmentReference: this.assignmentReference?.toJSON() ?? null, approval: this.approval?.toSnapshot() ?? null, version: this.version.value, evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), audit: { createdAt: this.decisionAudit.createdAt, updatedAt: this.decisionAudit.updatedAt, actorReference: this.decisionAudit.actorReference, reason: this.decisionAudit.reason, correlationId: this.decisionAudit.correlationId.toString(), ...(this.decisionAudit.causationId === undefined ? {} : { causationId: this.decisionAudit.causationId.toString() }) } }); }
  public serialize(): string { return serializeDecisionSnapshot(this.toSnapshot()); }

  private assertMutable(): void { if (this.status === DecisionStatus.FINALIZED) throw new InvariantViolation("Finalized Decision is immutable"); }
  private mutate(command: { readonly occurredAt: string; readonly correlationId: import("../../../shared/common/CorrelationId.js").CorrelationId; readonly causationId?: import("../../../shared/common/CausationId.js").CausationId; readonly actorReference: HumanActorReference; readonly reason: string; readonly evidence: readonly EvidenceReference[]; readonly lineage?: readonly LineageReference[] }, EventType: new (props: import("./GovernanceEvents.js").GovernanceEventProps) => GovernanceDomainEvent, payload: JsonObject): void {
    this.decisionEvidence = [...this.decisionEvidence, ...command.evidence.filter((item) => !this.decisionEvidence.some((known) => known.evidenceId.equals(item.evidenceId)))];
    if (command.lineage !== undefined) this.decisionLineage = [...this.decisionLineage, ...command.lineage.filter((item) => !this.decisionLineage.some((known) => known.equals(item)))];
    const version = this.incrementVersion(); this.decisionAudit = new GovernanceAuditMetadata({ createdAt: this.decisionAudit.createdAt, updatedAt: command.occurredAt, correlationId: command.correlationId, ...(command.causationId === undefined ? {} : { causationId: command.causationId }), version, actorReference: command.actorReference.value, reason: command.reason, evidence: this.decisionEvidence, lineage: this.decisionLineage });
    this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version, payload })); this.assertState();
  }
  private recordAdditionalEvent(command: { readonly occurredAt: string; readonly correlationId: import("../../../shared/common/CorrelationId.js").CorrelationId; readonly causationId?: import("../../../shared/common/CausationId.js").CausationId }, EventType: new (props: import("./GovernanceEvents.js").GovernanceEventProps) => GovernanceDomainEvent, payload: JsonObject): void {
    const version = this.incrementVersion(); this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version, payload }));
  }
  private emit(EventType: new (props: import("./GovernanceEvents.js").GovernanceEventProps) => GovernanceDomainEvent, occurredAt: string, payload: JsonObject): void { const version = this.incrementVersion(); this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt, version, payload })); }
  private assertState(): void { if (this.status === DecisionStatus.FINALIZED && this.approval === null) throw new InvariantViolation("Finalized Decision requires an Approval"); }
  private assertApprovalAuthority(authorityReference: AuthorityReference, assignmentReference: AssignmentReference | undefined): void {
    if (!this.decisionAuthority.equals(authorityReference)) throw new InvariantViolation("Decision approval must use its declared Authority");
    if ((this.decisionAssignment === undefined) !== (assignmentReference === undefined) || (this.decisionAssignment !== undefined && assignmentReference !== undefined && !this.decisionAssignment.equals(assignmentReference))) throw new InvariantViolation("Decision approval must use its declared Assignment");
  }
}

function importCorrelation(value: string): CorrelationId { return CorrelationId.from(value); }
function importCausation(value: string): CausationId { return CausationId.from(value); }
