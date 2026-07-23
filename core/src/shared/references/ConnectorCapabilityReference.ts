import { ConnectorCapabilityId } from "../identity/ConnectorCapabilityId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ConnectorCapabilityReference extends TenantReference<ConnectorCapabilityId> {
  public constructor(id: ConnectorCapabilityId, tenantId: TenantId) { super(id, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ConnectorCapabilityReference {
    return new ConnectorCapabilityReference(ConnectorCapabilityId.from(value.id), TenantId.from(value.tenantId));
  }
}
