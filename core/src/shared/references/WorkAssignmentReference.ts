import { TenantId } from "../identity/TenantId.js";
import { WorkAssignmentId } from "../identity/WorkAssignmentId.js";
import { TenantReference } from "./TenantReference.js";

export class WorkAssignmentReference extends TenantReference<WorkAssignmentId> {
  public constructor(workAssignmentId: WorkAssignmentId, tenantId: TenantId) { super(workAssignmentId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): WorkAssignmentReference {
    return new WorkAssignmentReference(WorkAssignmentId.from(value.id), TenantId.from(value.tenantId));
  }
}
