import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { ExecutionId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Execution, type ExecutionSnapshot } from "../domain/Execution.js";
import type { ExecutionRepository } from "../ports/ExecutionRepository.js";

export class InMemoryExecutionRepository implements ExecutionRepository {
  private readonly snapshots = new Map<string, ExecutionSnapshot>();
  public async save(execution: Execution, expectedVersion: Version): Promise<void> {
    const key = execution.id.toString(); const stored = this.snapshots.get(key);
    if (stored === undefined) { if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Execution does not exist at the expected Version"); }
    else { if (stored.tenantId !== execution.tenantId.toString()) throw new TenantViolation("Execution cannot cross a Tenant boundary"); if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Execution optimistic Version check failed"); }
    if (execution.version.value <= expectedVersion.value) throw new InvariantViolation("Execution save requires a newer Version");
    this.snapshots.set(key, execution.toSnapshot());
  }
  public async findById(tenantId: TenantId, executionId: ExecutionId): Promise<Execution | null> { const snapshot = this.snapshots.get(executionId.toString()); if (snapshot === undefined) return null; this.assertTenant(snapshot, tenantId); return Execution.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, executionId: ExecutionId): Promise<boolean> { const snapshot = this.snapshots.get(executionId.toString()); if (snapshot === undefined) return false; this.assertTenant(snapshot, tenantId); return true; }
  private assertTenant(snapshot: ExecutionSnapshot, tenantId: TenantId): void { if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Execution lookup crossed a Tenant boundary", { executionId: snapshot.executionId }); }
}
