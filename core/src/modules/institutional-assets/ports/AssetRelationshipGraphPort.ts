import type { AssetId, TenantId } from "../../../shared/identity/index.js";

export interface AssetRelationshipGraphPort { wouldCreateLineageCycle(tenantId: TenantId, sourceAssetId: AssetId, targetAssetId: AssetId): Promise<boolean>; wouldCreateSupersessionCycle(tenantId: TenantId, sourceAssetId: AssetId, targetAssetId: AssetId): Promise<boolean>; }
