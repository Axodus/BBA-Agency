import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { PolicyId, PolicyVersionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Policy, type PolicySnapshot } from "../domain/Policy.js";
import type { PolicyRepository } from "../ports/PolicyRepository.js";

export class InMemoryPolicyRepository implements PolicyRepository {
  private readonly snapshots = new Map<string, PolicySnapshot>();
  public async save(policy: Policy, expectedVersion: Version): Promise<void> { this.validate(policy, expectedVersion); this.snapshots.set(policy.id.toString(), policy.toSnapshot()); }
  public async findById(tenantId: TenantId, policyId: PolicyId): Promise<Policy | null> { const snapshot = this.snapshots.get(policyId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Policy.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, policyId: PolicyId): Promise<boolean> { const snapshot = this.snapshots.get(policyId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  public async existsVersion(tenantId: TenantId, policyVersionId: PolicyVersionId): Promise<boolean> { for (const snapshot of this.snapshots.values()) { if (snapshot.tenantId === tenantId.toString() && snapshot.versions.some((item) => item.id === policyVersionId.toString())) return true; } return false; }
  public async listByTenant(tenantId: TenantId): Promise<readonly Policy[]> { return [...this.snapshots.values()].filter((item) => item.tenantId === tenantId.toString()).map((item) => Policy.rehydrate(item)); }
  private validate(policy: Policy, expectedVersion: Version): void { const stored = this.snapshots.get(policy.id.toString()); if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Policy does not exist at the expected Version"); } else { if (stored.tenantId !== policy.tenantId.toString()) throw new TenantViolation("Policy cannot cross a Tenant boundary"); if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Policy optimistic Version check failed", { policyId: policy.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) }); } if (policy.version.value <= expectedVersion.value) throw new InvariantViolation("Policy save requires a newer Version"); }
  private assertTenant(snapshot: PolicySnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Policy lookup crossed a Tenant boundary", { policyId: snapshot.policyId }); }
}
