import type { JsonObject } from "../../../shared/common/serialization.js";
import { Entity } from "../../../shared/entity/Entity.js";
import { ApprovalId, EvidenceId, TenantId } from "../../../shared/identity/index.js";
import { ApprovalReference, AssignmentReference, AuthorityReference } from "../../../shared/references/index.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { ApprovalOutcome, type ApprovalOutcomeType } from "./ApprovalOutcome.js";
import { HumanActorReference } from "./HumanActorReference.js";

export interface ApprovalSnapshot {
  readonly approvalId: string; readonly tenantId: string; readonly outcome: ApprovalOutcomeType;
  readonly authorityReference: JsonObject; readonly assignmentReference: JsonObject | null;
  readonly actorReference: string; readonly reason: string; readonly occurredAt: string;
  readonly evidence: readonly JsonObject[]; readonly conditions: readonly string[];
}

export class Approval extends Entity<ApprovalId> {
  private readonly approvalTenantId: TenantId;
  private readonly approvalOutcome: ApprovalOutcomeType;
  private readonly approvalAuthority: AuthorityReference;
  private readonly approvalAssignment: AssignmentReference | undefined;
  private readonly approvalActor: HumanActorReference;
  private readonly approvalReason: string;
  private readonly approvalOccurredAt: string;
  private readonly approvalEvidence: readonly EvidenceReference[];
  private readonly approvalConditions: readonly string[];

  private constructor(id: ApprovalId, tenantId: TenantId, outcome: ApprovalOutcomeType, authorityReference: AuthorityReference, assignmentReference: AssignmentReference | undefined, actorReference: HumanActorReference, reason: string, occurredAt: string, evidence: readonly EvidenceReference[], conditions: readonly string[]) {
    super(id); this.approvalTenantId = tenantId; this.approvalOutcome = outcome; this.approvalAuthority = authorityReference;
    this.approvalAssignment = assignmentReference; this.approvalActor = actorReference; this.approvalReason = reason;
    this.approvalOccurredAt = occurredAt; this.approvalEvidence = [...evidence]; this.approvalConditions = [...conditions];
    Object.freeze(this.approvalEvidence); Object.freeze(this.approvalConditions);
    Object.defineProperty(this, "approvalTenantId", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalOutcome", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalAuthority", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalAssignment", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalActor", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalReason", { writable: false, configurable: false });
    Object.defineProperty(this, "approvalOccurredAt", { writable: false, configurable: false });
  }

  public static create(props: { readonly id: ApprovalId; readonly tenantId: TenantId; readonly outcome: ApprovalOutcomeType; readonly authorityReference: AuthorityReference; readonly assignmentReference?: AssignmentReference; readonly actorReference: HumanActorReference; readonly reason: string; readonly occurredAt: string; readonly evidence: readonly EvidenceReference[]; readonly conditions?: readonly string[] }): Approval {
    return new Approval(props.id, props.tenantId, props.outcome, props.authorityReference, props.assignmentReference, props.actorReference, props.reason.trim(), props.occurredAt, props.evidence, props.conditions ?? []);
  }

  public static fromSnapshot(snapshot: ApprovalSnapshot): Approval {
    return new Approval(ApprovalId.from(snapshot.approvalId), TenantId.from(snapshot.tenantId), snapshot.outcome, AuthorityReference.fromJSON(snapshot.authorityReference as { id: string; tenantId: string }), snapshot.assignmentReference === null ? undefined : AssignmentReference.fromJSON(snapshot.assignmentReference as { id: string; tenantId: string }), HumanActorReference.from(snapshot.actorReference), snapshot.reason, snapshot.occurredAt, snapshot.evidence.map((item) => new EvidenceReference({ evidenceId: EvidenceId.from(String(item.evidenceId)), source: String(item.source), type: String(item.type), capturedAt: String(item.capturedAt), ...(typeof item.locator === "string" ? { locator: item.locator } : {}), ...(typeof item.limitation === "string" ? { limitation: item.limitation } : {}) })), snapshot.conditions);
  }

  public get tenantId(): TenantId { return this.approvalTenantId; }
  public get outcome(): ApprovalOutcomeType { return this.approvalOutcome; }
  public get authorityReference(): AuthorityReference { return this.approvalAuthority; }
  public get assignmentReference(): AssignmentReference | undefined { return this.approvalAssignment; }
  public get actorReference(): HumanActorReference { return this.approvalActor; }
  public get reason(): string { return this.approvalReason; }
  public get occurredAt(): string { return this.approvalOccurredAt; }
  public get evidence(): readonly EvidenceReference[] { return [...this.approvalEvidence]; }
  public get conditions(): readonly string[] { return [...this.approvalConditions]; }
  public toSnapshot(): ApprovalSnapshot { return { approvalId: this.id.toString(), tenantId: this.tenantId.toString(), outcome: this.outcome, authorityReference: this.authorityReference.toJSON(), assignmentReference: this.assignmentReference?.toJSON() ?? null, actorReference: this.actorReference.value, reason: this.reason, occurredAt: this.occurredAt, evidence: this.evidence.map((item) => item.toJSON()), conditions: [...this.conditions] }; }
}
