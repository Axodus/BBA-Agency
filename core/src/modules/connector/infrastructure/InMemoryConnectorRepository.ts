import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Connector, type ConnectorSnapshot } from "../domain/Connector.js";
import type { ConnectorRepository } from "../ports/ConnectorRepository.js";

export class InMemoryConnectorRepository implements ConnectorRepository {
  private readonly snapshots = new Map<string, ConnectorSnapshot>();
  public async save(connector: Connector, expectedVersion: Version): Promise<void> { const stored = this.snapshots.get(connector.id.toString()); if (stored === undefined && expectedVersion.value !== 0) throw new ConcurrencyConflict("Connector does not exist at expected Version"); if (stored !== undefined && stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Connector optimistic Version check failed"); if (stored !== undefined && stored.tenantId !== connector.tenantId.toString()) throw new TenantViolation("Connector cannot cross a Tenant boundary"); if (connector.version.value <= expectedVersion.value) throw new InvariantViolation("Connector save requires a newer Version"); this.snapshots.set(connector.id.toString(), connector.toSnapshot()); }
  public async findById(tenantId: TenantId, connectorId: ConnectorId): Promise<Connector | null> { const snapshot = this.snapshots.get(connectorId.toString()); if (snapshot === undefined) return null; if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Connector lookup crossed a Tenant boundary"); return Connector.rehydrate(snapshot); }
  public async exists(tenantId: TenantId, connectorId: ConnectorId): Promise<boolean> { return (await this.findById(tenantId, connectorId)) !== null; }
}
