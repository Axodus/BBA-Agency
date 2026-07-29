import assert from "node:assert/strict";
import test from "node:test";
import { CorrelationId } from "../../../src/shared/common/CorrelationId.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../src/shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../src/shared/errors/TenantViolation.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, DecisionId, EvidenceId, KnowledgeId, MissionId, PolicyId, StageId, TaskId, TenantId, WorkAssignmentId, WorkflowExecutionId, WorkflowId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AssetReference, AssetVersionReference, DecisionReference, KnowledgeReference, MissionReference, PolicyReference, WorkAssignmentReference } from "../../../src/shared/references/index.js";
import { activateWorkflow, advanceStage, cancelWorkflow, completeWorkflow, createWorkflow, failWorkflowExecution, pauseWorkflow, recordTaskFailure, recordTaskState, resumeWorkflow, startWorkflow } from "../../../src/modules/workflow/application/index.js";
import { StageDefinition, TaskDefinition, Workflow, WorkflowExecution, WorkflowMetadata } from "../../../src/modules/workflow/domain/index.js";
import { InMemoryWorkflowDependencyGraph, InMemoryWorkflowExecutionRepository, InMemoryWorkflowRepository } from "../../../src/modules/workflow/infrastructure/index.js";
import type { MissionWorkflowPort, WorkflowAssetPort, WorkflowAssignmentPort, WorkflowGovernancePort, WorkflowKnowledgePort, WorkflowRepository, WorkflowExecutionRepository } from "../../../src/modules/workflow/ports/index.js";
import { Version } from "../../../src/shared/version/Version.js";

const now = "2026-07-22T12:00:00.000Z";
const tenant = TenantId.from("tenant_alpha");
const otherTenant = TenantId.from("tenant_beta");
const missionReference = new MissionReference(MissionId.from("mission_workflow"), tenant);
const workflowId = WorkflowId.from("workflow_alpha");
const executionId = WorkflowExecutionId.from("workflow_execution_alpha");
const stageOneId = StageId.from("stage_one");
const stageTwoId = StageId.from("stage_two");
const taskOneId = TaskId.from("task_one");
const taskTwoId = TaskId.from("task_two");
const taskThreeId = TaskId.from("task_three");
const assetReference = new AssetReference(AssetId.from("asset_workflow"), tenant);
const assetVersionReference = new AssetVersionReference(AssetId.from("asset_workflow"), AssetVersionId.from("asset_version_workflow_v1"), tenant);
const knowledgeReference = new KnowledgeReference(KnowledgeId.from("knowledge_workflow"), tenant);
const policyReference = new PolicyReference(PolicyId.from("policy_workflow"), tenant);
const decisionReference = new DecisionReference(DecisionId.from("decision_workflow"), tenant);
const workAssignmentReference = new WorkAssignmentReference(WorkAssignmentId.from("work_assignment_workflow"), tenant);

function evidence(id = "evidence_workflow"): readonly EvidenceReference[] {
  return [new EvidenceReference({ evidenceId: EvidenceId.from(id), source: "workflow-test", type: "audit", capturedAt: now })];
}

function lineage(target = "workflow_target"): readonly LineageReference[] {
  return [new LineageReference({ sourceId: "workflow_source", targetId: target, relationship: "references", declaredAt: now })];
}

function audit(reason = "Workflow operation") {
  return { reason, occurredAt: now, correlationId: CorrelationId.from("correlation_workflow"), evidence: evidence(), lineage: lineage() };
}

function metadata(): WorkflowMetadata {
  return new WorkflowMetadata({ name: "Institutional Workflow", summary: "Coordinates a governed Mission", createdAt: now, updatedAt: now });
}

function taskDefinitions(): readonly TaskDefinition[] {
  return [
    new TaskDefinition({ taskId: taskOneId, name: "Validate mission", kind: "COORDINATION", references: [missionReference, decisionReference] }),
    new TaskDefinition({ taskId: taskTwoId, name: "Observe workforce", kind: "WORK_ASSIGNMENT", references: [assetReference, assetVersionReference] }),
    new TaskDefinition({ taskId: taskThreeId, name: "Check policy", kind: "KNOWLEDGE_CHECK", references: [knowledgeReference, policyReference] })
  ];
}

function stageDefinitions(): readonly StageDefinition[] {
  return [
    new StageDefinition({ stageId: stageOneId, name: "Foundation", taskIds: [taskOneId, taskTwoId] }),
    new StageDefinition({ stageId: stageTwoId, name: "Knowledge", dependencies: [stageOneId], taskIds: [taskThreeId] })
  ];
}

