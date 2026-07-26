import type { JsonObject } from "../../shared/common/serialization.js";

export interface ActorReference { readonly reference: string; }
export interface ApplicationCommandContext { readonly tenantId: string; readonly actor: ActorReference; readonly correlationId: string; readonly causationId?: string; }
export interface QueryContext { readonly tenantId: string; readonly actor?: ActorReference; readonly correlationId: string; }
export interface MutableCommandDto { readonly idempotencyKey: string; readonly reason: string; }
export interface OperationCommandDto extends MutableCommandDto { readonly targetId?: string; readonly payload: JsonObject; }
export interface QueryDto { readonly targetId?: string; readonly filters?: JsonObject; }
export interface AggregateDto { readonly aggregateType: string; readonly id: string; readonly tenantId: string; readonly version: number; readonly status?: string; readonly data: JsonObject; }
export interface CommittedResourceReferenceDto { readonly resourceType: string; readonly resourceId: string; }
export interface CommittedOperationResultDto {
  readonly transactionId: string;
  readonly status: "COMMITTED";
  readonly resourceReferences: readonly CommittedResourceReferenceDto[];
}
export interface ApplicationResult<T> { readonly value: T; }

export interface GovernanceCommandRequestDto extends OperationCommandDto {}
export interface CreateAuthorityRequestDto extends GovernanceCommandRequestDto {}
export interface AssignAuthorityRequestDto extends GovernanceCommandRequestDto {}
export interface CreateDecisionRequestDto extends GovernanceCommandRequestDto {}
export interface ApproveDecisionRequestDto extends GovernanceCommandRequestDto {}
export interface RejectDecisionRequestDto extends GovernanceCommandRequestDto {}
export interface FinalizeDecisionRequestDto extends GovernanceCommandRequestDto {}
export interface GetAuthorityRequestDto extends QueryDto {}
export interface GetDecisionRequestDto extends QueryDto {}

export interface AIWorkforceCommandRequestDto extends OperationCommandDto {}
export interface ProvisionAgentRequestDto extends AIWorkforceCommandRequestDto {}
export interface AssignAgentRequestDto extends AIWorkforceCommandRequestDto {}
export interface StartExecutionRequestDto extends AIWorkforceCommandRequestDto {}
export interface CompleteExecutionRequestDto extends AIWorkforceCommandRequestDto {}
export interface GetAgentRequestDto extends QueryDto {}
export interface GetExecutionRequestDto extends QueryDto {}

export interface ProvisionAgentResponseDto extends CommittedOperationResultDto {}
export interface AssignAgentResponseDto extends CommittedOperationResultDto {}
export interface StartExecutionResponseDto extends CommittedOperationResultDto {}
export interface CompleteExecutionResponseDto extends CommittedOperationResultDto {}

export interface AgentCapabilityDto { readonly name: string; readonly scope: string; readonly qualityCriteria: readonly string[]; readonly limitations: readonly string[]; }
export interface AgentDto {
  readonly agentId: string;
  readonly tenantId: string;
  readonly name: string;
  readonly purpose: string;
  readonly definitionVersion: string;
  readonly lifecycleStatus: string;
  readonly status: string;
  readonly availability: string;
  readonly capabilities: readonly AgentCapabilityDto[];
  readonly assignments: readonly JsonObject[];
  readonly version: number;
}
export interface ExecutionDto {
  readonly executionId: string;
  readonly tenantId: string;
  readonly missionReference: GovernanceReferenceDto;
  readonly agentReference: GovernanceReferenceDto;
  readonly workAssignmentReference: GovernanceReferenceDto;
  readonly status: string;
  readonly result: JsonObject | null;
  readonly failure: string | null;
  readonly version: number;
}

export interface GovernanceReferenceDto { readonly id: string; readonly tenantId: string; }
export interface AuthorityAssignmentDto {
  readonly assignmentId: string;
  readonly delegateReference: string;
  readonly scope: JsonObject;
  readonly period: { readonly startsAt: string; readonly endsAt: string };
  readonly status: string;
}
export interface AuthorityDto {
  readonly authorityId: string;
  readonly tenantId: string;
  readonly actorReference: string;
  readonly level: string;
  readonly scope: JsonObject;
  readonly status: string;
  readonly version: number;
  readonly assignments: readonly AuthorityAssignmentDto[];
}
export interface DecisionApprovalDto {
  readonly approvalId: string;
  readonly outcome: string;
  readonly authorityReference: GovernanceReferenceDto;
  readonly assignmentReference?: GovernanceReferenceDto;
}
export interface DecisionDto {
  readonly decisionId: string;
  readonly tenantId: string;
  readonly missionId: string;
  readonly decisionType: string;
  readonly status: string;
  readonly version: number;
  readonly authorityReference: GovernanceReferenceDto;
  readonly assignmentReference?: GovernanceReferenceDto;
  readonly approval?: DecisionApprovalDto;
}
