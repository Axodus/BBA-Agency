import { TenantId } from "../identity/TenantId.js";
import { WorkflowId } from "../identity/WorkflowId.js";
import { TenantReference } from "./TenantReference.js";

export class WorkflowReference extends TenantReference<WorkflowId> {
  public constructor(workflowId: WorkflowId, tenantId: TenantId) { super(workflowId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): WorkflowReference {
    return new WorkflowReference(WorkflowId.from(value.id), TenantId.from(value.tenantId));
  }
}
