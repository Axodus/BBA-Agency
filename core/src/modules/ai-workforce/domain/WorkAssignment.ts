import { Entity } from "../../../shared/entity/Entity.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { assertCanonicalTimestamp } from "../../../shared/common/timestamps.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { AssignmentReference, AuthorityReference, DecisionReference, MissionReference } from "../../../shared/references/index.js";
import { AgentReference } from "../../../shared/references/AgentReference.js";
import { TenantId } from "../../../shared/identity/TenantId.js";
import { WorkAssignmentId } from "../../../shared/identity/WorkAssignmentId.js";
import { Capability, type CapabilityProps } from "./Capability.js";
import { AssignmentPolicy } from "./AssignmentPolicy.js";
import type { AssignmentStatus } from "./AssignmentStatus.js";

export interface WorkAssignmentProps {
  readonly id: WorkAssignmentId; readonly tenantId: TenantId; readonly missionReference: MissionReference; readonly agentReference: AgentReference;
  readonly title: string; readonly responsibility: string; readonly requiredCapabilities: readonly Capability[] | readonly CapabilityProps[];
  readonly policy: AssignmentPolicy; readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference;
  readonly governanceAssignmentReference?: AssignmentReference; readonly evidence: readonly JsonObject[]; readonly lineage: readonly JsonObject[];
  readonly createdAt: string; readonly updatedAt: string; readonly status?: AssignmentStatus;
}

export class WorkAssignment extends Entity<WorkAssignmentId> {
  public readonly tenantId: TenantId; public readonly missionReference: MissionReference; public readonly agentReference: AgentReference;
  public readonly title: string; public readonly responsibility: string; public readonly requiredCapabilities: readonly Capability[];
  public readonly policy: AssignmentPolicy; public readonly authorityReference: AuthorityReference; public readonly decisionReference: DecisionReference;
  public readonly governanceAssignmentReference: AssignmentReference | undefined; public readonly evidence: readonly JsonObject[]; public readonly lineage: readonly JsonObject[];
  public readonly createdAt: string; private assignmentUpdatedAt: string; private assignmentStatus: AssignmentStatus;

  public constructor(props: WorkAssignmentProps) {
    const title = props.title.trim(); const responsibility = props.responsibility.trim();
    if (title.length === 0 || responsibility.length === 0) throw new ValidationError("WorkAssignment title and responsibility are required");
    if (!props.missionReference.tenantId.equals(props.tenantId) || !props.agentReference.tenantId.equals(props.tenantId) || !props.authorityReference.tenantId.equals(props.tenantId) || !props.decisionReference.tenantId.equals(props.tenantId) || (props.governanceAssignmentReference !== undefined && !props.governanceAssignmentReference.tenantId.equals(props.tenantId))) throw new InvariantViolation("WorkAssignment references must belong to its Tenant");
    super(props.id); this.tenantId = props.tenantId; this.missionReference = props.missionReference; this.agentReference = props.agentReference; this.title = title; this.responsibility = responsibility;
    this.requiredCapabilities = Object.freeze(props.requiredCapabilities.map((item) => item instanceof Capability ? item : new Capability(item)));
    this.policy = props.policy; this.authorityReference = props.authorityReference; this.decisionReference = props.decisionReference; this.governanceAssignmentReference = props.governanceAssignmentReference;
    this.evidence = Object.freeze([...props.evidence]); this.lineage = Object.freeze([...props.lineage]); this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt"); this.assignmentUpdatedAt = assertCanonicalTimestamp(props.updatedAt, "updatedAt");
    this.assignmentStatus = props.status ?? "UNASSIGNED";
  }

  public get status(): AssignmentStatus { return this.assignmentStatus; }
  public get updatedAt(): string { return this.assignmentUpdatedAt; }
  public isActive(): boolean { return this.assignmentStatus === "ASSIGNED" || this.assignmentStatus === "ACTIVE" || this.assignmentStatus === "AWAITING_REVIEW"; }
  public assign(at: string): void { this.transition("ASSIGNED", at, ["UNASSIGNED"]); }
  public start(at: string): void { this.transition("ACTIVE", at, ["ASSIGNED", "BLOCKED"]); }
  public block(at: string): void { this.transition("BLOCKED", at, ["ASSIGNED", "ACTIVE"]); }
  public refuse(at: string): void { this.transition("REFUSED", at, ["UNASSIGNED", "ASSIGNED"]); }
  public awaitReview(at: string): void { this.transition("AWAITING_REVIEW", at, ["ACTIVE"]); }
  public complete(at: string): void { this.transition("COMPLETED", at, ["ACTIVE", "AWAITING_REVIEW"]); }
  public cancel(at: string): void { this.transition("CANCELLED", at, ["UNASSIGNED", "ASSIGNED", "ACTIVE", "BLOCKED", "AWAITING_REVIEW"]); }
  public fail(at: string): void { this.transition("FAILED", at, ["ACTIVE", "BLOCKED"]); }
  public toSnapshot(): JsonObject { return { id: this.id.toString(), tenantId: this.tenantId.toString(), missionReference: this.missionReference.toJSON(), agentReference: this.agentReference.toJSON(), title: this.title, responsibility: this.responsibility, requiredCapabilities: this.requiredCapabilities.map((item) => item.toJSON()), policy: this.policy.toJSON(), authorityReference: this.authorityReference.toJSON(), decisionReference: this.decisionReference.toJSON(), ...(this.governanceAssignmentReference ? { governanceAssignmentReference: this.governanceAssignmentReference.toJSON() } : {}), evidence: [...this.evidence], lineage: [...this.lineage], createdAt: this.createdAt, updatedAt: this.updatedAt, status: this.status };
  }
  public static fromSnapshot(value: JsonObject): WorkAssignment { const props = { id: WorkAssignmentId.from(String(value.id)), tenantId: TenantId.from(String(value.tenantId)), missionReference: MissionReference.fromJSON(value.missionReference as { id: string; tenantId: string }), agentReference: AgentReference.fromJSON(value.agentReference as { id: string; tenantId: string }), title: String(value.title), responsibility: String(value.responsibility), requiredCapabilities: Array.isArray(value.requiredCapabilities) ? value.requiredCapabilities.map((item) => Capability.fromJSON(item as JsonObject)) : [], policy: AssignmentPolicy.fromJSON(value.policy as JsonObject), authorityReference: AuthorityReference.fromJSON(value.authorityReference as { id: string; tenantId: string }), decisionReference: DecisionReference.fromJSON(value.decisionReference as { id: string; tenantId: string }), evidence: Array.isArray(value.evidence) ? value.evidence as JsonObject[] : [], lineage: Array.isArray(value.lineage) ? value.lineage as JsonObject[] : [], createdAt: String(value.createdAt), updatedAt: String(value.updatedAt), status: String(value.status) as AssignmentStatus, ...(value.governanceAssignmentReference ? { governanceAssignmentReference: AssignmentReference.fromJSON(value.governanceAssignmentReference as { id: string; tenantId: string }) } : {}) }; return new WorkAssignment(props); }

  private transition(next: AssignmentStatus, at: string, allowed: readonly AssignmentStatus[]): void { if (!allowed.includes(this.assignmentStatus)) throw new InvariantViolation(`WorkAssignment cannot transition from ${this.assignmentStatus} to ${next}`); this.assignmentStatus = next; this.assignmentUpdatedAt = assertCanonicalTimestamp(at, "occurredAt"); }
}
