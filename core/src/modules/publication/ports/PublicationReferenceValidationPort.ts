import type { AssetReference, AssetVersionReference, KnowledgeReference } from "../../../shared/references/index.js";

export interface PublicationReferenceValidationPort {
  validateAssetReference(reference: AssetReference): Promise<void>;
  validateAssetVersionReference(reference: AssetVersionReference): Promise<void>;
  validateKnowledgeReference(reference: KnowledgeReference): Promise<void>;
}
