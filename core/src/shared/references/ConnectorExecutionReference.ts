import { ConnectorExecutionId } from "../identity/ConnectorExecutionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ConnectorExecutionReference extends TenantReference<ConnectorExecutionId> {
  public constructor(id: ConnectorExecutionId, tenantId: TenantId) { super(id, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ConnectorExecutionReference {
    return new ConnectorExecutionReference(ConnectorExecutionId.from(value.id), TenantId.from(value.tenantId));
  }
}
