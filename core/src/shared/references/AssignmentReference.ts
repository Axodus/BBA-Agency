import { AssignmentId } from "../identity/AssignmentId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class AssignmentReference extends TenantReference<AssignmentId> {
  public constructor(assignmentId: AssignmentId, tenantId: TenantId) { super(assignmentId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): AssignmentReference {
    return new AssignmentReference(AssignmentId.from(value.id), TenantId.from(value.tenantId));
  }
}
