import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { AuthorityId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Authority } from "../domain/Authority.js";
import { parseAuthoritySnapshot, type AuthoritySnapshot } from "../domain/AuthoritySnapshot.js";
import type { AuthorityRepository } from "../ports/AuthorityRepository.js";

export class InMemoryAuthorityRepository implements AuthorityRepository {
  private readonly snapshots = new Map<string, AuthoritySnapshot>();
  public async save(authority: Authority, expectedVersion: Version): Promise<void> {
    const key = authority.id.toString(); const stored = this.snapshots.get(key);
    if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Authority does not exist at the expected Version"); }
    else {
      if (stored.tenantId !== authority.tenantId.toString()) throw new TenantViolation("Authority cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Authority optimistic Version check failed", { expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) });
    }
    if (authority.version.value <= expectedVersion.value) throw new InvariantViolation("Authority save requires a newer Version");
    this.snapshots.set(key, parseAuthoritySnapshot(authority.toSnapshot()));
  }
  public async findById(tenantId: TenantId, authorityId: AuthorityId): Promise<Authority | null> { const snapshot = this.snapshots.get(authorityId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Authority.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, authorityId: AuthorityId): Promise<boolean> { const snapshot = this.snapshots.get(authorityId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  private assertTenant(snapshot: AuthoritySnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Authority lookup crossed a Tenant boundary", { authorityId: snapshot.authorityId }); }
}
