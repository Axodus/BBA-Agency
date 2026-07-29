import { DecisionId } from "../identity/DecisionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class DecisionReference extends TenantReference<DecisionId> {
  public constructor(decisionId: DecisionId, tenantId: TenantId) { super(decisionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): DecisionReference {
    return new DecisionReference(DecisionId.from(value.id), TenantId.from(value.tenantId));
  }
}
