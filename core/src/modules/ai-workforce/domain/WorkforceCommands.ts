import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { AgentId, ExecutionId, TenantId, WorkAssignmentId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { AssignmentReference, AuthorityReference, DecisionReference, MissionReference, WorkAssignmentReference } from "../../../shared/references/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { AssignmentPolicyProps, AssignmentPolicy } from "./AssignmentPolicy.js";
import type { Capability, CapabilityProps } from "./Capability.js";
import type { ExecutionResult, ExecutionResultProps } from "./ExecutionResult.js";

export interface WorkforceAuditInput {
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
  readonly reason: string;
}

export interface ProvisionAgentCommand extends WorkforceAuditInput {
  readonly agentId: AgentId; readonly tenantId: TenantId; readonly name: string; readonly purpose: string;
  readonly capabilities: readonly Capability[] | readonly CapabilityProps[]; readonly definitionVersion: string;
}
export interface ActivateAgentCommand extends WorkforceAuditInput {}
export interface PauseAgentCommand extends WorkforceAuditInput {}
export interface ResumeAgentCommand extends WorkforceAuditInput {}
export interface RetireAgentCommand extends WorkforceAuditInput {}

export interface AssignAgentCommand extends WorkforceAuditInput {
  readonly workAssignmentId: WorkAssignmentId; readonly missionReference: MissionReference;
  readonly agentId: AgentId; readonly tenantId: TenantId; readonly title: string; readonly responsibility: string;
  readonly requiredCapabilities: readonly Capability[] | readonly CapabilityProps[];
  readonly assignmentPolicy?: AssignmentPolicy | AssignmentPolicyProps;
  readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference;
  readonly governanceAssignmentReference?: AssignmentReference;
}
export interface StartExecutionCommand extends WorkforceAuditInput { readonly executionId: ExecutionId; readonly workAssignmentReference: WorkAssignmentReference; readonly agentReference: import("../../../shared/references/AgentReference.js").AgentReference; readonly missionReference: MissionReference; readonly tenantId: TenantId; }
export interface CompleteExecutionCommand extends WorkforceAuditInput { readonly result: ExecutionResult | ExecutionResultProps; }
export interface FailExecutionCommand extends WorkforceAuditInput { readonly failure: string; }
export interface CancelExecutionCommand extends WorkforceAuditInput {}
export interface CompleteAssignmentCommand extends WorkforceAuditInput {}
export interface CancelAssignmentCommand extends WorkforceAuditInput {}

export interface PersistedWorkforceCommand<T> { readonly tenantId: TenantId; readonly expectedVersion: Version; readonly command: T; }
