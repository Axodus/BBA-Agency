import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { PublicationId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Publication, type PublicationSnapshot } from "../domain/Publication.js";
import type { PublicationRepositoryPort } from "../ports/PublicationRepositoryPort.js";

export class InMemoryPublicationRepository implements PublicationRepositoryPort {
  private readonly snapshots = new Map<string, PublicationSnapshot>();

  public async save(publication: Publication, expectedVersion: Version): Promise<void> {
    const stored = this.snapshots.get(publication.id.toString());
    if (stored === undefined) {
      if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Publication does not exist at the expected Version");
    } else {
      if (stored.tenantId !== publication.tenantId.toString()) throw new TenantViolation("Publication cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Publication optimistic Version check failed", {
        publicationId: publication.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version)
      });
    }
    if (publication.version.value <= expectedVersion.value) throw new InvariantViolation("Publication save requires a newer Version");
    this.snapshots.set(publication.id.toString(), publication.toSnapshot());
  }

  public async findById(tenantId: TenantId, publicationId: PublicationId): Promise<Publication | null> {
    const snapshot = this.snapshots.get(publicationId.toString());
    if (snapshot === undefined) return null;
    this.assertTenant(snapshot, tenantId);
    return Publication.rehydrate(snapshot);
  }

  public async exists(tenantId: TenantId, publicationId: PublicationId): Promise<boolean> {
    const snapshot = this.snapshots.get(publicationId.toString());
    if (snapshot === undefined) return false;
    this.assertTenant(snapshot, tenantId);
    return true;
  }

  private assertTenant(snapshot: PublicationSnapshot, tenantId: TenantId): void {
    if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Publication lookup crossed a Tenant boundary", { publicationId: snapshot.publicationId });
  }
}
