import type { JsonObject } from "../common/serialization.js";
import { AssetId } from "../identity/AssetId.js";
import { AssetVersionId } from "../identity/AssetVersionId.js";
import { TenantId } from "../identity/TenantId.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export class AssetVersionReference extends ValueObject<JsonObject> {
  public readonly assetId: AssetId; public readonly versionId: AssetVersionId; public readonly tenantId: TenantId;
  public constructor(assetId: AssetId, versionId: AssetVersionId, tenantId: TenantId) {
    super({ assetId: assetId.toString(), versionId: versionId.toString(), tenantId: tenantId.toString() });
    this.assetId = assetId; this.versionId = versionId; this.tenantId = tenantId; Object.freeze(this);
  }
  public static fromJSON(value: { readonly assetId: string; readonly versionId: string; readonly tenantId: string }): AssetVersionReference {
    return new AssetVersionReference(AssetId.from(value.assetId), AssetVersionId.from(value.versionId), TenantId.from(value.tenantId));
  }
}
