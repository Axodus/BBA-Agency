import type { AggregateDto, AgentDto, ApplicationCommandContext, ApproveDecisionRequestDto, AssignAgentRequestDto, AssignAgentResponseDto, AssignAuthorityRequestDto, AssetCommandResponseDto, AssetDto, AssetSummaryDto, AuthorityDto, CommittedOperationResultDto, CompleteExecutionRequestDto, CompleteExecutionResponseDto, CreateAssetRequestDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, CreateKnowledgeRequestDto, CreatePolicyRequestDto, CreatePolicyVersionRequestDto, CurateKnowledgeRequestDto, DecisionDto, ExecutionDto, FinalizeDecisionRequestDto, GetAgentRequestDto, GetAssetRequestDto, GetAuthorityRequestDto, GetDecisionRequestDto, GetExecutionRequestDto, GetKnowledgeRequestDto, GetPolicyRequestDto, KnowledgeDto, LinkKnowledgeAssetRequestDto, ListAssetsRequestDto, ListKnowledgeRequestDto, ListPoliciesRequestDto, OperationCommandDto, PolicyDto, ProvisionAgentRequestDto, ProvisionAgentResponseDto, QueryContext, QueryDto, RegisterAssetRequestDto, RejectDecisionRequestDto, RetireAssetRequestDto, StartExecutionRequestDto, StartExecutionResponseDto } from "../dto/ApplicationContext.js";

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

export interface InstitutionalAssetsCommandApiPort {
  createAsset(command: CreateAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto>;
  registerAsset(command: RegisterAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto>;
  retireAsset(command: RetireAssetRequestDto, context: ApplicationCommandContext): Promise<AssetCommandResponseDto>;
}
export interface InstitutionalAssetsQueryApiPort {
  getAsset(query: GetAssetRequestDto, context: QueryContext): Promise<AssetDto | null>;
  listAssets(query: ListAssetsRequestDto, context: QueryContext): Promise<readonly AssetSummaryDto[]>;
}
export interface KnowledgePolicyCommandApiPort {
  createKnowledge(command: CreateKnowledgeRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  curateKnowledge(command: CurateKnowledgeRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  linkKnowledgeAsset(command: LinkKnowledgeAssetRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  createPolicy(command: CreatePolicyRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  createPolicyVersion(command: CreatePolicyVersionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
}
export interface KnowledgePolicyQueryApiPort { getKnowledge(query: GetKnowledgeRequestDto, context: QueryContext): Promise<KnowledgeDto | null>; listKnowledge(query: ListKnowledgeRequestDto, context: QueryContext): Promise<readonly KnowledgeDto[]>; getPolicy(query: GetPolicyRequestDto, context: QueryContext): Promise<PolicyDto | null>; listPolicies(query: ListPoliciesRequestDto, context: QueryContext): Promise<readonly PolicyDto[]>; }
