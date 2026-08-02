import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { AgentId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Agent, type AgentSnapshot } from "../domain/Agent.js";
import type { AgentRepository } from "../ports/AgentRepository.js";

export class InMemoryAgentRepository implements AgentRepository {
  private readonly snapshots = new Map<string, AgentSnapshot>();
  public async save(agent: Agent, expectedVersion: Version): Promise<void> {
    const key = agent.id.toString(); const stored = this.snapshots.get(key);
    if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Agent does not exist at the expected Version"); }
    else { if (stored.tenantId !== agent.tenantId.toString()) throw new TenantViolation("Agent cannot cross a Tenant boundary"); if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Agent optimistic Version check failed"); }
    if (agent.version.value <= expectedVersion.value) throw new InvariantViolation("Agent save requires a newer Version");
    this.snapshots.set(key, agent.toSnapshot());
  }
  public async findById(tenantId: TenantId, agentId: AgentId): Promise<Agent | null> { const snapshot = this.snapshots.get(agentId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Agent.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, agentId: AgentId): Promise<boolean> { const snapshot = this.snapshots.get(agentId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  private assertTenant(snapshot: AgentSnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Agent lookup crossed a Tenant boundary", { agentId: snapshot.agentId }); }
}
