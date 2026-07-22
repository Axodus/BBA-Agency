import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { StageId, TenantId, WorkflowExecutionId, WorkflowId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, DecisionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ActivateWorkflowCommand, AdvanceStageCommand, ArchiveWorkflowCommand, CancelWorkflowCommand, CompleteWorkflowCommand, CreateWorkflowCommand, FailWorkflowExecutionCommand, PauseWorkflowCommand, RecordTaskFailureCommand, RecordTaskStateCommand, ResumeWorkflowCommand, StartWorkflowCommand } from "../domain/WorkflowCommands.js";
import { Workflow } from "../domain/Workflow.js";
import { WorkflowExecution } from "../domain/WorkflowExecution.js";
import type { StageDefinition } from "../domain/WorkflowDefinitions.js";
import type { MissionWorkflowPort, WorkflowAssetPort, WorkflowAssignmentPort, WorkflowDependencyGraphPort, WorkflowExecutionRepository, WorkflowGovernancePort, WorkflowKnowledgePort, WorkflowRepository } from "../ports/index.js";

async function requireWorkflow(repository: WorkflowRepository, tenantId: TenantId, workflowId: WorkflowId): Promise<Workflow> {
  const workflow = await repository.findById(tenantId, workflowId);
  if (workflow === null) throw new InvariantViolation("Workflow was not found", { workflowId: workflowId.toString() });
  return workflow;
}

async function requireExecution(repository: WorkflowExecutionRepository, tenantId: TenantId, executionId: WorkflowExecutionId): Promise<WorkflowExecution> {
  const execution = await repository.findById(tenantId, executionId);
  if (execution === null) throw new InvariantViolation("WorkflowExecution was not found", { executionId: executionId.toString() });
  return execution;
}

async function requireAuthorized(governance: WorkflowGovernancePort, input: Parameters<WorkflowGovernancePort["authorizeTransition"]>[0]): Promise<void> {
  if (await governance.authorizeTransition(input) !== "AUTHORIZED") throw new InvariantViolation("Workflow transition was rejected by Governance");
}

async function validateStageGraph(graph: WorkflowDependencyGraphPort, stages: readonly StageDefinition[]): Promise<void> {
  const existingEdges = stages.map((stage) => ({ stageId: stage.stageId, dependencies: stage.dependencies }));
  for (const stage of stages) {
    if (await graph.wouldCreateDependencyCycle({ stageId: stage.stageId, dependencies: stage.dependencies, existingEdges })) throw new InvariantViolation("Workflow dependency graph would create a cycle");
  }
}

async function validateTaskReferences(assets: WorkflowAssetPort, knowledge: WorkflowKnowledgePort, workflow: Workflow): Promise<void> {
  for (const task of workflow.taskDefinitions) {
    for (const reference of task.references) {
      if (reference instanceof AssetVersionReference) await assets.validateAssetVersion(reference);
      else if (reference instanceof AssetReference) await assets.validateAsset(reference);
      else if (reference instanceof KnowledgeReference) await knowledge.validateKnowledge(reference);
      else if (reference instanceof PolicyReference) await knowledge.validatePolicy(reference);
      else if (reference instanceof DecisionReference) continue;
    }
  }
}

export async function createWorkflow(repository: WorkflowRepository, mission: MissionWorkflowPort, graph: WorkflowDependencyGraphPort, assets: WorkflowAssetPort, knowledge: WorkflowKnowledgePort, command: CreateWorkflowCommand): Promise<Workflow> {
  if (await repository.exists(command.tenantId, command.workflowId)) throw new InvariantViolation("Workflow already exists");
  await mission.validateMissionReference(command.missionReference);
  if (!await mission.missionAllowsWorkflow(command.missionReference)) throw new InvariantViolation("Mission does not allow Workflow coordination");
  await validateStageGraph(graph, command.stageDefinitions);
  const workflow = Workflow.create(command);
  await validateTaskReferences(assets, knowledge, workflow);
  await repository.save(workflow, Version.initial());
  return workflow;
}

export async function activateWorkflow(repository: WorkflowRepository, governance: WorkflowGovernancePort, tenantId: TenantId, workflowId: WorkflowId, command: ActivateWorkflowCommand): Promise<Workflow> {
  const workflow = await requireWorkflow(repository, tenantId, workflowId);
  await requireAuthorized(governance, { tenantId, target: workflow.reference, transition: "ActivateWorkflow", reason: command.reason });
  const expectedVersion = workflow.version;
  workflow.activate(command);
  await repository.save(workflow, expectedVersion);
  return workflow;
}

