import { TenantId } from "../identity/TenantId.js";
import { WorkflowExecutionId } from "../identity/WorkflowExecutionId.js";
import { TenantReference } from "./TenantReference.js";

export class WorkflowExecutionReference extends TenantReference<WorkflowExecutionId> {
  public constructor(workflowExecutionId: WorkflowExecutionId, tenantId: TenantId) { super(workflowExecutionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): WorkflowExecutionReference {
    return new WorkflowExecutionReference(WorkflowExecutionId.from(value.id), TenantId.from(value.tenantId));
  }
}
