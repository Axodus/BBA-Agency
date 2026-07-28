import type { AssetId, TenantId } from "../../../shared/identity/index.js";
import type { AssetRelationshipType } from "../domain/AssetRelationship.js";
import type { AssetRelationshipGraphPort } from "../ports/AssetRelationshipGraphPort.js";
import type { AssetRepository } from "../ports/AssetRepository.js";

export class InMemoryAssetRelationshipGraph implements AssetRelationshipGraphPort {
  public constructor(private readonly assets: AssetRepository) {}
  public wouldCreateLineageCycle(tenantId: TenantId, sourceAssetId: AssetId, targetAssetId: AssetId): Promise<boolean> { return this.wouldCreateCycle(tenantId, sourceAssetId, targetAssetId, "DERIVES_FROM"); }
  public wouldCreateSupersessionCycle(tenantId: TenantId, sourceAssetId: AssetId, targetAssetId: AssetId): Promise<boolean> { return this.wouldCreateCycle(tenantId, sourceAssetId, targetAssetId, "SUPERSEDES"); }
  private async wouldCreateCycle(tenantId: TenantId, sourceAssetId: AssetId, targetAssetId: AssetId, type: AssetRelationshipType): Promise<boolean> { if (sourceAssetId.equals(targetAssetId)) return true; const assets = await this.assets.listByTenant(tenantId); const adjacency = new Map<string, string[]>(); for (const asset of assets) for (const relationship of asset.relationships) if (relationship.type === type) adjacency.set(relationship.source.id.toString(), [...(adjacency.get(relationship.source.id.toString()) ?? []), relationship.target.id.toString()]); const target = sourceAssetId.toString(); const queue = [targetAssetId.toString()]; const visited = new Set<string>(); while (queue.length > 0) { const current = queue.shift(); if (current === undefined) break; if (current === target) return true; if (visited.has(current)) continue; visited.add(current); queue.push(...(adjacency.get(current) ?? [])); } return false; }
}
