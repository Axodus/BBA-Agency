import type { TenantId, WorkflowExecutionId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { WorkflowExecution } from "../domain/WorkflowExecution.js";

export interface WorkflowExecutionRepository {
  save(execution: WorkflowExecution, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, executionId: WorkflowExecutionId): Promise<WorkflowExecution | null>;
  exists(tenantId: TenantId, executionId: WorkflowExecutionId): Promise<boolean>;
}
