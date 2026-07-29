import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { ConnectorExecutionId, ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { ConnectorExecution, type ConnectorExecutionSnapshot } from "../domain/ConnectorExecution.js";
import type { ConnectorExecutionRepository } from "../ports/ConnectorExecutionRepository.js";

export class InMemoryConnectorExecutionRepository implements ConnectorExecutionRepository {
  private readonly snapshots = new Map<string, ConnectorExecutionSnapshot>();
  public async save(execution: ConnectorExecution, expectedVersion: Version): Promise<void> { const stored = this.snapshots.get(execution.id.toString()); if (stored === undefined && expectedVersion.value !== 0) throw new ConcurrencyConflict("ConnectorExecution does not exist at expected Version"); if (stored !== undefined && stored.version !== expectedVersion.value) throw new ConcurrencyConflict("ConnectorExecution optimistic Version check failed"); if (stored !== undefined && stored.tenantId !== execution.tenantId.toString()) throw new TenantViolation("ConnectorExecution cannot cross a Tenant boundary"); if (execution.version.value <= expectedVersion.value) throw new InvariantViolation("ConnectorExecution save requires a newer Version"); this.snapshots.set(execution.id.toString(), execution.toSnapshot()); }
  public async findById(tenantId: TenantId, executionId: ConnectorExecutionId): Promise<ConnectorExecution | null> { const snapshot = this.snapshots.get(executionId.toString()); if (snapshot === undefined) return null; if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("ConnectorExecution lookup crossed a Tenant boundary"); return ConnectorExecution.rehydrate(snapshot); }
  public async findByIdempotencyKey(tenantId: TenantId, connectorId: ConnectorId, operationKey: string, idempotencyKey: string): Promise<ConnectorExecution | null> { for (const snapshot of this.snapshots.values()) { if (snapshot.tenantId === tenantId.toString() && snapshot.connectorReference.id === connectorId.toString() && snapshot.operationKey === operationKey && (snapshot.request.idempotencyKey as string) === idempotencyKey) return ConnectorExecution.rehydrate(snapshot); } return null; }
}
