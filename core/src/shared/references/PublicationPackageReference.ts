import { PublicationPackageId } from "../identity/PublicationPackageId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class PublicationPackageReference extends TenantReference<PublicationPackageId> {
  public constructor(packageId: PublicationPackageId, tenantId: TenantId) { super(packageId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): PublicationPackageReference {
    return new PublicationPackageReference(PublicationPackageId.from(value.id), TenantId.from(value.tenantId));
  }
}
