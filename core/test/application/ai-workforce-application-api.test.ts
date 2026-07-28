import assert from "node:assert/strict";
import { test } from "node:test";
import { AIWorkforceApplicationApi } from "../../src/application/bindings/AIWorkforceApplicationApi.js";
import { createAIWorkforceBindings } from "../../src/application/bindings/AIWorkforceBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import type { ApplicationCommandContext, OperationCommandDto, QueryContext } from "../../src/application/dto/ApplicationContext.js";
import type { GovernanceWorkAuthorizationPort } from "../../src/application/ports/GovernanceWorkAuthorizationPort.js";
import type { ReadRepositorySession } from "../../src/application/services/TransactionalRepositorySession.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ProviderBackedAgentRepository } from "../../src/infrastructure/persistence/ProviderBackedRepositories.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import { TransactionContext } from "../../src/infrastructure/persistence/TransactionContext.js";
import { CausationId, CorrelationId } from "../../src/shared/common/index.js";
import { EvidenceReference } from "../../src/shared/evidence/EvidenceReference.js";
import { EvidenceId, AgentId, TenantId } from "../../src/shared/identity/index.js";
import { LineageReference } from "../../src/shared/lineage/LineageReference.js";
import { Version } from "../../src/shared/version/Version.js";

const tenantId = "tenant_ai_workforce_api";
const agentId = "agent_ai_workforce_api";
const missionId = "mission_ai_workforce_api";
const authorityId = "authority_ai_workforce_api";
const decisionId = "decision_ai_workforce_api";
const workAssignmentId = "work_assignment_ai_workforce_api";
const executionId = "execution_ai_workforce_api";
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_ai_workforce_api" }, correlationId: "correlation_ai_workforce_api", causationId: "causation_ai_workforce_api" };

function timestamp(second: number): string { return `2026-07-23T14:00:${String(second).padStart(2, "0")}.000Z`; }
function evidence(id: string, second: number): Record<string, string>[] { return [{ evidenceId: `evidence_${id}`, source: "ai-workforce-application-api-test", type: "test", capturedAt: timestamp(second) }]; }
function lineage(id: string, second: number): Record<string, string>[] { return [{ sourceId: `source_${id}`, targetId: `target_${id}`, relationship: "originates_from", declaredAt: timestamp(second) }]; }
function audit(id: string, second: number) { return { occurredAt: timestamp(second), evidence: evidence(id, second), lineage: lineage(id, second) }; }
function api(provider: ReferencePersistenceProvider, authorization: GovernanceWorkAuthorizationPort): AIWorkforceApplicationApi { return new AIWorkforceApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider)), authorization); }
function provisionCommand(): OperationCommandDto { return { idempotencyKey: "provision-ai-workforce-api", reason: "Provision the public workforce Agent", payload: { agentId, name: "Research Agent", purpose: "Perform bounded source research", definitionVersion: "1.0.0", capabilities: [{ name: "research", scope: "institutional sources", qualityCriteria: ["traceable"] }], ...audit("provision", 0) } }; }
function assignCommand(): OperationCommandDto { return { idempotencyKey: "assign-ai-workforce-api", reason: "Assign the public workforce Agent", payload: { agentId, workAssignmentId, missionId, title: "Research sources", responsibility: "Return traceable findings", requiredCapabilities: [{ name: "research", scope: "institutional sources", qualityCriteria: ["traceable"] }], assignmentPolicy: { exclusive: true, concurrencyKey: "research" }, authorityId, decisionId, ...audit("assign", 2) } }; }
function startCommand(): OperationCommandDto { return { idempotencyKey: "start-ai-workforce-api", reason: "Start the public workforce Execution", payload: { executionId, agentId, workAssignmentId, missionId, ...audit("start", 3) } }; }
function completeCommand(): OperationCommandDto { return { idempotencyKey: "complete-ai-workforce-api", reason: "Complete the public workforce Execution", payload: { executionId, result: { output: { finding: "traceable" }, uncertainty: "low", limitations: ["fixture"], metrics: { count: 1 }, provenance: ["fixture"] }, ...audit("complete", 4) } }; }

class FakeWorkAuthorization implements GovernanceWorkAuthorizationPort {
  public status: "AUTHORIZED" | "REJECTED" = "AUTHORIZED";
  public calls = 0;
  public async authorizeWork(): Promise<{ readonly status: "AUTHORIZED" } | { readonly status: "REJECTED"; readonly reason: string }> { this.calls += 1; return this.status === "AUTHORIZED" ? { status: "AUTHORIZED" } : { status: "REJECTED", reason: "Work authorization rejected by test" }; }
}

async function activateProvisionedAgent(provider: ReferencePersistenceProvider): Promise<void> {
  const repository = new ProviderBackedAgentRepository(provider, new TransactionContext({ transactionId: "seed_activate_ai_workforce", tenantId, actor: "seed_steward", correlationId: "correlation_seed_activate", startedAt: timestamp(1) }));
  const agent = await repository.findById(TenantId.from(tenantId), AgentId.from(agentId));
  assert.ok(agent);
  agent.activate({ reason: "Activate test Agent", occurredAt: timestamp(1), correlationId: CorrelationId.from("correlation_seed_activate"), causationId: CausationId.from("causation_seed_activate"), evidence: [new EvidenceReference({ evidenceId: EvidenceId.from("evidence_seed_activate"), source: "test", type: "seed", capturedAt: timestamp(1) })], lineage: [new LineageReference({ sourceId: "source_seed_activate", targetId: agentId, relationship: "references", declaredAt: timestamp(1) })] });
  await repository.save(agent, Version.from(1));
}

