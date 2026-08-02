import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { AssetId, AssetVersionId, TenantId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { AssetReference, AuthorityReference, DecisionReference, MissionReference } from "../../../shared/references/index.js";
import type { AssetAuthorityContext } from "./AssetAuthorityContext.js";
import type { AssetClassification } from "./AssetClassification.js";
import type { AssetMetadata } from "./AssetMetadata.js";
import type { AssetRelationship } from "./AssetRelationship.js";
import type { CanonicalContent } from "./CanonicalContent.js";

export interface AssetAuditInput { readonly reason: string; readonly occurredAt: string; readonly correlationId: CorrelationId; readonly causationId?: CausationId; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; }
export interface GovernedAssetAuditInput extends AssetAuditInput { readonly authorityReference: AuthorityReference; readonly decisionReference: DecisionReference; }
export interface CreateAssetCommand extends AssetAuditInput { readonly assetId: AssetId; readonly tenantId: TenantId; readonly missionReference: MissionReference; readonly metadata: AssetMetadata; readonly classification: AssetClassification; readonly authorityContext: AssetAuthorityContext; readonly initialVersionId: AssetVersionId; readonly content: CanonicalContent; readonly authorityDecisionReference: DecisionReference; }
export interface ProduceAssetCommand extends GovernedAssetAuditInput {}
export interface CreateAssetVersionCommand extends AssetAuditInput { readonly versionId: AssetVersionId; readonly content: CanonicalContent; readonly authorityDecisionReference: DecisionReference; }
export interface AddAssetRelationshipCommand extends AssetAuditInput { readonly relationship: AssetRelationship; }
export interface ArchiveAssetCommand extends GovernedAssetAuditInput {}
export interface SupersedeAssetCommand extends GovernedAssetAuditInput { readonly successorReference: AssetReference; }
