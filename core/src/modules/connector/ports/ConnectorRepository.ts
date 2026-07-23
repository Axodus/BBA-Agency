import type { Connector } from "../domain/Connector.js";
import type { ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface ConnectorRepository { save(connector: Connector, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, connectorId: ConnectorId): Promise<Connector | null>; exists(tenantId: TenantId, connectorId: ConnectorId): Promise<boolean>; }
