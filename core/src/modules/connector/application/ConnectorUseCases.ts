import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { ConnectorCapabilityReference, ConnectorExecutionReference } from "../../../shared/references/index.js";
import type { ConnectorId, ConnectorExecutionId, TenantId } from "../../../shared/identity/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ConnectorRepository } from "../ports/ConnectorRepository.js";
import type { ConnectorExecutionRepository } from "../ports/ConnectorExecutionRepository.js";
import type { ConnectorTransportPort } from "../ports/ConnectorTransportPort.js";
import type { ConnectorObservationDeliveryPort } from "../ports/ConnectorObservationDeliveryPort.js";
import { Connector } from "../domain/Connector.js";
import { ConnectorExecution } from "../domain/ConnectorExecution.js";
import type { CancelExecutionCommand, CompleteExecutionCommand, ConnectorLifecycleCommand, CreateExecutionCommand, FailExecutionCommand, RegisterConnectorCommand } from "../domain/ConnectorCommands.js";

async function requireConnector(repository: ConnectorRepository, tenantId: TenantId, connectorId: ConnectorId): Promise<Connector> { const connector = await repository.findById(tenantId, connectorId); if (connector === null) throw new InvariantViolation("Connector was not found"); return connector; }
async function requireExecution(repository: ConnectorExecutionRepository, tenantId: TenantId, executionId: ConnectorExecutionId): Promise<ConnectorExecution> { const execution = await repository.findById(tenantId, executionId); if (execution === null) throw new InvariantViolation("ConnectorExecution was not found"); return execution; }

export async function registerConnector(repository: ConnectorRepository, command: RegisterConnectorCommand): Promise<Connector> { const connector = Connector.create(command); await repository.save(connector, Version.initial()); return connector; }
export async function activateConnector(repository: ConnectorRepository, tenantId: TenantId, command: ConnectorLifecycleCommand): Promise<Connector> { const connector = await requireConnector(repository, tenantId, command.connectorId); const expected = connector.version; connector.activate(command); await repository.save(connector, expected); return connector; }
export async function suspendConnector(repository: ConnectorRepository, tenantId: TenantId, command: ConnectorLifecycleCommand): Promise<Connector> { const connector = await requireConnector(repository, tenantId, command.connectorId); const expected = connector.version; connector.suspend(command); await repository.save(connector, expected); return connector; }
export async function retireConnector(repository: ConnectorRepository, tenantId: TenantId, command: ConnectorLifecycleCommand): Promise<Connector> { const connector = await requireConnector(repository, tenantId, command.connectorId); const expected = connector.version; connector.retire(command); await repository.save(connector, expected); return connector; }

export async function createExecution(connectorRepository: ConnectorRepository, executionRepository: ConnectorExecutionRepository, tenantId: TenantId, command: CreateExecutionCommand): Promise<ConnectorExecution> {
  const connector = await requireConnector(connectorRepository, tenantId, command.connectorReference.id);
  if (connector.status !== "ACTIVE") throw new InvariantViolation("Only an ACTIVE Connector accepts new executions");
  const capability = connector.findCapability(command.capabilityReference.id);
  if (!capability.supports(command.operationKey)) throw new InvariantViolation("Connector capability does not support operationKey");
  const existing = await executionRepository.findByIdempotencyKey(tenantId, command.connectorReference.id, command.operationKey.value, command.request.idempotencyKey);
  if (existing !== null) return existing;
  const execution = ConnectorExecution.create(command);
  await executionRepository.save(execution, Version.initial());
  return execution;
}
export async function startExecution(repository: ConnectorExecutionRepository, tenantId: TenantId, command: { readonly executionId: ConnectorExecutionId } & ConnectorLifecycleCommand): Promise<ConnectorExecution> { const execution = await requireExecution(repository, tenantId, command.executionId); const expected = execution.version; execution.start(command); await repository.save(execution, expected); return execution; }
export async function completeExecution(repository: ConnectorExecutionRepository, tenantId: TenantId, command: CompleteExecutionCommand, resultMetadata: Record<string, unknown> = {}): Promise<ConnectorExecution> { const execution = await requireExecution(repository, tenantId, command.executionId); const expected = execution.version; execution.complete(command, resultMetadata as never); await repository.save(execution, expected); return execution; }
export async function failExecution(repository: ConnectorExecutionRepository, tenantId: TenantId, command: FailExecutionCommand, resultMetadata: Record<string, unknown> = {}): Promise<ConnectorExecution> { const execution = await requireExecution(repository, tenantId, command.executionId); const expected = execution.version; execution.fail(command, resultMetadata as never); await repository.save(execution, expected); return execution; }
export async function cancelExecution(repository: ConnectorExecutionRepository, tenantId: TenantId, command: CancelExecutionCommand): Promise<ConnectorExecution> { const execution = await requireExecution(repository, tenantId, command.executionId); const expected = execution.version; execution.cancel(command); await repository.save(execution, expected); return execution; }

export async function executeTransport(repository: ConnectorExecutionRepository, transport: ConnectorTransportPort, delivery: ConnectorObservationDeliveryPort | undefined, tenantId: TenantId, executionId: ConnectorExecutionId, startCommand: { readonly executionId: ConnectorExecutionId } & ConnectorLifecycleCommand, terminalAudit: CompleteExecutionCommand | FailExecutionCommand): Promise<ConnectorExecution> {
  const started = await startExecution(repository, tenantId, startCommand);
  const result = await transport.execute({ request: started.request });
  const terminal = result.status === "SUCCESS" ? await completeExecution(repository, tenantId, { ...terminalAudit, externalEvidence: result.evidence } as CompleteExecutionCommand, result.technicalMetadata) : await failExecution(repository, tenantId, { ...terminalAudit, externalEvidence: result.evidence } as FailExecutionCommand, result.technicalMetadata);
  if (delivery !== undefined) { const eventEvidenceIds = (terminal.domainEvents.at(-1)?.toJSON().evidenceIds as readonly string[] | undefined) ?? []; await delivery.deliverObservation({ execution: terminal.reference, connector: terminal.connectorReference, operationKey: terminal.operationKey, result: terminal.status, ...(terminal.externalEvidence?.kind === "SUCCESS" ? { externalIdentifier: terminal.externalEvidence.toJSON().externalIdentifier as string } : {}), ...(terminal.externalEvidence?.kind === "FAILURE" ? { failureCode: terminal.externalEvidence.toJSON().failureCode as string } : {}), observedAt: result.receivedAt, evidenceIds: eventEvidenceIds, correlationId: terminalAudit.correlationId.toString(), ...(terminalAudit.causationId === undefined ? {} : { causationId: terminalAudit.causationId.toString() }) }); }
  return terminal;
}
