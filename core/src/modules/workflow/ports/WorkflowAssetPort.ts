import type { AssetReference, AssetVersionReference } from "../../../shared/references/index.js";

export interface WorkflowAssetPort {
  validateAsset(reference: AssetReference): Promise<void>;
  validateAssetVersion(reference: AssetVersionReference): Promise<void>;
}
