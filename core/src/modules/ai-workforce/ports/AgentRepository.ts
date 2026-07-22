import type { Agent } from "../domain/Agent.js";
import type { AgentId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface AgentRepository { save(agent: Agent, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, agentId: AgentId): Promise<Agent | null>; exists(tenantId: TenantId, agentId: AgentId): Promise<boolean>; }
