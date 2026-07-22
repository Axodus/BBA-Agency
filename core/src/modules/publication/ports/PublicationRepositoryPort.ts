import type { PublicationId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Publication } from "../domain/Publication.js";

export interface PublicationRepositoryPort {
  save(publication: Publication, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, publicationId: PublicationId): Promise<Publication | null>;
  exists(tenantId: TenantId, publicationId: PublicationId): Promise<boolean>;
}
