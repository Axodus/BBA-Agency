import type { AssetReference, AssetVersionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";

export interface ReviewReferenceValidationPort {
  validateAssetReference(reference: AssetReference): Promise<void>;
  validateAssetVersionReference(reference: AssetVersionReference): Promise<void>;
  validateKnowledgeReference(reference: KnowledgeReference): Promise<void>;
  validatePolicyReference(reference: PolicyReference): Promise<void>;
}
