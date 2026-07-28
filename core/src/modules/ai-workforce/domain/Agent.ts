import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../shared/identity/EvidenceId.js";
import { AgentId } from "../../../shared/identity/AgentId.js";
import { TenantId } from "../../../shared/identity/TenantId.js";
import { LineageReference, type LineageReferenceProps } from "../../../shared/lineage/LineageReference.js";
import { AgentReference } from "../../../shared/references/AgentReference.js";
import { MissionReference } from "../../../shared/references/MissionReference.js";
import { AuthorityReference, DecisionReference } from "../../../shared/references/index.js";
import { assertSameTenant } from "../../../shared/tenant/tenantRules.js";
import { Version } from "../../../shared/version/Version.js";
import { AssignmentPolicy } from "./AssignmentPolicy.js";
import { Capability, CapabilitySet, type CapabilityProps } from "./Capability.js";
import type { AgentAvailabilityStatus, AgentLifecycleStatus, AgentStatus } from "./AgentStatus.js";
import type { AssignAgentCommand, ActivateAgentCommand, PauseAgentCommand, ProvisionAgentCommand, ResumeAgentCommand, RetireAgentCommand } from "./WorkforceCommands.js";
import { AgentActivated, AgentAssigned, AgentPaused, AgentProvisioned, AgentResumed, AgentRetired } from "./WorkforceEvents.js";
import { WorkAssignment } from "./WorkAssignment.js";

export interface AgentSnapshot {
  readonly agentId: string; readonly tenantId: string; readonly name: string; readonly purpose: string; readonly definitionVersion: string;
  readonly lifecycleStatus: AgentLifecycleStatus; readonly capabilities: JsonObject; readonly evidence: readonly JsonObject[]; readonly lineage: readonly JsonObject[];
  readonly assignments: readonly JsonObject[]; readonly version: number;
}

function capabilityValues(items: readonly Capability[] | readonly CapabilityProps[]): Capability[] { return items.map((item) => item instanceof Capability ? item : new Capability(item)); }
function evidenceFrom(value: JsonObject): EvidenceReference { return new EvidenceReference({ evidenceId: EvidenceId.from(String(value.evidenceId)), source: String(value.source), type: String(value.type), capturedAt: String(value.capturedAt), ...(typeof value.locator === "string" ? { locator: value.locator } : {}), ...(typeof value.limitation === "string" ? { limitation: value.limitation } : {}) }); }
function lineageFrom(value: JsonObject): LineageReference { return new LineageReference(value as unknown as LineageReferenceProps); }

export class Agent extends AggregateRoot<AgentId> {
  private readonly agentTenantId: TenantId; private readonly agentName: string; private readonly agentPurpose: string; private readonly agentDefinitionVersion: string;
  private readonly agentCapabilities: CapabilitySet; private readonly agentEvidence: EvidenceReference[]; private readonly agentLineage: LineageReference[]; private agentLifecycle: AgentLifecycleStatus; private agentAssignments: WorkAssignment[];

  private constructor(id: AgentId, tenantId: TenantId, state: { name: string; purpose: string; definitionVersion: string; capabilities: CapabilitySet; evidence: EvidenceReference[]; lineage: LineageReference[]; lifecycleStatus: AgentLifecycleStatus; assignments: WorkAssignment[]; version: Version }) {
    super(id, state.version); this.agentTenantId = tenantId; this.agentName = state.name; this.agentPurpose = state.purpose; this.agentDefinitionVersion = state.definitionVersion; this.agentCapabilities = state.capabilities; this.agentEvidence = [...state.evidence]; this.agentLineage = [...state.lineage]; this.agentLifecycle = state.lifecycleStatus; this.agentAssignments = [...state.assignments];
    Object.defineProperty(this, "agentTenantId", { writable: false, configurable: false }); Object.defineProperty(this, "agentName", { writable: false, configurable: false }); Object.defineProperty(this, "agentPurpose", { writable: false, configurable: false }); Object.defineProperty(this, "agentDefinitionVersion", { writable: false, configurable: false });
  }

  public static provision(command: ProvisionAgentCommand): Agent {
    const agent = new Agent(command.agentId, command.tenantId, { name: command.name.trim(), purpose: command.purpose.trim(), definitionVersion: command.definitionVersion.trim(), capabilities: new CapabilitySet(capabilityValues(command.capabilities)), evidence: [...command.evidence], lineage: [...command.lineage], lifecycleStatus: "PROPOSED", assignments: [], version: Version.initial() });
    if (agent.agentName.length === 0 || agent.agentPurpose.length === 0 || agent.agentDefinitionVersion.length === 0) throw new InvariantViolation("Agent identity, purpose and definition version are required");
    agent.changeVersion(); agent.emit(AgentProvisioned, command); return agent;
  }

  public static rehydrate(snapshot: AgentSnapshot): Agent {
    const tenantId = TenantId.from(snapshot.tenantId); const assignments = snapshot.assignments.map((item) => WorkAssignment.fromSnapshot(item));
    for (const assignment of assignments) assertSameTenant(tenantId, assignment.tenantId);
    return new Agent(AgentId.from(snapshot.agentId), tenantId, { name: snapshot.name, purpose: snapshot.purpose, definitionVersion: snapshot.definitionVersion, capabilities: CapabilitySet.fromJSON(snapshot.capabilities), evidence: snapshot.evidence.map(evidenceFrom), lineage: snapshot.lineage.map(lineageFrom), lifecycleStatus: snapshot.lifecycleStatus, assignments, version: Version.from(snapshot.version) });
  }

