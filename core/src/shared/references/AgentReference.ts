import { AgentId } from "../identity/AgentId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class AgentReference extends TenantReference<AgentId> {
  public constructor(agentId: AgentId, tenantId: TenantId) { super(agentId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): AgentReference {
    return new AgentReference(AgentId.from(value.id), TenantId.from(value.tenantId));
  }
}
