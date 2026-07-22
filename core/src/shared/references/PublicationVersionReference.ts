import { PublicationVersionId } from "../identity/PublicationVersionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class PublicationVersionReference extends TenantReference<PublicationVersionId> {
  public constructor(versionId: PublicationVersionId, tenantId: TenantId) { super(versionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): PublicationVersionReference {
    return new PublicationVersionReference(PublicationVersionId.from(value.id), TenantId.from(value.tenantId));
  }
}
