import { AuthorityId } from "../identity/AuthorityId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class AuthorityReference extends TenantReference<AuthorityId> {
  public constructor(authorityId: AuthorityId, tenantId: TenantId) { super(authorityId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): AuthorityReference {
    return new AuthorityReference(AuthorityId.from(value.id), TenantId.from(value.tenantId));
  }
}
