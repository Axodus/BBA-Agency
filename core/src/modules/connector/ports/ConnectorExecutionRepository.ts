import type { ConnectorExecution } from "../domain/ConnectorExecution.js";
import type { ConnectorExecutionId, ConnectorId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";

export interface ConnectorExecutionRepository { save(execution: ConnectorExecution, expectedVersion: Version): Promise<void>; findById(tenantId: TenantId, executionId: ConnectorExecutionId): Promise<ConnectorExecution | null>; findByIdempotencyKey(tenantId: TenantId, connectorId: ConnectorId, operationKey: string, idempotencyKey: string): Promise<ConnectorExecution | null>; }
