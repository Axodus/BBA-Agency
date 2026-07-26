import type { AggregateDto, AgentDto, ApplicationCommandContext, ApproveDecisionRequestDto, AssignAgentRequestDto, AssignAgentResponseDto, AssignAuthorityRequestDto, AuthorityDto, CommittedOperationResultDto, CompleteExecutionRequestDto, CompleteExecutionResponseDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, DecisionDto, ExecutionDto, FinalizeDecisionRequestDto, GetAgentRequestDto, GetAuthorityRequestDto, GetDecisionRequestDto, GetExecutionRequestDto, OperationCommandDto, ProvisionAgentRequestDto, ProvisionAgentResponseDto, QueryContext, QueryDto, RejectDecisionRequestDto, StartExecutionRequestDto, StartExecutionResponseDto } from "../dto/ApplicationContext.js";

export interface MissionCommandApiPort {
  createMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  activateMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  renameMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  completeMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
}
export interface MissionQueryApiPort { getMission(query: QueryDto, context: QueryContext): Promise<AggregateDto | null>; }

export interface GovernanceCommandApiPort {
  createAuthority(command: CreateAuthorityRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  assignAuthority(command: AssignAuthorityRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  createDecision(command: CreateDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  approveDecision(command: ApproveDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  rejectDecision(command: RejectDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  finalizeDecision(command: FinalizeDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
}

export interface GovernanceQueryApiPort {
  getAuthority(query: GetAuthorityRequestDto, context: QueryContext): Promise<AuthorityDto | null>;
  getDecision(query: GetDecisionRequestDto, context: QueryContext): Promise<DecisionDto | null>;
}

export interface AIWorkforceCommandApiPort {
  provisionAgent(command: ProvisionAgentRequestDto, context: ApplicationCommandContext): Promise<ProvisionAgentResponseDto>;
  assignAgent(command: AssignAgentRequestDto, context: ApplicationCommandContext): Promise<AssignAgentResponseDto>;
  startExecution(command: StartExecutionRequestDto, context: ApplicationCommandContext): Promise<StartExecutionResponseDto>;
  completeExecution(command: CompleteExecutionRequestDto, context: ApplicationCommandContext): Promise<CompleteExecutionResponseDto>;
}

export interface AIWorkforceQueryApiPort {
  getAgent(query: GetAgentRequestDto, context: QueryContext): Promise<AgentDto | null>;
  getExecution(query: GetExecutionRequestDto, context: QueryContext): Promise<ExecutionDto | null>;
}
