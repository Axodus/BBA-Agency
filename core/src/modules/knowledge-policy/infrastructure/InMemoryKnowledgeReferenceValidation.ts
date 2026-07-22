import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { AssetReference, AssetVersionReference } from "../../../shared/references/index.js";
import type { KnowledgeReferenceValidationPort } from "../ports/KnowledgeReferenceValidationPort.js";

export class InMemoryKnowledgeReferenceValidation implements KnowledgeReferenceValidationPort {
  private readonly assets = new Set<string>(); private readonly assetVersions = new Set<string>();
  public registerAsset(reference: AssetReference): void { this.assets.add(`${reference.tenantId.toString()}:${reference.id.toString()}`); }
  public registerAssetVersion(reference: AssetVersionReference): void { this.assetVersions.add(`${reference.tenantId.toString()}:${reference.assetId.toString()}:${reference.versionId.toString()}`); }
  public async validateAssetReference(reference: AssetReference): Promise<void> { if (!this.assets.has(`${reference.tenantId.toString()}:${reference.id.toString()}`)) throw new InvariantViolation("AssetReference was not structurally registered"); }
  public async validateAssetVersionReference(reference: AssetVersionReference): Promise<void> { if (!this.assetVersions.has(`${reference.tenantId.toString()}:${reference.assetId.toString()}:${reference.versionId.toString()}`)) throw new InvariantViolation("AssetVersionReference was not structurally registered"); }
}
