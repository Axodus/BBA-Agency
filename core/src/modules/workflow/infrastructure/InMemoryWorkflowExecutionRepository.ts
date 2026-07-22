import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { TenantId, WorkflowExecutionId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { WorkflowExecution, type WorkflowExecutionSnapshot } from "../domain/WorkflowExecution.js";
import type { WorkflowExecutionRepository } from "../ports/WorkflowExecutionRepository.js";

export class InMemoryWorkflowExecutionRepository implements WorkflowExecutionRepository {
  private readonly snapshots = new Map<string, WorkflowExecutionSnapshot>();

  public async save(execution: WorkflowExecution, expectedVersion: Version): Promise<void> {
    this.validate(execution, expectedVersion);
    this.snapshots.set(execution.id.toString(), execution.toSnapshot());
  }

  public async findById(tenantId: TenantId, executionId: WorkflowExecutionId): Promise<WorkflowExecution | null> {
    const snapshot = this.snapshots.get(executionId.toString());
    if (snapshot === undefined) return null;
    this.assertTenant(snapshot, tenantId);
    return WorkflowExecution.rehydrate(snapshot);
  }

  public async exists(tenantId: TenantId, executionId: WorkflowExecutionId): Promise<boolean> {
    const snapshot = this.snapshots.get(executionId.toString());
    if (snapshot === undefined) return false;
    this.assertTenant(snapshot, tenantId);
    return true;
  }

  private validate(execution: WorkflowExecution, expectedVersion: Version): void {
    const stored = this.snapshots.get(execution.id.toString());
    if (stored === undefined) {
      if (expectedVersion.value !== 0) throw new ConcurrencyConflict("WorkflowExecution does not exist at the expected Version");
    } else {
      if (stored.tenantId !== execution.tenantId.toString()) throw new TenantViolation("WorkflowExecution cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("WorkflowExecution optimistic Version check failed", { executionId: execution.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) });
    }
    if (execution.version.value <= expectedVersion.value) throw new InvariantViolation("WorkflowExecution save requires a newer Version");
  }

  private assertTenant(snapshot: WorkflowExecutionSnapshot, tenantId: TenantId): void {
    if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("WorkflowExecution lookup crossed a Tenant boundary", { executionId: snapshot.executionId });
  }
}