function workflow(): Workflow {
  return Workflow.create({ ...audit(), workflowId, tenantId: tenant, missionReference, metadata: metadata(), stageDefinitions: stageDefinitions(), taskDefinitions: taskDefinitions() });
}

function ports(): { readonly mission: MissionWorkflowPort; readonly governance: WorkflowGovernancePort; readonly assets: WorkflowAssetPort; readonly knowledge: WorkflowKnowledgePort; readonly assignments: WorkflowAssignmentPort } {
  return {
    mission: { validateMissionReference: async () => undefined, missionAllowsWorkflow: async () => true },
    governance: { authorizeTransition: async () => "AUTHORIZED", authorizeCancellation: async () => "AUTHORIZED" },
    assets: { validateAsset: async () => undefined, validateAssetVersion: async () => undefined },
    knowledge: { validateKnowledge: async () => undefined, validatePolicy: async () => undefined },
    assignments: { validateAssignment: async () => undefined, notifyAssignment: async () => undefined }
  };
}

async function activeWorkflowRepository(): Promise<InMemoryWorkflowRepository> {
  const repository = new InMemoryWorkflowRepository();
  const created = workflow();
  await repository.save(created, Version.initial());
  const expectedVersion = created.version;
  created.activate(audit("Activate workflow"));
  await repository.save(created, expectedVersion);
  return repository;
}

async function runningExecution(): Promise<{ readonly executions: InMemoryWorkflowExecutionRepository; readonly execution: WorkflowExecution }> {
  const workflows = await activeWorkflowRepository();
  const executions = new InMemoryWorkflowExecutionRepository();
  const availablePorts = ports();
  const execution = await startWorkflow(workflows, executions, availablePorts.governance, tenant, workflowId, { ...audit("Start workflow"), executionId, workflowReference: WorkflowId.from("workflow_alpha").equals(workflowId) ? workflow().reference : workflow().reference, missionReference, tenantId: tenant, initialStageId: stageOneId });
  return { executions, execution };
}

test("Workflow definition starts PROPOSED with immutable StageDefinition and TaskDefinition", () => {
  const created = workflow();
  assert.equal(created.status, "PROPOSED");
  assert.equal(created.version.value, 1);
  assert.equal(Object.isFrozen(created.stageDefinitions[0]), true);
  assert.equal(Object.isFrozen(created.taskDefinitions[0]), true);
  assert.equal(created.domainEvents[0]?.toJSON().type, "WorkflowCreated");
  assert.equal(created.stageDefinitions[0]?.toJSON().status, undefined);
  assert.equal(created.taskDefinitions[0]?.toJSON().status, undefined);
});

test("Workflow validates local DAG and Tenant-bound references", () => {
  assert.throws(() => Workflow.create({ ...audit(), workflowId: WorkflowId.from("workflow_cycle"), tenantId: tenant, missionReference, metadata: metadata(), taskDefinitions: [new TaskDefinition({ taskId: taskOneId, name: "Task", kind: "COORDINATION" })], stageDefinitions: [new StageDefinition({ stageId: stageOneId, name: "One", dependencies: [stageTwoId], taskIds: [taskOneId] }), new StageDefinition({ stageId: stageTwoId, name: "Two", dependencies: [stageOneId], taskIds: [taskOneId] })] }), /DAG/u);
  assert.throws(() => Workflow.create({ ...audit(), workflowId: WorkflowId.from("workflow_tenant"), tenantId: tenant, missionReference, metadata: metadata(), stageDefinitions: stageDefinitions(), taskDefinitions: [new TaskDefinition({ taskId: taskOneId, name: "Task", kind: "COORDINATION", references: [new MissionReference(MissionId.from("mission_other"), otherTenant)] }), new TaskDefinition({ taskId: taskTwoId, name: "Other", kind: "COORDINATION" }), new TaskDefinition({ taskId: taskThreeId, name: "Third", kind: "COORDINATION" })] }), /Tenant/u);
});

test("Application use cases create and activate Workflow through neutral ports", async () => {
  const repository = new InMemoryWorkflowRepository();
  const availablePorts = ports();
  const created = await createWorkflow(repository, availablePorts.mission, new InMemoryWorkflowDependencyGraph(), availablePorts.assets, availablePorts.knowledge, { ...audit(), workflowId, tenantId: tenant, missionReference, metadata: metadata(), stageDefinitions: stageDefinitions(), taskDefinitions: taskDefinitions() });
  assert.equal(created.status, "PROPOSED");
  const active = await activateWorkflow(repository, availablePorts.governance, tenant, workflowId, audit("Activate workflow"));
  assert.equal(active.status, "ACTIVE");
});

