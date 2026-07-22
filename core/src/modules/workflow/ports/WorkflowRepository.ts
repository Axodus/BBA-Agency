import type { TenantId, WorkflowId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Workflow } from "../domain/Workflow.js";

export interface WorkflowRepository {
  save(workflow: Workflow, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, workflowId: WorkflowId): Promise<Workflow | null>;
  exists(tenantId: TenantId, workflowId: WorkflowId): Promise<boolean>;
}
