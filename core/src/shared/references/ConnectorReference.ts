import { ConnectorId } from "../identity/ConnectorId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ConnectorReference extends TenantReference<ConnectorId> {
  public constructor(connectorId: ConnectorId, tenantId: TenantId) { super(connectorId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ConnectorReference {
    return new ConnectorReference(ConnectorId.from(value.id), TenantId.from(value.tenantId));
  }
}
