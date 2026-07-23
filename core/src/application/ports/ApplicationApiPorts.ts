import type { AggregateDto, ApplicationCommandContext, ApproveDecisionRequestDto, AssignAuthorityRequestDto, AuthorityDto, CommittedOperationResultDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, DecisionDto, FinalizeDecisionRequestDto, GetAuthorityRequestDto, GetDecisionRequestDto, OperationCommandDto, QueryContext, QueryDto, RejectDecisionRequestDto } from "../dto/ApplicationContext.js";

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
