import assert from "node:assert/strict";
import test from "node:test";
import { CausationId, CorrelationId } from "../../../src/shared/common/index.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { ConnectorCapabilityId, ConnectorExecutionId, ConnectorId, EvidenceId, TenantId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { ConnectorCapabilityReference, ConnectorReference } from "../../../src/shared/references/index.js";
import { Version } from "../../../src/shared/version/Version.js";
import { activateConnector, cancelExecution, completeExecution, createExecution, registerConnector, startExecution, suspendConnector } from "../../../src/modules/connector/application/index.js";
import { Connector, ConnectorExecution, ConnectorExecutionStatus, ConnectorOperationKey, ConnectorRequestMetadata, ExternalEvidenceFailure, ExternalEvidenceSuccess, type ConnectorAuditInput, type CreateExecutionCommand, type RegisterConnectorCommand } from "../../../src/modules/connector/domain/index.js";
import { InMemoryConnectorExecutionRepository, InMemoryConnectorRepository } from "../../../src/modules/connector/infrastructure/index.js";

const now = "2026-07-23T12:00:00.000Z";
const later = "2026-07-23T12:01:00.000Z";
const tenantId = TenantId.from("tenant_connector");
const connectorId = ConnectorId.from("connector_test");
const capabilityId = ConnectorCapabilityId.from("connector_capability_publish");
const executionId = ConnectorExecutionId.from("connector_execution_test");
const operationKey = new ConnectorOperationKey("publish.mock");
const connectorReference = new ConnectorReference(connectorId, tenantId);
const capabilityReference = new ConnectorCapabilityReference(capabilityId, tenantId);

function audit(name: string, occurredAt = now): ConnectorAuditInput { return { reason: `connector ${name}`, occurredAt, correlationId: CorrelationId.from(`correlation_connector_${name}`), causationId: CausationId.from(`causation_connector_${name}`), evidence: [new EvidenceReference({ evidenceId: EvidenceId.from(`evidence_connector_${name}`), source: "connector-test", type: "technical-observation", capturedAt: occurredAt })], lineage: [new LineageReference({ sourceId: `connector_${name}`, targetId: "technical_external_system", relationship: "references", declaredAt: occurredAt })] }; }
function registerCommand(): RegisterConnectorCommand { return { ...audit("register"), connectorId, tenantId, metadata: { name: "deterministic mock" }, capabilities: [{ id: capabilityId, type: "PUBLISH", supportedOperationKeys: [operationKey], metadata: { adapter: "test" } }] }; }
function createCommand(): CreateExecutionCommand { return { ...audit("create"), executionId, connectorReference, capabilityReference, operationKey, request: new ConnectorRequestMetadata({ requestKey: "request-1", operationKey: operationKey.value, targetReference: "target:publication:1", idempotencyKey: "idempotency-1", requestedAt: now, technicalAttributes: { attempt: 1, dryRun: true } }) }; }

test("Connector lifecycle and immutable capabilities", async () => {
  const repository = new InMemoryConnectorRepository();
  let connector = await registerConnector(repository, registerCommand());
  assert.equal(connector.status, "REGISTERED");
  assert.equal(connector.capabilities[0]?.supports(operationKey), true);
  assert.equal(Object.isFrozen(connector.capabilities[0]?.toSnapshot()), true);
  connector = await activateConnector(repository, tenantId, { ...audit("activate"), connectorId });
  assert.equal(connector.status, "ACTIVE");
  connector = await suspendConnector(repository, tenantId, { ...audit("suspend"), connectorId });
  assert.equal(connector.status, "SUSPENDED");
  assert.throws(() => Connector.create({ ...registerCommand(), capabilities: [{ ...registerCommand().capabilities[0]!, supportedOperationKeys: [] }] }), /requires unique operation keys/u);
});

