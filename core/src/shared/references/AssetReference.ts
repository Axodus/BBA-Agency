import { AssetId } from "../identity/AssetId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class AssetReference extends TenantReference<AssetId> {
  public constructor(assetId: AssetId, tenantId: TenantId) { super(assetId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): AssetReference {
    return new AssetReference(AssetId.from(value.id), TenantId.from(value.tenantId));
  }
}