export async function archiveWorkflow(repository: WorkflowRepository, governance: WorkflowGovernancePort, tenantId: TenantId, workflowId: WorkflowId, command: ArchiveWorkflowCommand): Promise<Workflow> {
  const workflow = await requireWorkflow(repository, tenantId, workflowId);
  await requireAuthorized(governance, { tenantId, target: workflow.reference, transition: "ArchiveWorkflow", reason: command.reason });
  const expectedVersion = workflow.version;
  workflow.archive(command);
  await repository.save(workflow, expectedVersion);
  return workflow;
}

export async function startWorkflow(workflows: WorkflowRepository, executions: WorkflowExecutionRepository, governance: WorkflowGovernancePort, tenantId: TenantId, workflowId: WorkflowId, command: StartWorkflowCommand): Promise<WorkflowExecution> {
  const workflow = await requireWorkflow(workflows, tenantId, workflowId);
  if (workflow.status !== "ACTIVE") throw new InvariantViolation("Only ACTIVE Workflow can be started");
  if (!workflow.reference.equals(command.workflowReference) || !workflow.missionReference.equals(command.missionReference)) throw new InvariantViolation("StartWorkflow references must match Workflow definition");
  if (await executions.exists(command.tenantId, command.executionId)) throw new InvariantViolation("WorkflowExecution already exists");
  await requireAuthorized(governance, { tenantId, target: workflow.reference, transition: "StartWorkflow", reason: command.reason });
  const execution = WorkflowExecution.start(command, { stageDefinitions: workflow.stageDefinitions, taskDefinitions: workflow.taskDefinitions, workflowDefinitionVersion: workflow.version });
  await executions.save(execution, Version.initial());
  return execution;
}

export async function advanceStage(repository: WorkflowExecutionRepository, governance: WorkflowGovernancePort, tenantId: TenantId, executionId: WorkflowExecutionId, command: AdvanceStageCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  await requireAuthorized(governance, { tenantId, target: execution.reference, transition: "AdvanceStage", reason: command.reason });
  const expectedVersion = execution.version;
  execution.advanceStage(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function pauseWorkflow(repository: WorkflowExecutionRepository, tenantId: TenantId, executionId: WorkflowExecutionId, command: PauseWorkflowCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  const expectedVersion = execution.version;
  execution.pause(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function resumeWorkflow(repository: WorkflowExecutionRepository, tenantId: TenantId, executionId: WorkflowExecutionId, command: ResumeWorkflowCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  const expectedVersion = execution.version;
  execution.resume(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function recordTaskState(repository: WorkflowExecutionRepository, assignments: WorkflowAssignmentPort, tenantId: TenantId, executionId: WorkflowExecutionId, command: RecordTaskStateCommand): Promise<WorkflowExecution> {
  if (command.workAssignmentReference !== undefined) {
    await assignments.validateAssignment(command.workAssignmentReference);
    await assignments.notifyAssignment(command.workAssignmentReference);
  }
  const execution = await requireExecution(repository, tenantId, executionId);
  const expectedVersion = execution.version;
  execution.recordTaskState(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function recordTaskFailure(repository: WorkflowExecutionRepository, assignments: WorkflowAssignmentPort, tenantId: TenantId, executionId: WorkflowExecutionId, command: RecordTaskFailureCommand): Promise<WorkflowExecution> {
  if (command.workAssignmentReference !== undefined) await assignments.validateAssignment(command.workAssignmentReference);
  const execution = await requireExecution(repository, tenantId, executionId);
  const expectedVersion = execution.version;
  execution.recordTaskFailure(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function completeWorkflow(repository: WorkflowExecutionRepository, governance: WorkflowGovernancePort, tenantId: TenantId, executionId: WorkflowExecutionId, command: CompleteWorkflowCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  await requireAuthorized(governance, { tenantId, target: execution.reference, transition: "CompleteWorkflow", reason: command.reason });
  const expectedVersion = execution.version;
  execution.complete(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function cancelWorkflow(repository: WorkflowExecutionRepository, governance: WorkflowGovernancePort, tenantId: TenantId, executionId: WorkflowExecutionId, command: CancelWorkflowCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  if (await governance.authorizeCancellation({ tenantId, target: execution.reference, reason: command.reason }) !== "AUTHORIZED") throw new InvariantViolation("Workflow cancellation was rejected by Governance");
  const expectedVersion = execution.version;
  execution.cancel(command);
  await repository.save(execution, expectedVersion);
  return execution;
}

export async function failWorkflowExecution(repository: WorkflowExecutionRepository, tenantId: TenantId, executionId: WorkflowExecutionId, command: FailWorkflowExecutionCommand): Promise<WorkflowExecution> {
  const execution = await requireExecution(repository, tenantId, executionId);
  const expectedVersion = execution.version;
  execution.fail(command);
  await repository.save(execution, expectedVersion);
  return execution;
}
