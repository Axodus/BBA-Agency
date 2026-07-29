import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { KnowledgeId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Knowledge, type KnowledgeSnapshot } from "../domain/Knowledge.js";
import type { KnowledgeRepository } from "../ports/KnowledgeRepository.js";

export class InMemoryKnowledgeRepository implements KnowledgeRepository {
  private readonly snapshots = new Map<string, KnowledgeSnapshot>();
  public async save(knowledge: Knowledge, expectedVersion: Version): Promise<void> { this.validate(knowledge, expectedVersion); this.snapshots.set(knowledge.id.toString(), knowledge.toSnapshot()); }
  public async findById(tenantId: TenantId, knowledgeId: KnowledgeId): Promise<Knowledge | null> { const snapshot = this.snapshots.get(knowledgeId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Knowledge.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, knowledgeId: KnowledgeId): Promise<boolean> { const snapshot = this.snapshots.get(knowledgeId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  public async listByTenant(tenantId: TenantId): Promise<readonly Knowledge[]> { return [...this.snapshots.values()].filter((item) => item.tenantId === tenantId.toString()).map((item) => Knowledge.rehydrate(item)); }
  private validate(knowledge: Knowledge, expectedVersion: Version): void { const stored = this.snapshots.get(knowledge.id.toString()); if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Knowledge does not exist at the expected Version"); } else { if (stored.tenantId !== knowledge.tenantId.toString()) throw new TenantViolation("Knowledge cannot cross a Tenant boundary"); if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Knowledge optimistic Version check failed", { knowledgeId: knowledge.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) }); } if (knowledge.version.value <= expectedVersion.value) throw new InvariantViolation("Knowledge save requires a newer Version"); }
  private assertTenant(snapshot: KnowledgeSnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Knowledge lookup crossed a Tenant boundary", { knowledgeId: snapshot.knowledgeId }); }
}
