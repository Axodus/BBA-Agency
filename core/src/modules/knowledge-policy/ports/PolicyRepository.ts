import type { PolicyId, PolicyVersionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Policy } from "../domain/Policy.js";

export interface PolicyRepository { save(policy: Policy, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, policyId: PolicyId): Promise<Policy | null>; exists(tenantId: TenantId, policyId: PolicyId): Promise<boolean>; existsVersion(tenantId: TenantId, policyVersionId: PolicyVersionId): Promise<boolean>; listByTenant(tenantId: TenantId): Promise<readonly Policy[]>; }
