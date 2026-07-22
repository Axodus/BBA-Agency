import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { DecisionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Decision } from "../domain/Decision.js";
import { parseDecisionSnapshot, type DecisionSnapshot } from "../domain/DecisionSnapshot.js";
import type { DecisionRepository } from "../ports/DecisionRepository.js";

export class InMemoryDecisionRepository implements DecisionRepository {
  private readonly snapshots = new Map<string, DecisionSnapshot>();
  public async save(decision: Decision, expectedVersion: Version): Promise<void> {
    const key = decision.id.toString(); const stored = this.snapshots.get(key);
    if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Decision does not exist at the expected Version"); }
    else {
      if (stored.tenantId !== decision.tenantId.toString()) throw new TenantViolation("Decision cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Decision optimistic Version check failed", { expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) });
    }
    if (decision.version.value <= expectedVersion.value) throw new InvariantViolation("Decision save requires a newer Version");
    this.snapshots.set(key, parseDecisionSnapshot(decision.toSnapshot()));
  }
  public async findById(tenantId: TenantId, decisionId: DecisionId): Promise<Decision | null> { const snapshot = this.snapshots.get(decisionId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Decision.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, decisionId: DecisionId): Promise<boolean> { const snapshot = this.snapshots.get(decisionId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  private assertTenant(snapshot: DecisionSnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Decision lookup crossed a Tenant boundary", { decisionId: snapshot.decisionId }); }
}
