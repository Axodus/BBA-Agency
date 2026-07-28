import type { AssetReference, AssetVersionReference } from "../../../shared/references/index.js";

export interface KnowledgeReferenceValidationPort { validateAssetReference(reference: AssetReference): Promise<void>; validateAssetVersionReference(reference: AssetVersionReference): Promise<void>; }
