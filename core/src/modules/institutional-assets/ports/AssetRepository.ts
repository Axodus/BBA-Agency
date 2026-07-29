import type { Asset } from "../domain/Asset.js";
import type { AssetId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface AssetRepository { save(asset: Asset, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, assetId: AssetId): Promise<Asset | null>; exists(tenantId: TenantId, assetId: AssetId): Promise<boolean>; listByTenant(tenantId: TenantId): Promise<readonly Asset[]>; }
