import type { AggregateDto, AgentDto, ApplicationCommandContext, ApproveDecisionRequestDto, AssignAgentRequestDto, AssignAgentResponseDto, AssignAuthorityRequestDto, AssetCommandResponseDto, AssetDto, AssetSummaryDto, AuthorityDto, CommittedOperationResultDto, CompleteExecutionRequestDto, CompleteExecutionResponseDto, ConnectorCommandRequestDto, ConnectorDto, ConnectorExecutionDto, CreateAssetRequestDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, CreateKnowledgeRequestDto, CreatePolicyRequestDto, CreatePolicyVersionRequestDto, CurateKnowledgeRequestDto, DecisionDto, ExecutionDto, FinalizeDecisionRequestDto, GetAgentRequestDto, GetAssetRequestDto, GetAuthorityRequestDto, GetConnectorExecutionRequestDto, GetConnectorRequestDto, GetDecisionRequestDto, GetExecutionRequestDto, GetKnowledgeRequestDto, GetPolicyRequestDto, GetPublicationRequestDto, GetReviewRequestDto, GetWorkflowExecutionRequestDto, GetWorkflowRequestDto, KnowledgeDto, LinkKnowledgeAssetRequestDto, ListAssetsRequestDto, ListKnowledgeRequestDto, ListPoliciesRequestDto, OperationCommandDto, PolicyDto, ProvisionAgentRequestDto, ProvisionAgentResponseDto, PublicationCommandRequestDto, PublicationDto, QueryContext, QueryDto, RegisterAssetRequestDto, RejectDecisionRequestDto, RetireAssetRequestDto, ReviewCommandRequestDto, ReviewDto, StartExecutionRequestDto, StartExecutionResponseDto, WorkflowCommandRequestDto, WorkflowDto, WorkflowExecutionDto } from "../dto/ApplicationContext.js";

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
export interface WorkflowCommandApiPort { createWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; activateWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; archiveWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; startWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; advanceStage(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; pauseWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; resumeWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; recordTaskState(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; recordTaskFailure(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; completeWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; cancelWorkflow(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; failWorkflowExecution(command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; }
export interface WorkflowQueryApiPort { getWorkflow(query: GetWorkflowRequestDto, context: QueryContext): Promise<WorkflowDto | null>; getWorkflowExecution(query: GetWorkflowExecutionRequestDto, context: QueryContext): Promise<WorkflowExecutionDto | null>; }
export interface ReviewCommandApiPort { createReview(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; startReview(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; planSession(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; openSession(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; recordFinding(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; closeSession(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; cancelSession(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; completeReview(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; archiveReview(command: ReviewCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; }
export interface ReviewQueryApiPort { getReview(query: GetReviewRequestDto, context: QueryContext): Promise<ReviewDto | null>; }
export interface PublicationCommandApiPort { createPublication(command: PublicationCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; preparePublication(command: PublicationCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; authorizePublication(command: PublicationCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; recordPublicationOutcome(command: PublicationCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; archivePublication(command: PublicationCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; }
export interface PublicationQueryApiPort { getPublication(query: GetPublicationRequestDto, context: QueryContext): Promise<PublicationDto | null>; }
export interface ConnectorCommandApiPort { registerConnector(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; activateConnector(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; suspendConnector(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; retireConnector(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; createExecution(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; startExecution(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; completeExecution(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; failExecution(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; cancelExecution(command: ConnectorCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>; }
export interface ConnectorQueryApiPort { getConnector(query: GetConnectorRequestDto, context: QueryContext): Promise<ConnectorDto | null>; getConnectorExecution(query: GetConnectorExecutionRequestDto, context: QueryContext): Promise<ConnectorExecutionDto | null>; }
