import { PolicyId } from "../identity/PolicyId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class PolicyReference extends TenantReference<PolicyId> {
  public constructor(policyId: PolicyId, tenantId: TenantId) { super(policyId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): PolicyReference {
    return new PolicyReference(PolicyId.from(value.id), TenantId.from(value.tenantId));
  }
}
