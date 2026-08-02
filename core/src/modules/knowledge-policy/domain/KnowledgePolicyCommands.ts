import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { KnowledgeId, PolicyId, PolicyVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { AssetReference, AssetVersionReference, AuthorityReference, DecisionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";
import type { KnowledgeMetadata } from "./KnowledgeMetadata.js";
import type { KnowledgeScope } from "./KnowledgeScope.js";
import type { KnowledgeRelationship } from "./KnowledgeRelationship.js";
import type { PolicyAuthorityContext } from "./PolicyAuthorityContext.js";
import type { PolicyMetadata } from "./PolicyMetadata.js";
import type { PolicyRuleSet } from "./PolicyRuleSet.js";

export interface KnowledgePolicyAuditInput { readonly reason: string; readonly occurredAt: string; readonly correlationId: CorrelationId; readonly causationId?: CausationId; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; }
export interface GovernedPolicyAuditInput extends KnowledgePolicyAuditInput { readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference; }
export interface CreateKnowledgeCommand extends KnowledgePolicyAuditInput { readonly knowledgeId: KnowledgeId; readonly tenantId: TenantId; readonly metadata: KnowledgeMetadata; readonly scope: KnowledgeScope; readonly assetReferences: readonly AssetReference[]; readonly assetVersionReferences: readonly AssetVersionReference[]; readonly policyReferences: readonly PolicyReference[]; }
export interface CurateKnowledgeCommand extends KnowledgePolicyAuditInput { readonly curatorReference: DecisionReference; }
export interface ArchiveKnowledgeCommand extends KnowledgePolicyAuditInput { readonly decisionReference: DecisionReference; }
export interface SupersedeKnowledgeCommand extends KnowledgePolicyAuditInput { readonly successorReference: KnowledgeReference; readonly decisionReference: DecisionReference; }
export interface LinkKnowledgeCommand extends KnowledgePolicyAuditInput { readonly relationship: KnowledgeRelationship; }
export interface CreatePolicyCommand extends GovernedPolicyAuditInput { readonly policyId: PolicyId; readonly tenantId: TenantId; readonly metadata: PolicyMetadata; readonly authorityContext: PolicyAuthorityContext; readonly initialVersionId: PolicyVersionId; readonly ruleSet: PolicyRuleSet; }
export interface CreatePolicyVersionCommand extends GovernedPolicyAuditInput { readonly versionId: PolicyVersionId; readonly predecessorVersionId: PolicyVersionId; readonly ruleSet: PolicyRuleSet; }
