import assert from "node:assert/strict";
import { test } from "node:test";
import { ConnectorApplicationApi } from "../../src/application/bindings/ConnectorApplicationApi.js";
import { createConnectorBindings } from "../../src/application/bindings/ConnectorBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import type { ApplicationCommandContext, ConnectorCommandRequestDto } from "../../src/application/dto/ApplicationContext.js";

const tenantId = "tenant_connector_api";
const now = "2026-07-28T12:00:00.000Z";
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_connector_api" }, correlationId: "correlation_connector_api", causationId: "causation_connector_api" };
const audit = { occurredAt: now, evidence: [{ evidenceId: "evidence_connector_api", source: "connector-api-test", type: "fixture", capturedAt: now }], lineage: [{ sourceId: "source_connector_api", targetId: "connector_api", relationship: "references", declaredAt: now }] };
function command(idempotencyKey: string, targetId: string, payload: Record<string, unknown> = {}): ConnectorCommandRequestDto { return { idempotencyKey, reason: idempotencyKey, targetId, payload: { ...audit, ...payload } }; }
function executionCommand(id: string, suffix: string): ConnectorCommandRequestDto { return command(`create-${suffix}`, id, { executionId: id, connectorReference: { id: "connector_api", tenantId }, capabilityReference: { id: "connector_capability_api", tenantId }, operationKey: "publish.mock", request: { requestKey: `request-${suffix}`, operationKey: "publish.mock", idempotencyKey: `external-${suffix}`, targetReference: `publication:${suffix}`, requestedAt: now, technicalAttributes: { dryRun: true } } }); }

test("Connector excludes executeTransport and exposes the nine public commands plus two queries", () => { assert.deepEqual(Object.keys(createConnectorBindings()).sort(), ["activateConnector", "cancelExecution", "completeExecution", "createExecution", "failExecution", "getConnector", "getConnectorExecution", "registerConnector", "retireConnector", "startExecution", "suspendConnector"]); });

test("Connector executes all public commands through M12 and exposes read-only projections", async () => {
  const provider = new ReferencePersistenceProvider();
  const api = new ConnectorApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider)));
  const register = command("register-connector", "connector_api", { connectorId: "connector_api", metadata: { name: "Mock Connector" }, capabilities: [{ id: "connector_capability_api", type: "PUBLISH", supportedOperationKeys: ["publish.mock"] }] });
  const committed = await api.registerConnector(register, context);
  assert.deepEqual(await api.registerConnector(register, context), committed);
  await api.activateConnector(command("activate-connector", "connector_api"), context);

  await api.createExecution(executionCommand("connector_execution_success", "success"), context);
  await api.startExecution(command("start-success", "connector_execution_success"), context);
  await api.completeExecution(command("complete-success", "connector_execution_success", { externalEvidence: { kind: "SUCCESS", externalIdentifier: "external-success", providerReference: "provider-mock", receivedAt: now, technicalMetadata: { statusCode: 200 } } }), context);

  await api.createExecution(executionCommand("connector_execution_failure", "failure"), context);
  await api.startExecution(command("start-failure", "connector_execution_failure"), context);
  await api.failExecution(command("fail-execution", "connector_execution_failure", { externalEvidence: { kind: "FAILURE", providerReference: "provider-mock", failureCode: "TIMEOUT", failureReason: "timeout", retryable: true, receivedAt: now } }), context);

  await api.createExecution(executionCommand("connector_execution_cancel", "cancel"), context);
  await api.cancelExecution(command("cancel-execution", "connector_execution_cancel", { cancellationReason: "operator request" }), context);
  await api.suspendConnector(command("suspend-connector", "connector_api"), context);
  await api.activateConnector(command("reactivate-connector", "connector_api"), context);
  await api.retireConnector(command("retire-connector", "connector_api"), context);

  assert.equal((await api.getConnector({ targetId: "connector_api" }, { tenantId, correlationId: context.correlationId }))?.status, "RETIRED");
  const execution = await api.getConnectorExecution({ targetId: "connector_execution_success" }, { tenantId, correlationId: context.correlationId });
  assert.deepEqual(execution, { executionId: "connector_execution_success", tenantId, status: "SUCCEEDED", version: 3 });
  assert.equal("externalEvidence" in (execution as unknown as Record<string, unknown>), false);
  assert.equal(provider.listAuditRecords(tenantId).length, 13);
});

test("Connector validation fails before opening a Unit of Work", () => {
  let opened = 0;
  const api = new ConnectorApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("must not open"); } }), new ApplicationQueryRunner({ open: () => { throw new Error("must not read"); } }));
  assert.throws(() => api.registerConnector({ idempotencyKey: "invalid", reason: "invalid", payload: {} }, context), /connectorId/u);
  assert.equal(opened, 0);
});
