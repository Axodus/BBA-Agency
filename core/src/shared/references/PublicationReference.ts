import { PublicationId } from "../identity/PublicationId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class PublicationReference extends TenantReference<PublicationId> {
  public constructor(publicationId: PublicationId, tenantId: TenantId) { super(publicationId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): PublicationReference {
    return new PublicationReference(PublicationId.from(value.id), TenantId.from(value.tenantId));
  }
}
