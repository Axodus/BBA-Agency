import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { deepFreeze, type JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { CausationId, CorrelationId } from "../../../shared/common/index.js";
import { AuthorityId, AssignmentId, TenantId, EvidenceId } from "../../../shared/identity/index.js";
import { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { AssignmentReference } from "../../../shared/references/AssignmentReference.js";
import { AuthorityReference } from "../../../shared/references/AuthorityReference.js";
import { Version } from "../../../shared/version/Version.js";
import { Assignment } from "./Assignment.js";
import type { AssignAuthorityCommand, ActivateAuthorityCommand, CreateAuthorityCommand, DeactivateAuthorityCommand, ExpireAssignmentCommand, RevokeAssignmentCommand, SuspendAuthorityCommand } from "./GovernanceCommands.js";
import { AuthorityLevelValue } from "./AuthorityLevel.js";
import { AuthorityScope } from "./AuthorityScope.js";
import { AuthorityStatus, type AuthorityStatusType } from "./AuthorityStatus.js";
import { AuthorityCreated, AuthorityActivated, AuthorityRetired, AuthoritySuspended, AssignmentExpired, AssignmentGranted, AssignmentRevoked, type GovernanceDomainEvent } from "./GovernanceEvents.js";
import { GovernanceAuditMetadata } from "./GovernanceAuditMetadata.js";
import { HumanActorReference } from "./HumanActorReference.js";
import { parseAuthoritySnapshot, serializeAuthoritySnapshot, type AuthoritySnapshot } from "./AuthoritySnapshot.js";
import type { AssignmentSnapshot } from "./Assignment.js";

interface Suspension { readonly until: string; readonly reason: string; }
interface AuthorityState {
  readonly status: AuthorityStatusType; readonly suspension: Suspension | null; readonly version: Version;
  readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[];
  readonly audit: GovernanceAuditMetadata; readonly assignments: readonly Assignment[];
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new ValidationError(`${field} is required`, { field });
  return normalized;
}
function evidenceFrom(value: JsonObject): EvidenceReference {
  return new EvidenceReference({ evidenceId: EvidenceId.from(String(value.evidenceId)), source: String(value.source), type: String(value.type), capturedAt: String(value.capturedAt), ...(typeof value.locator === "string" ? { locator: value.locator } : {}), ...(typeof value.limitation === "string" ? { limitation: value.limitation } : {}) });
}
function lineageFrom(value: JsonObject): LineageReference {
  return new LineageReference({ sourceId: String(value.sourceId), targetId: String(value.targetId), relationship: String(value.relationship) as "references", declaredAt: String(value.declaredAt), ...(typeof value.reason === "string" ? { reason: value.reason } : {}) });
}

export class Authority extends AggregateRoot<AuthorityId> {
  private readonly authorityTenantId: TenantId;
  private readonly authorityActor: HumanActorReference;
  private readonly authorityLevel: AuthorityLevelValue;
  private readonly authorityScope: AuthorityScope;
  private authorityStatus: AuthorityStatusType;
  private authoritySuspension: Suspension | null;
  private authorityEvidence: EvidenceReference[];
  private authorityLineage: LineageReference[];
  private authorityAudit: GovernanceAuditMetadata;
  private authorityAssignments: Assignment[];

  private constructor(id: AuthorityId, tenantId: TenantId, actor: HumanActorReference, level: AuthorityLevelValue, scope: AuthorityScope, state: AuthorityState) {
    super(id, state.version);
    if (state.evidence.length === 0) throw new InvariantViolation("Authority must preserve Evidence");
    if (state.lineage.length === 0) throw new InvariantViolation("Authority must preserve Lineage");
    this.authorityTenantId = tenantId; this.authorityActor = actor; this.authorityLevel = level; this.authorityScope = scope;
    this.authorityStatus = state.status; this.authoritySuspension = state.suspension; this.authorityEvidence = [...state.evidence];
    this.authorityLineage = [...state.lineage]; this.authorityAudit = state.audit; this.authorityAssignments = [...state.assignments];
    Object.defineProperty(this, "authorityTenantId", { writable: false, configurable: false });
    Object.defineProperty(this, "authorityActor", { writable: false, configurable: false });
    Object.defineProperty(this, "authorityLevel", { writable: false, configurable: false });
    Object.defineProperty(this, "authorityScope", { writable: false, configurable: false });
    this.assertState();
  }

  public static create(command: CreateAuthorityCommand): Authority {
    const authority = new Authority(command.authorityId, command.tenantId, command.actorReference, new AuthorityLevelValue(command.level), command.scope, {
      status: AuthorityStatus.PROPOSED, suspension: null, version: Version.initial(), evidence: command.evidence, lineage: command.lineage,
      audit: new GovernanceAuditMetadata({ createdAt: command.occurredAt, updatedAt: command.occurredAt, correlationId: command.correlationId, ...(command.causationId === undefined ? {} : { causationId: command.causationId }), version: Version.initial(), actorReference: command.actorReference.value, reason: command.reason, evidence: command.evidence, lineage: command.lineage }), assignments: []
    });
    authority.emit(AuthorityCreated, command.occurredAt, { status: AuthorityStatus.PROPOSED, actorReference: command.actorReference.value });
    return authority;
  }

  public static rehydrate(snapshot: AuthoritySnapshot): Authority {
    const parsed = parseAuthoritySnapshot(snapshot);
    return new Authority(AuthorityId.from(parsed.authorityId), TenantId.from(parsed.tenantId), new HumanActorReference(parsed.actorReference), new AuthorityLevelValue(parsed.level as import("./AuthorityLevel.js").AuthorityLevelType), new AuthorityScope({ purpose: String(parsed.scope.purpose), actions: parsed.scope.actions as string[], ...(Array.isArray(parsed.scope.constraints) ? { constraints: parsed.scope.constraints as string[] } : {}) }), {
      status: parsed.status, suspension: parsed.suspension, version: Version.from(parsed.version), evidence: parsed.evidence.map(evidenceFrom), lineage: parsed.lineage.map(lineageFrom), audit: new GovernanceAuditMetadata({ createdAt: String(parsed.audit.createdAt), updatedAt: String(parsed.audit.updatedAt), correlationId: CorrelationId.from(String(parsed.audit.correlationId)), ...(typeof parsed.audit.causationId === "string" ? { causationId: CausationId.from(String(parsed.audit.causationId)) } : {}), version: Version.from(parsed.version), actorReference: String(parsed.audit.actorReference), reason: String(parsed.audit.reason), evidence: parsed.evidence.map(evidenceFrom), lineage: parsed.lineage.map(lineageFrom) }), assignments: parsed.assignments.map((assignment) => Assignment.fromSnapshot(assignment))
    });
  }

  public get tenantId(): TenantId { return this.authorityTenantId; }
  public get actorReference(): HumanActorReference { return this.authorityActor; }
  public get level(): AuthorityLevelValue { return this.authorityLevel; }
  public get scope(): AuthorityScope { return this.authorityScope; }
  public get status(): AuthorityStatusType { return this.authorityStatus; }
  public get suspension(): Suspension | null { return this.authoritySuspension; }
  public get evidence(): readonly EvidenceReference[] { return [...this.authorityEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.authorityLineage]; }
  public get assignments(): readonly Assignment[] { return [...this.authorityAssignments]; }
  public get reference(): AuthorityReference { return new AuthorityReference(this.id, this.tenantId); }

  public activate(command: ActivateAuthorityCommand): void {
    const canActivate = ([AuthorityStatus.PROPOSED, AuthorityStatus.UNDER_REVIEW, AuthorityStatus.UPDATED] as readonly AuthorityStatusType[]).includes(this.status) || (this.status === AuthorityStatus.ACTIVE && this.authoritySuspension !== null);
    if (!canActivate) throw new InvariantViolation("Authority cannot be activated from its current lifecycle state", { status: this.status });
    this.authorityStatus = AuthorityStatus.ACTIVE; this.authoritySuspension = null; this.mutate(command, AuthorityActivated, { status: this.status });
  }
  public deactivate(command: DeactivateAuthorityCommand): void {
    if (this.status === AuthorityStatus.RETIRED) throw new InvariantViolation("Authority is already retired");
    this.authorityStatus = AuthorityStatus.RETIRED; this.authoritySuspension = null; this.mutate(command, AuthorityRetired, { status: this.status });
  }
  public suspend(command: SuspendAuthorityCommand): void {
    if (!([AuthorityStatus.ACTIVE, AuthorityStatus.UPDATED] as readonly AuthorityStatusType[]).includes(this.status)) throw new InvariantViolation("Only active Authority can be suspended");
    const until = assertCanonicalTimestamp(command.until, "suspension.until");
    if (until <= command.occurredAt) throw new ValidationError("Suspension must end after it starts");
    this.authoritySuspension = { until, reason: required(command.reason, "suspension reason") };
    this.mutate(command, AuthoritySuspended, { suspension: { until, reason: this.authoritySuspension.reason } });
  }
  public assign(command: AssignAuthorityCommand): AssignmentReference {
    if (this.status === AuthorityStatus.RETIRED || this.authoritySuspension !== null) throw new InvariantViolation("Authority cannot grant an Assignment while inactive or suspended");
    if (this.authorityAssignments.some((item) => item.isActive && item.delegateReference.equals(command.delegateReference) && item.period.overlaps(command.period))) throw new InvariantViolation("Incompatible Assignment period overlaps an existing delegation");
    const assignment = Assignment.create({ id: command.assignmentId, tenantId: this.tenantId, authorityId: this.id, delegateReference: command.delegateReference, scope: command.scope, period: command.period, occurredAt: command.occurredAt });
    this.authorityAssignments = [...this.authorityAssignments, assignment];
    this.mutate(command, AssignmentGranted, { assignmentId: assignment.id.toString(), delegateReference: assignment.delegateReference.toString(), period: assignment.period.toJSON() });
    return new AssignmentReference(assignment.id, this.tenantId);
  }
  public revokeAssignment(command: RevokeAssignmentCommand): void {
    const assignment = this.assignment(command.assignmentId); assignment.revoke(command.occurredAt); this.mutate(command, AssignmentRevoked, { assignmentId: assignment.id.toString() });
  }
  public expireAssignment(command: ExpireAssignmentCommand): void {
    const assignment = this.assignment(command.assignmentId); assignment.expire(command.occurredAt); this.mutate(command, AssignmentExpired, { assignmentId: assignment.id.toString() });
  }

  public toSnapshot(): AuthoritySnapshot {
    return deepFreeze({ schemaVersion: 1, authorityId: this.id.toString(), tenantId: this.tenantId.toString(), actorReference: this.actorReference.value, level: this.level.value, scope: this.scope.toJSON(), status: this.status, suspension: this.suspension, version: this.version.value, evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), audit: { createdAt: this.authorityAudit.createdAt, updatedAt: this.authorityAudit.updatedAt, actorReference: this.authorityAudit.actorReference, reason: this.authorityAudit.reason, correlationId: this.authorityAudit.correlationId.toString(), ...(this.authorityAudit.causationId === undefined ? {} : { causationId: this.authorityAudit.causationId.toString() }) }, assignments: this.assignments.map((item) => item.toSnapshot()) });
  }
  public serialize(): string { return serializeAuthoritySnapshot(this.toSnapshot()); }

  private assignment(id: AssignmentId): Assignment {
    const assignment = this.authorityAssignments.find((item) => item.id.equals(id));
    if (assignment === undefined) throw new ValidationError("Assignment does not belong to this Authority", { assignmentId: id.toString() });
    return assignment;
  }
  private mutate(command: { readonly occurredAt: string; readonly correlationId: import("../../../shared/common/CorrelationId.js").CorrelationId; readonly causationId?: import("../../../shared/common/CausationId.js").CausationId; readonly actorReference: HumanActorReference; readonly reason: string; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[] }, EventType: new (props: import("./GovernanceEvents.js").GovernanceEventProps) => GovernanceDomainEvent, payload: JsonObject): void {
    this.authorityEvidence = [...this.authorityEvidence, ...command.evidence.filter((item) => !this.authorityEvidence.some((known) => known.evidenceId.equals(item.evidenceId)))];
    this.authorityLineage = [...this.authorityLineage, ...command.lineage.filter((item) => !this.authorityLineage.some((known) => known.equals(item)))];
    const version = this.incrementVersion();
    this.authorityAudit = new GovernanceAuditMetadata({ createdAt: this.authorityAudit.createdAt, updatedAt: command.occurredAt, correlationId: command.correlationId, ...(command.causationId === undefined ? {} : { causationId: command.causationId }), version, actorReference: command.actorReference.value, reason: command.reason, evidence: this.authorityEvidence, lineage: this.authorityLineage });
    this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version, payload }));
    this.assertState();
  }
  private emit(EventType: new (props: import("./GovernanceEvents.js").GovernanceEventProps) => GovernanceDomainEvent, occurredAt: string, payload: JsonObject): void {
    const version = this.incrementVersion();
    this.recordEvent(new EventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt, version, payload }));
  }
  private assertState(): void {
    if (this.authorityStatus === AuthorityStatus.RETIRED && this.authoritySuspension !== null) throw new InvariantViolation("Retired Authority cannot remain suspended");
    for (const assignment of this.authorityAssignments) {
      if (!assignment.tenantId.equals(this.tenantId) || !assignment.authorityId.equals(this.id)) throw new InvariantViolation("Assignment cannot be shared between Authorities or Tenants");
    }
  }
}
