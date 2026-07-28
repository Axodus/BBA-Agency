import type { Execution } from "../domain/Execution.js";
import type { ExecutionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface ExecutionRepository { save(execution: Execution, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, executionId: ExecutionId): Promise<Execution | null>; exists(tenantId: TenantId, executionId: ExecutionId): Promise<boolean>; }
