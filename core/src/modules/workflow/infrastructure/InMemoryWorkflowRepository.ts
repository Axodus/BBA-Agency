import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { TenantId, WorkflowId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Workflow, type WorkflowSnapshot } from "../domain/Workflow.js";
import type { WorkflowRepository } from "../ports/WorkflowRepository.js";

export class InMemoryWorkflowRepository implements WorkflowRepository {
  private readonly snapshots = new Map<string, WorkflowSnapshot>();

  public async save(workflow: Workflow, expectedVersion: Version): Promise<void> {
    this.validate(workflow, expectedVersion);
    this.snapshots.set(workflow.id.toString(), workflow.toSnapshot());
  }

  public async findById(tenantId: TenantId, workflowId: WorkflowId): Promise<Workflow | null> {
    const snapshot = this.snapshots.get(workflowId.toString());
    if (snapshot === undefined) return null;
    this.assertTenant(snapshot, tenantId);
    return Workflow.rehydrate(snapshot);
  }

  public async exists(tenantId: TenantId, workflowId: WorkflowId): Promise<boolean> {
    const snapshot = this.snapshots.get(workflowId.toString());
    if (snapshot === undefined) return false;
    this.assertTenant(snapshot, tenantId);
    return true;
  }

  private validate(workflow: Workflow, expectedVersion: Version): void {
    const stored = this.snapshots.get(workflow.id.toString());
    if (stored === undefined) {
      if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Workflow does not exist at the expected Version");
    } else {
      if (stored.tenantId !== workflow.tenantId.toString()) throw new TenantViolation("Workflow cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Workflow optimistic Version check failed", { workflowId: workflow.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version) });
    }
    if (workflow.version.value <= expectedVersion.value) throw new InvariantViolation("Workflow save requires a newer Version");
  }

  private assertTenant(snapshot: WorkflowSnapshot, tenantId: TenantId): void {
    if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Workflow lookup crossed a Tenant boundary", { workflowId: snapshot.workflowId });
  }
}