  public get tenantId(): TenantId { return this.agentTenantId; } public get name(): string { return this.agentName; } public get purpose(): string { return this.agentPurpose; } public get definitionVersion(): string { return this.agentDefinitionVersion; } public get capabilities(): CapabilitySet { return this.agentCapabilities; } public get evidence(): readonly EvidenceReference[] { return [...this.agentEvidence]; } public get lineage(): readonly LineageReference[] { return [...this.agentLineage]; } public get lifecycleStatus(): AgentLifecycleStatus { return this.agentLifecycle; } public get assignments(): readonly WorkAssignment[] { return [...this.agentAssignments]; }
  public get availability(): AgentAvailabilityStatus { if (this.agentLifecycle === "SUSPENDED") return "PAUSED"; if (this.agentAssignments.some((item) => item.status === "ASSIGNED" || item.status === "ACTIVE")) return "BUSY"; return "AVAILABLE"; }
  public get status(): AgentStatus { if (this.agentLifecycle === "PROPOSED") return "PROVISIONED"; if (this.agentLifecycle === "RETIRED") return "RETIRED"; return this.availability; }

  public activate(command: ActivateAgentCommand): void { if (this.agentLifecycle !== "PROPOSED") throw new InvariantViolation(`Agent cannot activate from ${this.agentLifecycle}`); this.agentLifecycle = "ACTIVE"; this.changeVersion(); this.emit(AgentActivated, command); }
  public pause(command: PauseAgentCommand): void { if (this.agentLifecycle !== "ACTIVE") throw new InvariantViolation(`Agent cannot pause from ${this.agentLifecycle}`); this.agentLifecycle = "SUSPENDED"; this.changeVersion(); this.emit(AgentPaused, command); }
  public resume(command: ResumeAgentCommand): void { if (this.agentLifecycle !== "SUSPENDED") throw new InvariantViolation(`Agent cannot resume from ${this.agentLifecycle}`); this.agentLifecycle = "ACTIVE"; this.changeVersion(); this.emit(AgentResumed, command); }
  public retire(command: RetireAgentCommand): void { if (this.agentLifecycle === "RETIRED") throw new InvariantViolation("Agent is already retired"); this.agentLifecycle = "RETIRED"; this.changeVersion(); this.emit(AgentRetired, command); }

  public assign(command: AssignAgentCommand): WorkAssignment {
    if (this.agentLifecycle !== "ACTIVE") throw new InvariantViolation("Only an active Agent can receive a WorkAssignment");
    assertSameTenant(this.tenantId, command.tenantId); assertSameTenant(this.tenantId, command.missionReference.tenantId); assertSameTenant(this.tenantId, command.authorityReference.tenantId); assertSameTenant(this.tenantId, command.decisionReference.tenantId);
    if (!this.agentCapabilities.satisfies(capabilityValues(command.requiredCapabilities))) throw new InvariantViolation("Agent lacks a required Capability");
    const policy = command.assignmentPolicy instanceof AssignmentPolicy ? command.assignmentPolicy : new AssignmentPolicy(command.assignmentPolicy);
    const conflicts = this.agentAssignments.some((item) => (item.status === "ASSIGNED" || item.status === "ACTIVE") && item.policy.conflictsWith(policy));
    if (conflicts) throw new InvariantViolation("Agent cannot execute incompatible WorkAssignments simultaneously");
    const assignmentProps = { id: command.workAssignmentId, tenantId: command.tenantId, missionReference: command.missionReference, agentReference: new AgentReference(this.id, this.tenantId), title: command.title, responsibility: command.responsibility, requiredCapabilities: capabilityValues(command.requiredCapabilities), policy, authorityReference: command.authorityReference, decisionReference: command.decisionReference, evidence: command.evidence.map((item) => item.toJSON()), lineage: command.lineage.map((item) => item.toJSON()), createdAt: command.occurredAt, updatedAt: command.occurredAt, ...(command.governanceAssignmentReference ? { governanceAssignmentReference: command.governanceAssignmentReference } : {}) };
    const assignment = new WorkAssignment(assignmentProps);
    assignment.assign(command.occurredAt); this.agentAssignments = [...this.agentAssignments, assignment]; this.changeVersion(); this.emit(AgentAssigned, command, { workAssignmentId: assignment.id.toString(), missionId: assignment.missionReference.id.toString() }); return assignment;
  }

  public startAssignment(workAssignmentId: import("../../../shared/identity/WorkAssignmentId.js").WorkAssignmentId, occurredAt: string): void {
    const assignment = this.agentAssignments.find((item) => item.id.equals(workAssignmentId));
    if (assignment === undefined) throw new InvariantViolation("WorkAssignment does not belong to Agent");
    assignment.start(occurredAt); this.changeVersion();
  }

  public toSnapshot(): AgentSnapshot { return { agentId: this.id.toString(), tenantId: this.tenantId.toString(), name: this.name, purpose: this.purpose, definitionVersion: this.definitionVersion, lifecycleStatus: this.lifecycleStatus, capabilities: this.capabilities.toJSON(), evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), assignments: this.assignments.map((item) => item.toSnapshot()), version: this.version.value }; }
  private changeVersion(): void { this.incrementVersion(); }
  private emit(eventType: new (props: import("./WorkforceEvents.js").WorkforceEventProps) => import("./WorkforceEvents.js").WorkforceDomainEvent, command: { occurredAt: string; correlationId: CorrelationId; causationId?: CausationId; evidence: readonly EvidenceReference[]; lineage: readonly LineageReference[] }, payload: JsonObject = {}): void { this.recordEvent(new eventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version, correlationId: command.correlationId.toString(), ...(command.causationId ? { causationId: command.causationId.toString() } : {}), evidenceIds: command.evidence.map((item) => item.evidenceId.toString()), lineage: command.lineage.map((item) => item.toJSON()), payload })); }
}
