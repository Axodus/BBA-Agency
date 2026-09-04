import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { agentKeys, assetKeys, authorityKeys, connectorKeys, decisionKeys, executionKeys, knowledgeKeys, missionKeys, policyKeys, publicationKeys, reviewKeys, workflowKeys } from "../query-keys/product-keys.js";

export type ProductQueryTarget = "mission.detail" | "authority.detail" | "decision.detail" | "agent.detail" | "execution.detail" | "asset.detail" | "asset.list" | "knowledge.detail" | "knowledge.list" | "policy.detail" | "policy.list" | "workflow.detail" | "workflowExecution.detail" | "review.detail" | "publication.detail" | "connector.detail" | "connectorExecution.detail";
export interface CommandInvalidationRule { readonly exactTargets: readonly ProductQueryTarget[]; readonly prefixTargets: readonly ProductQueryTarget[]; readonly refetch: "active" | "all" | "none"; }
const rule = (exactTargets: readonly ProductQueryTarget[], prefixTargets: readonly ProductQueryTarget[] = []): CommandInvalidationRule => ({ exactTargets, prefixTargets, refetch: "active" });

export const commandInvalidationPolicy: Readonly<Record<string, CommandInvalidationRule>> = Object.freeze({
  missionCreateMission: rule(["mission.detail"]), missionActivateMission: rule(["mission.detail"]), missionRenameMission: rule(["mission.detail"]), missionCompleteMission: rule(["mission.detail"]),
  governanceCreateAuthority: rule(["authority.detail"]), governanceAssignAuthority: rule(["authority.detail"]), governanceCreateDecision: rule(["decision.detail"]), governanceApproveDecision: rule(["decision.detail"]), governanceRejectDecision: rule(["decision.detail"]), governanceFinalizeDecision: rule(["decision.detail"]),
  aiWorkforceProvisionAgent: rule(["agent.detail"]), aiWorkforceAssignAgent: rule(["agent.detail"]), aiWorkforceStartExecution: rule(["agent.detail", "execution.detail"]), aiWorkforceCompleteExecution: rule(["execution.detail"]),
  institutionalAssetsCreateAsset: rule(["asset.detail"], ["asset.list"]), institutionalAssetsRegisterAsset: rule(["asset.detail"], ["asset.list"]), institutionalAssetsRetireAsset: rule(["asset.detail"], ["asset.list"]),
  knowledgePolicyCreateKnowledge: rule(["knowledge.detail"], ["knowledge.list"]), knowledgePolicyCurateKnowledge: rule(["knowledge.detail"], ["knowledge.list"]), knowledgePolicyLinkKnowledgeAsset: rule(["knowledge.detail"], ["knowledge.list"]),
  knowledgePolicyCreatePolicy: rule(["policy.detail"], ["policy.list"]), knowledgePolicyCreatePolicyVersion: rule(["policy.detail"], ["policy.list"]),
  workflowCreateWorkflow: rule(["workflow.detail"]), workflowActivateWorkflow: rule(["workflow.detail"]), workflowArchiveWorkflow: rule(["workflow.detail"]), workflowStartWorkflow: rule(["workflow.detail", "workflowExecution.detail"]),
  workflowAdvanceStage: rule(["workflowExecution.detail"]), workflowPauseWorkflow: rule(["workflowExecution.detail"]), workflowResumeWorkflow: rule(["workflowExecution.detail"]), workflowRecordTaskState: rule(["workflowExecution.detail"]), workflowRecordTaskFailure: rule(["workflowExecution.detail"]), workflowCompleteWorkflow: rule(["workflowExecution.detail"]), workflowCancelWorkflow: rule(["workflowExecution.detail"]), workflowFailWorkflowExecution: rule(["workflowExecution.detail"]),
  reviewCreateReview: rule(["review.detail"]), reviewStartReview: rule(["review.detail"]), reviewPlanSession: rule(["review.detail"]), reviewOpenSession: rule(["review.detail"]), reviewRecordFinding: rule(["review.detail"]), reviewCloseSession: rule(["review.detail"]), reviewCancelSession: rule(["review.detail"]), reviewCompleteReview: rule(["review.detail"]), reviewArchiveReview: rule(["review.detail"]),
  publicationCreatePublication: rule(["publication.detail"]), publicationPreparePublication: rule(["publication.detail"]), publicationAuthorizePublication: rule(["publication.detail"]), publicationRecordPublicationOutcome: rule(["publication.detail"]), publicationArchivePublication: rule(["publication.detail"]),
  connectorRegisterConnector: rule(["connector.detail"]), connectorActivateConnector: rule(["connector.detail"]), connectorSuspendConnector: rule(["connector.detail"]), connectorRetireConnector: rule(["connector.detail"]), connectorCreateExecution: rule(["connectorExecution.detail"]), connectorStartExecution: rule(["connectorExecution.detail"]), connectorCompleteExecution: rule(["connectorExecution.detail"]), connectorFailExecution: rule(["connectorExecution.detail"]), connectorCancelExecution: rule(["connectorExecution.detail"])
});

export interface InvalidationResourceIds { readonly primaryId: string; readonly relatedId?: string; readonly workflowId?: string; }
function key(target: ProductQueryTarget, tenantId: string, ids: InvalidationResourceIds): QueryKey {
  if (target === "mission.detail") return missionKeys.detail(tenantId, ids.primaryId); if (target === "authority.detail") return authorityKeys.detail(tenantId, ids.primaryId); if (target === "decision.detail") return decisionKeys.detail(tenantId, ids.primaryId);
  if (target === "agent.detail") return agentKeys.detail(tenantId, ids.primaryId); if (target === "execution.detail") return executionKeys.detail(tenantId, ids.relatedId ?? ids.primaryId);
  if (target === "asset.detail") return assetKeys.detail(tenantId, ids.primaryId); if (target === "asset.list") return assetKeys.all(tenantId); if (target === "knowledge.detail") return knowledgeKeys.detail(tenantId, ids.primaryId); if (target === "knowledge.list") return knowledgeKeys.all(tenantId);
  if (target === "policy.detail") return policyKeys.detail(tenantId, ids.primaryId); if (target === "policy.list") return policyKeys.all(tenantId); if (target === "workflow.detail") return workflowKeys.detail(tenantId, ids.primaryId); if (target === "workflowExecution.detail") return workflowKeys.execution(tenantId, ids.workflowId ?? null, ids.relatedId ?? ids.primaryId);
  if (target === "review.detail") return reviewKeys.detail(tenantId, ids.primaryId); if (target === "publication.detail") return publicationKeys.detail(tenantId, ids.primaryId); if (target === "connector.detail") return connectorKeys.detail(tenantId, ids.primaryId); return connectorKeys.execution(tenantId, ids.relatedId ?? ids.primaryId);
}

export async function invalidateCommittedCommand(queryClient: QueryClient, operationId: string, tenantId: string, ids: InvalidationResourceIds): Promise<void> {
  const policy = commandInvalidationPolicy[operationId]; if (policy === undefined) throw new Error(`Invalidation policy missing for ${operationId}`);
  const refetchType = policy.refetch === "none" ? "none" : policy.refetch;
  for (const target of policy.exactTargets) await queryClient.invalidateQueries({ queryKey: key(target, tenantId, ids), exact: true, refetchType });
  for (const target of policy.prefixTargets) await queryClient.invalidateQueries({ queryKey: key(target, tenantId, ids), exact: false, refetchType });
}
