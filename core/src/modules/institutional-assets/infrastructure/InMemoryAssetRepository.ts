import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { AssetId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Asset, type AssetSnapshot } from "../domain/Asset.js";
import type { AssetRepository } from "../ports/AssetRepository.js";

export class InMemoryAssetRepository implements AssetRepository {
  private readonly snapshots = new Map<string, AssetSnapshot>();
  public async save(asset: Asset, expectedVersion: Version): Promise<void> { this.validate(asset, expectedVersion); this.snapshots.set(asset.id.toString(), asset.toSnapshot()); }
  public async findById(tenantId: TenantId, assetId: AssetId): Promise<Asset | null> { const snapshot = this.snapshots.get(assetId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Asset.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, assetId: AssetId): Promise<boolean> { const snapshot = this.snapshots.get(assetId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  public async listByTenant(tenantId: TenantId): Promise<readonly Asset[]> { return [...this.snapshots.values()].filter((item) => item.tenantId === tenantId.toString()).map((item) => Asset.rehydrate(item)); }
  public commitPair(previous: Asset, expectedPreviousVersion: Version, successor: Asset, expectedSuccessorVersion: Version): void { if (previous.id.equals(successor.id)) throw new InvariantViolation("Supersession Unit of Work requires distinct Assets"); this.validate(previous, expectedPreviousVersion); this.validate(successor, expectedSuccessorVersion); const next = new Map(this.snapshots); next.set(previous.id.toString(), previous.toSnapshot()); next.set(successor.id.toString(), successor.toSnapshot()); this.snapshots.clear(); for (const [key, value] of next) this.snapshots.set(key, value); }
  private validate(asset: Asset, expectedVersion: Version): void { const stored = this.snapshots.get(asset.id.toString()); if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Asset does not exist at the expected Version"); } else { if (stored.tenantId !== asset.tenantId.toString()) throw new TenantViolation("Asset cannot cross a Tenant boundary"); if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Asset optimistic Version check failed", { assetId: asset.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) }); } if (asset.version.value <= expectedVersion.value) throw new InvariantViolation("Asset save requires a newer Version"); }
  private assertTenant(snapshot: AssetSnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Asset lookup crossed a Tenant boundary", { assetId: snapshot.assetId }); }
}