test("WorkflowExecution freezes the ACTIVE Workflow definition version", async () => {
  const workflows = await activeWorkflowRepository();
  const executions = new InMemoryWorkflowExecutionRepository();
  const availablePorts = ports();
  const active = await workflows.findById(tenant, workflowId);
  assert.ok(active !== null);
  const execution = await startWorkflow(workflows, executions, availablePorts.governance, tenant, workflowId, { ...audit("Start workflow"), executionId, workflowReference: active.reference, missionReference, tenantId: tenant, initialStageId: stageOneId });
  assert.equal(execution.status, "RUNNING");
  assert.equal(execution.workflowDefinitionVersion.value, active.version.value);
  assert.equal(execution.stageDefinitions.length, 2);
  const expectedVersion = active.version;
  active.archive(audit("Archive workflow"));
  await workflows.save(active, expectedVersion);
  const storedExecution = await executions.findById(tenant, executionId);
  assert.equal(storedExecution?.workflowDefinitionVersion.value, 2);
  assert.equal(storedExecution?.stageDefinitions.length, 2);
});

test("TaskReady is emitted only during Stage activation and recordTaskState never produces READY", async () => {
  const { executions } = await runningExecution();
  const started = await executions.findById(tenant, executionId);
  assert.ok(started !== null);
  assert.deepEqual(started.domainEvents, []);
  assert.equal(started.taskExecutions.filter((item) => item.status === "READY").length, 2);
  const availablePorts = ports();
  const observed = await recordTaskState(executions, availablePorts.assignments, tenant, executionId, { ...audit("Observed assignment"), taskId: taskOneId, observedState: "ASSIGNED", workAssignmentReference });
  assert.equal(observed.taskExecutions.find((item) => item.taskId.equals(taskOneId))?.status, "ASSIGNED");
  assert.equal(observed.domainEvents.some((event) => event.toJSON().type === "TaskReady"), false);
  assert.equal(observed.domainEvents.at(-1)?.toJSON().type, "TaskObserved");
});

test("AdvanceStage uses explicit StageDisposition and never selects automatically", async () => {
  const { executions } = await runningExecution();
  const availablePorts = ports();
  const advanced = await advanceStage(executions, availablePorts.governance, tenant, executionId, { ...audit("Advance explicitly"), nextStageId: stageTwoId, disposition: "COMPLETE" });
  assert.equal(advanced.activeStageId?.toString(), stageTwoId.toString());
  assert.equal(advanced.stageExecutions.find((item) => item.stageId.equals(stageOneId))?.status, "COMPLETED");
  assert.equal(advanced.taskExecutions.find((item) => item.taskId.equals(taskThreeId))?.status, "READY");
  assert.throws(() => advanced.advanceStage({ ...audit("Invalid advance"), nextStageId: stageOneId, disposition: "COMPLETE" }), /pending/u);
});

test("CompleteWorkflow resolves only the final active Stage and rejects pending bypass", async () => {
  const { executions } = await runningExecution();
  const availablePorts = ports();
  await assert.rejects(completeWorkflow(executions, availablePorts.governance, tenant, executionId, audit("Premature complete")), /pending Stages/u);
  await advanceStage(executions, availablePorts.governance, tenant, executionId, { ...audit("Advance to final"), nextStageId: stageTwoId, disposition: "SKIP" });
  const completed = await completeWorkflow(executions, availablePorts.governance, tenant, executionId, audit("Complete workflow"));
  assert.equal(completed.status, "COMPLETED");
  assert.equal(completed.stageExecutions.every((item) => item.status === "COMPLETED" || item.status === "SKIPPED"), true);
  assert.equal(completed.domainEvents.at(-1)?.toJSON().type, "WorkflowCompleted");
});

test("WorkflowExecution failure is explicit and task failure fails the execution", async () => {
  const { executions } = await runningExecution();
  const failed = await recordTaskFailure(executions, ports().assignments, tenant, executionId, { ...audit("External failure"), taskId: taskOneId, failure: "External terminal failure", workAssignmentReference });
  assert.equal(failed.status, "FAILED");
  assert.equal(failed.taskExecutions.find((item) => item.taskId.equals(taskOneId))?.status, "FAILED");
  await assert.rejects(completeWorkflow(executions, ports().governance, tenant, executionId, audit("Cannot complete failed")), /completed from FAILED/u);
});

