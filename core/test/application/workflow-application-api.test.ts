import assert from "node:assert/strict";
import { test } from "node:test";
import { WorkflowApplicationApi } from "../../src/application/bindings/WorkflowApplicationApi.js";
import { createWorkflowBindings } from "../../src/application/bindings/WorkflowBindings.js";
import type { WorkflowDependencies } from "../../src/application/bindings/WorkflowBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import type { ApplicationCommandContext, WorkflowCommandRequestDto } from "../../src/application/dto/ApplicationContext.js";

const dependencies = { mission: {}, governance: {}, graph: {}, assets: {}, knowledge: {}, assignments: {} } as WorkflowDependencies;
test("Workflow declares the twelve command and two query bindings", () => { const bindings = createWorkflowBindings(dependencies); assert.deepEqual(Object.keys(bindings).sort(), ["activateWorkflow", "advanceStage", "archiveWorkflow", "cancelWorkflow", "completeWorkflow", "createWorkflow", "failWorkflowExecution", "getWorkflow", "getWorkflowExecution", "pauseWorkflow", "recordTaskFailure", "recordTaskState", "resumeWorkflow", "startWorkflow"]); });
test("Workflow composition rejects missing collaborators", () => { assert.throws(() => createWorkflowBindings({ ...dependencies, governance: undefined } as unknown as WorkflowDependencies), /collaborators are required/u); });

const tenantId = "tenant_workflow_api"; const now = "2026-07-28T13:00:00.000Z";
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_workflow_api" }, correlationId: "correlation_workflow_api", causationId: "causation_workflow_api" };
const audit = { occurredAt: now, evidence: [{ evidenceId: "evidence_workflow_api", source: "workflow-api-test", type: "fixture", capturedAt: now }], lineage: [{ sourceId: "mission_workflow_api", targetId: "workflow_api", relationship: "references", declaredAt: now }] };
const collaborators: WorkflowDependencies = { mission: { validateMissionReference: async () => undefined, missionAllowsWorkflow: async () => true }, governance: { authorizeTransition: async () => "AUTHORIZED", authorizeCancellation: async () => "AUTHORIZED" }, graph: { wouldCreateDependencyCycle: async () => false }, assets: { validateAsset: async () => undefined, validateAssetVersion: async () => undefined }, knowledge: { validateKnowledge: async () => undefined, validatePolicy: async () => undefined }, assignments: { validateAssignment: async () => undefined, notifyAssignment: async () => undefined } };
function command(key: string, targetId: string, payload: Record<string, unknown> = {}): WorkflowCommandRequestDto { return { idempotencyKey: key, reason: key, targetId, payload: { ...audit, ...payload } }; }
function start(executionId: string, key: string): WorkflowCommandRequestDto { return command(key, "workflow_api", { executionId, workflowReference: { id: "workflow_api", tenantId }, missionReference: { id: "mission_workflow_api", tenantId }, initialStageId: "stage_one" }); }

test("Workflow executes all twelve commands and both queries through M12", async () => {
  const provider = new ReferencePersistenceProvider(); const api = new WorkflowApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider)), collaborators);
  const create = command("create-workflow", "workflow_api", { workflowId: "workflow_api", missionReference: { id: "mission_workflow_api", tenantId }, metadata: { name: "Institutional Workflow", summary: "Governed execution", createdAt: now, updatedAt: now }, stageDefinitions: [{ stageId: "stage_one", name: "Foundation", dependencies: [], taskIds: ["task_one"], metadata: {} }, { stageId: "stage_two", name: "Closure", dependencies: ["stage_one"], taskIds: ["task_two"], metadata: {} }], taskDefinitions: [{ taskId: "task_one", name: "Coordinate", kind: "COORDINATION", references: [], dueDate: null, metadata: {} }, { taskId: "task_two", name: "Close", kind: "GOVERNANCE_CHECKPOINT", references: [], dueDate: null, metadata: {} }] });
  const first = await api.createWorkflow(create, context); assert.deepEqual(await api.createWorkflow(create, context), first);
  await api.activateWorkflow(command("activate-workflow", "workflow_api"), context);
  await api.startWorkflow(start("workflow_execution_complete", "start-complete"), context);
  await api.pauseWorkflow(command("pause-workflow", "workflow_execution_complete"), context); await api.resumeWorkflow(command("resume-workflow", "workflow_execution_complete"), context);
  await api.recordTaskState(command("record-task-state", "workflow_execution_complete", { taskId: "task_one", observedState: "COMPLETED" }), context);
  await api.advanceStage(command("advance-stage", "workflow_execution_complete", { nextStageId: "stage_two", disposition: "COMPLETE" }), context);
  await api.completeWorkflow(command("complete-workflow", "workflow_execution_complete"), context);
  await api.startWorkflow(start("workflow_execution_task_failure", "start-task-failure"), context); await api.recordTaskFailure(command("record-task-failure", "workflow_execution_task_failure", { taskId: "task_one", failure: "external failure" }), context);
  await api.startWorkflow(start("workflow_execution_failed", "start-failed"), context); await api.failWorkflowExecution(command("fail-workflow", "workflow_execution_failed", { failure: "execution failure" }), context);
  await api.startWorkflow(start("workflow_execution_cancelled", "start-cancelled"), context); await api.cancelWorkflow(command("cancel-workflow", "workflow_execution_cancelled"), context);
  await api.archiveWorkflow(command("archive-workflow", "workflow_api"), context);
  assert.equal((await api.getWorkflow({ targetId: "workflow_api" }, { tenantId, correlationId: context.correlationId }))?.status, "ARCHIVED");
  const execution = await api.getWorkflowExecution({ targetId: "workflow_execution_complete" }, { tenantId, correlationId: context.correlationId }); assert.equal(execution?.status, "COMPLETED"); assert.equal("stageDefinitions" in (execution as unknown as Record<string, unknown>), false);
  assert.equal(provider.listAuditRecords(tenantId).length, 15);
});

test("Workflow validation rejects malformed requests before Unit of Work", () => { let opened = 0; const api = new WorkflowApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("must not open"); } }), new ApplicationQueryRunner({ open: () => { throw new Error("must not read"); } }), collaborators); assert.throws(() => api.createWorkflow({ idempotencyKey: "invalid", reason: "invalid", payload: {} }, context), /workflowId/u); assert.equal(opened, 0); });
