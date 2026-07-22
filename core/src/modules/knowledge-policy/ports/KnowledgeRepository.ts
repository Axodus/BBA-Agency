import type { KnowledgeId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Knowledge } from "../domain/Knowledge.js";

export interface KnowledgeRepository { save(knowledge: Knowledge, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, knowledgeId: KnowledgeId): Promise<Knowledge | null>; exists(tenantId: TenantId, knowledgeId: KnowledgeId): Promise<boolean>; listByTenant(tenantId: TenantId): Promise<readonly Knowledge[]>; }