test("Execution requires ACTIVE compatible Connector and idempotency", async () => {
  const connectorRepository = new InMemoryConnectorRepository();
  const executionRepository = new InMemoryConnectorExecutionRepository();
  await registerConnector(connectorRepository, registerCommand());
  await assert.rejects(createExecution(connectorRepository, executionRepository, tenantId, createCommand()), /ACTIVE/u);
  await activateConnector(connectorRepository, tenantId, { ...audit("activate-execution"), connectorId });
  const first = await createExecution(connectorRepository, executionRepository, tenantId, createCommand());
  const repeated = await createExecution(connectorRepository, executionRepository, tenantId, { ...createCommand(), executionId: ConnectorExecutionId.from("connector_execution_duplicate") });
  assert.equal(first.id.toString(), repeated.id.toString());
  assert.equal(first.status, ConnectorExecutionStatus.CREATED);
  await assert.rejects(createExecution(connectorRepository, executionRepository, tenantId, { ...createCommand(), executionId: ConnectorExecutionId.from("connector_execution_unsupported"), operationKey: new ConnectorOperationKey("unsupported"), request: new ConnectorRequestMetadata({ requestKey: "request-2", operationKey: "unsupported", targetReference: "target", idempotencyKey: "idempotency-2", requestedAt: now }) }), /support/u);
});

test("Execution follows CREATED/RUNNING/terminal lifecycle and preserves evidence", async () => {
  const connectorRepository = new InMemoryConnectorRepository();
  const executionRepository = new InMemoryConnectorExecutionRepository();
  await registerConnector(connectorRepository, registerCommand());
  await activateConnector(connectorRepository, tenantId, { ...audit("activate-lifecycle"), connectorId });
  let execution = await createExecution(connectorRepository, executionRepository, tenantId, createCommand());
  execution = await startExecution(executionRepository, tenantId, { ...audit("start"), executionId, connectorId });
  execution = await completeExecution(executionRepository, tenantId, { ...audit("complete", later), executionId, externalEvidence: new ExternalEvidenceSuccess({ externalIdentifier: "external-1", providerReference: "provider-1", receivedAt: later, technicalMetadata: { statusCode: 200 } }) }, { statusCode: 200 });
  assert.equal(execution.status, ConnectorExecutionStatus.SUCCEEDED);
  assert.equal(execution.externalEvidence?.kind, "SUCCESS");
  assert.throws(() => execution.cancel({ ...audit("cancel", later), executionId, cancellationReason: "too late" }), /cannot cancel/u);
  assert.deepEqual(ConnectorExecution.rehydrate(execution.toSnapshot()).toSnapshot(), execution.toSnapshot());
  assert.equal(execution.serialize(), ConnectorExecution.rehydrate(JSON.parse(execution.serialize())).serialize());
});

test("FAILED and CANCELLED use distinct terminal evidence semantics", async () => {
  const execution = ConnectorExecution.create(createCommand());
  execution.cancel({ ...audit("cancelled", later), executionId, cancellationReason: "operator requested cancellation" });
  assert.equal(execution.status, ConnectorExecutionStatus.CANCELLED);
  assert.equal(execution.externalEvidence, null);
  const failed = ConnectorExecution.create({ ...createCommand(), executionId: ConnectorExecutionId.from("connector_execution_failed"), request: new ConnectorRequestMetadata({ requestKey: "request-f", operationKey: operationKey.value, targetReference: "target", idempotencyKey: "idempotency-f", requestedAt: now }) });
  failed.start({ ...audit("failed-start"), executionId: failed.id });
  failed.fail({ ...audit("failed", later), executionId: failed.id, externalEvidence: new ExternalEvidenceFailure({ providerReference: "provider-1", failureCode: "TIMEOUT", failureReason: "remote timeout", retryable: true, receivedAt: later }) }, { statusCode: 504 });
  assert.equal(failed.status, ConnectorExecutionStatus.FAILED);
  assert.equal(failed.externalEvidence?.kind, "FAILURE");
});

test("repositories enforce Tenant and optimistic concurrency", async () => {
  const repository = new InMemoryConnectorRepository();
  const connector = Connector.create(registerCommand());
  await repository.save(connector, Version.initial());
  const first = await repository.findById(tenantId, connectorId);
  const second = await repository.findById(tenantId, connectorId);
  assert.ok(first && second);
  first.activate({ ...audit("concurrent-a"), connectorId });
  second.activate({ ...audit("concurrent-b"), connectorId });
  await repository.save(first, Version.from(1));
  await assert.rejects(repository.save(second, Version.from(1)), ConcurrencyConflict);
});
