import { ApprovalId } from "../identity/ApprovalId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ApprovalReference extends TenantReference<ApprovalId> {
  public constructor(approvalId: ApprovalId, tenantId: TenantId) { super(approvalId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ApprovalReference {
    return new ApprovalReference(ApprovalId.from(value.id), TenantId.from(value.tenantId));
  }
}
