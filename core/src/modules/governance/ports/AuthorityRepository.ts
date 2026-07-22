import type { Authority } from "../domain/Authority.js";
import type { AuthorityId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface AuthorityRepository {
  save(authority: Authority, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, authorityId: AuthorityId): Promise<Authority | null>;
  exists(tenantId: TenantId, authorityId: AuthorityId): Promise<boolean>;
}