test("WorkflowExecution pause, resume, cancel and fail lifecycles are protected", async () => {
  const { executions } = await runningExecution();
  await pauseWorkflow(executions, tenant, executionId, audit("Pause"));
  const resumed = await resumeWorkflow(executions, tenant, executionId, audit("Resume"));
  assert.equal(resumed.status, "RUNNING");
  const failed = await failWorkflowExecution(executions, tenant, executionId, { ...audit("Fail"), failure: "Manual failure" });
  assert.equal(failed.status, "FAILED");
  const cancelled = await cancelWorkflow(executions, ports().governance, tenant, executionId, audit("Cancel failed execution"));
  assert.equal(cancelled.status, "CANCELLED");
});

function workflowRepositoryContract(name: string, factory: () => WorkflowRepository): void {
  test(`${name} preserves snapshots and optimistic concurrency`, async () => {
    const repository = factory();
    const created = workflow();
    await repository.save(created, Version.initial());
    const first = await repository.findById(tenant, workflowId);
    const second = await repository.findById(tenant, workflowId);
    assert.ok(first !== null && second !== null);
    const firstVersion = first.version;
    const secondVersion = second.version;
    first.activate(audit("Activate first"));
    second.activate(audit("Activate second"));
    await repository.save(first, firstVersion);
    await assert.rejects(repository.save(second, secondVersion), ConcurrencyConflict);
    await assert.rejects(repository.findById(otherTenant, workflowId), TenantViolation);
  });
}

function workflowExecutionRepositoryContract(name: string, factory: () => WorkflowExecutionRepository): void {
  test(`${name} preserves snapshots and optimistic concurrency`, async () => {
    const repository = factory();
    const definition = workflow();
    definition.activate(audit("Activate definition"));
    const execution = WorkflowExecution.start({ ...audit("Start contract"), executionId, workflowReference: definition.reference, missionReference, tenantId: tenant, initialStageId: stageOneId }, { stageDefinitions: definition.stageDefinitions, taskDefinitions: definition.taskDefinitions, workflowDefinitionVersion: definition.version });
    await repository.save(execution, Version.initial());
    const first = await repository.findById(tenant, executionId);
    const second = await repository.findById(tenant, executionId);
    assert.ok(first !== null && second !== null);
    const firstVersion = first.version;
    const secondVersion = second.version;
    first.pause(audit("Pause first"));
    second.pause(audit("Pause second"));
    await repository.save(first, firstVersion);
    await assert.rejects(repository.save(second, secondVersion), ConcurrencyConflict);
    await assert.rejects(repository.findById(otherTenant, executionId), TenantViolation);
  });
}

test("Snapshots rehydrate Workflow and WorkflowExecution without pending events", async () => {
  const created = workflow();
  const restoredWorkflow = Workflow.rehydrate(created.toSnapshot());
  assert.deepEqual(restoredWorkflow.toSnapshot(), created.toSnapshot());
  assert.equal(restoredWorkflow.domainEvents.length, 0);
  created.activate(audit("Activate"));
  const execution = WorkflowExecution.start({ ...audit("Start snapshot"), executionId, workflowReference: created.reference, missionReference, tenantId: tenant, initialStageId: stageOneId }, { stageDefinitions: created.stageDefinitions, taskDefinitions: created.taskDefinitions, workflowDefinitionVersion: created.version });
  const restoredExecution = WorkflowExecution.rehydrate(execution.toSnapshot());
  assert.deepEqual(restoredExecution.toSnapshot(), execution.toSnapshot());
  assert.equal(restoredExecution.domainEvents.length, 0);
});

test("DependencyGraphPort detects cycles without selecting a Stage", async () => {
  const graph = new InMemoryWorkflowDependencyGraph();
  assert.equal(await graph.wouldCreateDependencyCycle({ stageId: stageOneId, dependencies: [stageTwoId], existingEdges: [{ stageId: stageTwoId, dependencies: [stageOneId] }] }), true);
  assert.equal(await graph.wouldCreateDependencyCycle({ stageId: stageTwoId, dependencies: [stageOneId], existingEdges: [{ stageId: stageOneId, dependencies: [] }] }), false);
});

workflowRepositoryContract("InMemoryWorkflowRepository", () => new InMemoryWorkflowRepository());
workflowExecutionRepositoryContract("InMemoryWorkflowExecutionRepository", () => new InMemoryWorkflowExecutionRepository());