test("AI Workforce declares six executable public bindings and requires Governance authorization", () => {
  const authorization = new FakeWorkAuthorization();
  assert.deepEqual(Object.keys(createAIWorkforceBindings(authorization)).sort(), ["assignAgent", "completeExecution", "getAgent", "getExecution", "provisionAgent", "startExecution"]);
  assert.throws(() => createAIWorkforceBindings(undefined as unknown as GovernanceWorkAuthorizationPort), /GovernanceWorkAuthorizationPort/u);
});

test("AI Workforce commands commit, replay generically, and start Agent plus Execution atomically", async () => {
  const provider = new ReferencePersistenceProvider().withOutboxProjection({ isEligible: () => true, createPayloadReference: (input) => `event-store://${input.tenantId}/${input.aggregateType}/${input.aggregateId}/${input.eventSequence}` }) as ReferencePersistenceProvider; const authorization = new FakeWorkAuthorization(); const application = api(provider, authorization);
  const provisioned = await application.provisionAgent(provisionCommand(), context);
  assert.deepEqual(provisioned.resourceReferences, [{ resourceType: "Agent", resourceId: agentId }]);
  await activateProvisionedAgent(provider);
  const assigned = await application.assignAgent(assignCommand(), context);
  assert.deepEqual(assigned.resourceReferences, [{ resourceType: "Agent", resourceId: agentId }]);
  const started = await application.startExecution(startCommand(), context);
  assert.deepEqual(started.resourceReferences, [{ resourceType: "Execution", resourceId: executionId }]);
  const startAudits = provider.listAuditRecords(tenantId).slice(-2); assert.equal(startAudits.length, 2); assert.equal(startAudits[0]?.transactionId, startAudits[1]?.transactionId);
  const completed = await application.completeExecution(completeCommand(), context);
  assert.deepEqual(completed.resourceReferences, [{ resourceType: "Execution", resourceId: executionId }]);
  const auditBeforeReplay = provider.listAuditRecords(tenantId).length;
  const outboxBeforeReplay = provider.listOutboxMessages(tenantId).length;
  const applicationAudits = provider.listAuditRecords(tenantId).filter((record) => record.actor === context.actor.reference); assert.ok(applicationAudits.length > 0);
  for (const record of applicationAudits) { assert.equal(record.correlationId, context.correlationId); assert.equal(record.causationId, context.causationId); }
  assert.deepEqual(await application.provisionAgent(provisionCommand(), context), provisioned);
  assert.equal(provider.listAuditRecords(tenantId).length, auditBeforeReplay);
  assert.equal(provider.listOutboxMessages(tenantId).length, outboxBeforeReplay);
  assert.equal(authorization.calls, 1);
  const auditBeforeQueries = provider.listAuditRecords(tenantId).length;
  const agent = await application.getAgent({ targetId: agentId }, { tenantId, actor: context.actor, correlationId: context.correlationId });
  assert.equal(agent?.assignments[0]?.status, "ACTIVE"); assert.equal("evidence" in (agent?.assignments[0] ?? {}), false); assert.equal("lineage" in (agent?.assignments[0] ?? {}), false);
  const execution = await application.getExecution({ targetId: executionId }, { tenantId, actor: context.actor, correlationId: context.correlationId });
  assert.equal(execution?.status, "COMPLETED"); assert.deepEqual(execution?.result?.output, { finding: "traceable" });
  assert.equal(provider.listAuditRecords(tenantId).length, auditBeforeQueries);
});

test("AI Workforce rejection rolls back when coordinator authorization runs inside the UoW", async () => {
  const provider = new ReferencePersistenceProvider(); const authorization = new FakeWorkAuthorization(); const application = api(provider, authorization);
  await application.provisionAgent(provisionCommand(), context); await activateProvisionedAgent(provider);
  const before = provider.listAuditRecords(tenantId).length; authorization.status = "REJECTED";
  await assert.rejects(() => application.assignAgent(assignCommand(), context), (error: { readonly code?: string }) => error.code === "FORBIDDEN_CONTEXT");
  assert.equal(provider.listAuditRecords(tenantId).length, before);
});

test("AI Workforce validation occurs before opening a Unit of Work", () => {
  let opened = 0; const authorization = new FakeWorkAuthorization();
  const application = new AIWorkforceApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("Unit of Work must not open"); } }), new ApplicationQueryRunner({ open: () => ({ mission: {} as ReadRepositorySession["mission"], authority: {} as ReadRepositorySession["authority"], decision: {} as ReadRepositorySession["decision"], agent: {} as ReadRepositorySession["agent"], execution: {} as ReadRepositorySession["execution"], asset: {} as ReadRepositorySession["asset"], knowledge: {} as ReadRepositorySession["knowledge"], policy: {} as ReadRepositorySession["policy"] }) }), authorization);
  assert.throws(() => application.provisionAgent({ idempotencyKey: "invalid-workforce", reason: "Invalid Agent", payload: {} }, context), /agentId/u); assert.equal(opened, 0);
});
