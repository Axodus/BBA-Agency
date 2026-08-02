import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import type { CausationId, CorrelationId, JsonObject } from "../../../shared/common/index.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { StageId, TaskId, TenantId, WorkflowExecutionId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { MissionReference, WorkflowExecutionReference, WorkflowReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { AdvanceStageCommand, CancelWorkflowCommand, CompleteWorkflowCommand, FailWorkflowExecutionCommand, PauseWorkflowCommand, RecordTaskFailureCommand, RecordTaskStateCommand, ResumeWorkflowCommand, StartWorkflowCommand, WorkflowAuditInput } from "./WorkflowCommands.js";
import { StageDefinition, TaskDefinition } from "./WorkflowDefinitions.js";
import { StageActivated, StageCompleted, TaskObserved, TaskReady, WorkflowCancelled, WorkflowCompleted, WorkflowDomainEvent, WorkflowFailed, WorkflowPaused, WorkflowResumed, WorkflowStarted } from "./WorkflowEvents.js";
import { StageExecution, TaskExecution } from "./WorkflowExecutionState.js";
import type { WorkflowExecutionStatus } from "./WorkflowExecutionStatus.js";
import { evidenceFromJSON, lineageFromJSON } from "./WorkflowSerialization.js";

export interface WorkflowExecutionSnapshot {
  readonly schemaVersion: 1;
  readonly executionId: string;
  readonly tenantId: string;
  readonly workflowReference: JsonObject;
  readonly workflowDefinitionVersion: number;
  readonly missionReference: JsonObject;
  readonly status: WorkflowExecutionStatus;
  readonly activeStageId: string | null;
  readonly stageDefinitions: readonly JsonObject[];
  readonly taskDefinitions: readonly JsonObject[];
  readonly stageExecutions: readonly JsonObject[];
  readonly taskExecutions: readonly JsonObject[];
  readonly failure: string | null;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly version: number;
}

export class WorkflowExecution extends AggregateRoot<WorkflowExecutionId> {
  private readonly executionTenantId: TenantId;
  private readonly executionWorkflowReference: WorkflowReference;
  private readonly executionWorkflowDefinitionVersion: Version;
  private readonly executionMissionReference: MissionReference;
  private readonly executionStageDefinitions: readonly StageDefinition[];
  private readonly executionTaskDefinitions: readonly TaskDefinition[];
  private executionStatus: WorkflowExecutionStatus;
  private executionActiveStageId: StageId | null;
  private executionStageExecutions: StageExecution[];
  private executionTaskExecutions: TaskExecution[];
  private executionFailure: string | null;
  private executionEvidence: EvidenceReference[];
  private executionLineage: LineageReference[];

  private constructor(id: WorkflowExecutionId, state: { readonly tenantId: TenantId; readonly workflowReference: WorkflowReference; readonly workflowDefinitionVersion: Version; readonly missionReference: MissionReference; readonly status: WorkflowExecutionStatus; readonly activeStageId: StageId | null; readonly stageDefinitions: readonly StageDefinition[]; readonly taskDefinitions: readonly TaskDefinition[]; readonly stageExecutions: readonly StageExecution[]; readonly taskExecutions: readonly TaskExecution[]; readonly failure: string | null; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly version: Version }) {
    super(id, state.version);
    this.executionTenantId = state.tenantId;
    this.executionWorkflowReference = state.workflowReference;
    this.executionWorkflowDefinitionVersion = state.workflowDefinitionVersion;
    this.executionMissionReference = state.missionReference;
    this.executionStageDefinitions = Object.freeze([...state.stageDefinitions]);
    this.executionTaskDefinitions = Object.freeze([...state.taskDefinitions]);
    this.executionStatus = state.status;
    this.executionActiveStageId = state.activeStageId;
    this.executionStageExecutions = [...state.stageExecutions];
    this.executionTaskExecutions = [...state.taskExecutions];
    this.executionFailure = state.failure;
    this.executionEvidence = [...state.evidence];
    this.executionLineage = [...state.lineage];
    this.assertState();
  }

  public static start(command: StartWorkflowCommand, definition: { readonly stageDefinitions: readonly StageDefinition[]; readonly taskDefinitions: readonly TaskDefinition[]; readonly workflowDefinitionVersion: Version }): WorkflowExecution {
    const stageExecutions = definition.stageDefinitions.map((stage) => new StageExecution({ stageId: stage.stageId, status: "PENDING" }));
    const taskExecutions = definition.stageDefinitions.flatMap((stage) => stage.taskIds.map((taskId) => new TaskExecution({ taskId, stageId: stage.stageId, status: "PENDING" })));
    const execution = new WorkflowExecution(command.executionId, { tenantId: command.tenantId, workflowReference: command.workflowReference, workflowDefinitionVersion: definition.workflowDefinitionVersion, missionReference: command.missionReference, status: "CREATED", activeStageId: null, stageDefinitions: definition.stageDefinitions, taskDefinitions: definition.taskDefinitions, stageExecutions, taskExecutions, failure: null, evidence: command.evidence, lineage: command.lineage, version: Version.initial() });
    execution.executionStatus = "RUNNING";
    execution.incrementVersion();
    execution.requireAudit(command);
    execution.activateStage(command.initialStageId, command);
    execution.emit(WorkflowStarted, command, { workflowId: command.workflowReference.id.toString(), initialStageId: command.initialStageId.toString(), workflowDefinitionVersion: definition.workflowDefinitionVersion.value });
    return execution;
  }

  public static rehydrate(snapshot: WorkflowExecutionSnapshot): WorkflowExecution {
    if (snapshot.schemaVersion !== 1) throw new InvariantViolation("Unsupported WorkflowExecution snapshot schema");
    return new WorkflowExecution(WorkflowExecutionId.from(snapshot.executionId), { tenantId: TenantId.from(snapshot.tenantId), workflowReference: WorkflowReference.fromJSON(snapshot.workflowReference as { id: string; tenantId: string }), workflowDefinitionVersion: Version.from(snapshot.workflowDefinitionVersion), missionReference: MissionReference.fromJSON(snapshot.missionReference as { id: string; tenantId: string }), status: snapshot.status, activeStageId: snapshot.activeStageId === null ? null : StageId.from(snapshot.activeStageId), stageDefinitions: snapshot.stageDefinitions.map(StageDefinition.fromSnapshot), taskDefinitions: snapshot.taskDefinitions.map(TaskDefinition.fromSnapshot), stageExecutions: snapshot.stageExecutions.map(StageExecution.fromSnapshot), taskExecutions: snapshot.taskExecutions.map(TaskExecution.fromSnapshot), failure: snapshot.failure, evidence: snapshot.evidence.map(evidenceFromJSON), lineage: snapshot.lineage.map(lineageFromJSON), version: Version.from(snapshot.version) });
  }

  public get tenantId(): TenantId { return this.executionTenantId; }
  public get workflowReference(): WorkflowReference { return this.executionWorkflowReference; }
  public get workflowDefinitionVersion(): Version { return this.executionWorkflowDefinitionVersion; }
  public get missionReference(): MissionReference { return this.executionMissionReference; }
  public get status(): WorkflowExecutionStatus { return this.executionStatus; }
  public get activeStageId(): StageId | null { return this.executionActiveStageId; }
  public get stageDefinitions(): readonly StageDefinition[] { return [...this.executionStageDefinitions]; }
  public get taskDefinitions(): readonly TaskDefinition[] { return [...this.executionTaskDefinitions]; }
  public get stageExecutions(): readonly StageExecution[] { return [...this.executionStageExecutions]; }
  public get taskExecutions(): readonly TaskExecution[] { return [...this.executionTaskExecutions]; }
  public get failure(): string | null { return this.executionFailure; }
  public get evidence(): readonly EvidenceReference[] { return [...this.executionEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.executionLineage]; }
  public get reference(): WorkflowExecutionReference { return new WorkflowExecutionReference(this.id, this.tenantId); }

  public advanceStage(command: AdvanceStageCommand): void {
    this.requireRunning();
    const currentStageId = this.requireActiveStageId();
    const nextStage = this.stageDefinition(command.nextStageId);
    if (this.stageExecution(command.nextStageId).status !== "PENDING") throw new InvariantViolation("Only pending StageExecution can be activated");
    if (!this.dependenciesResolvedAfterCurrent(nextStage, currentStageId)) throw new InvariantViolation("Stage dependencies are not resolved");
    const completedStatus = command.disposition === "COMPLETE" ? "COMPLETED" : "SKIPPED";
    this.executionStageExecutions = this.stageExecutions.map((item) => item.stageId.equals(currentStageId) ? new StageExecution({ stageId: item.stageId, status: completedStatus }) : item);
    this.mutate(command);
    this.emit(StageCompleted, command, { stageId: currentStageId.toString(), disposition: command.disposition, status: completedStatus });
    this.activateStage(command.nextStageId, command);
    this.assertState();
  }

  public pause(command: PauseWorkflowCommand): void {
    if (this.status !== "RUNNING") throw new InvariantViolation(`WorkflowExecution cannot be paused from ${this.status}`);
    this.executionStatus = "PAUSED";
    this.mutate(command);
    this.emit(WorkflowPaused, command);
  }

  public resume(command: ResumeWorkflowCommand): void {
    if (this.status !== "PAUSED") throw new InvariantViolation(`WorkflowExecution cannot be resumed from ${this.status}`);
    this.executionStatus = "RUNNING";
    this.mutate(command);
    this.emit(WorkflowResumed, command);
  }

  public recordTaskState(command: RecordTaskStateCommand): void {
    this.requireRunning();
    const task = this.taskExecution(command.taskId);
    if (task.status === "COMPLETED" || task.status === "CANCELLED" || task.status === "FAILED") throw new InvariantViolation("Terminal TaskExecution cannot be changed");
    const workAssignmentReference = command.workAssignmentReference ?? task.workAssignmentReference;
    if (workAssignmentReference !== null && !workAssignmentReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("Task observed state crossed a Tenant boundary");
    this.executionTaskExecutions = this.taskExecutions.map((item) => item.taskId.equals(command.taskId) ? new TaskExecution({ taskId: item.taskId, stageId: item.stageId, status: command.observedState, workAssignmentReference }) : item);
    this.mutate(command);
    this.emit(TaskObserved, command, { taskId: command.taskId.toString(), observedState: command.observedState, workAssignmentId: workAssignmentReference?.id.toString() ?? null });
  }

  public recordTaskFailure(command: RecordTaskFailureCommand): void {
    this.requireRunning();
    const task = this.taskExecution(command.taskId);
    const workAssignmentReference = command.workAssignmentReference ?? task.workAssignmentReference;
    if (workAssignmentReference !== null && !workAssignmentReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("Task failure crossed a Tenant boundary");
    this.executionTaskExecutions = this.taskExecutions.map((item) => item.taskId.equals(command.taskId) ? new TaskExecution({ taskId: item.taskId, stageId: item.stageId, status: "FAILED", workAssignmentReference, failure: command.failure }) : item);
    this.fail({ ...command, failure: command.failure });
    this.emit(TaskObserved, command, { taskId: command.taskId.toString(), observedState: "FAILED", workAssignmentId: workAssignmentReference?.id.toString() ?? null, failure: command.failure });
  }

  public complete(command: CompleteWorkflowCommand): void {
    if (this.status !== "RUNNING") throw new InvariantViolation(`WorkflowExecution cannot be completed from ${this.status}`);
    if (this.activeStageId !== null) {
      const pendingStages = this.stageExecutions.filter((item) => item.status === "PENDING");
      if (pendingStages.length > 0) throw new InvariantViolation("WorkflowExecution completion cannot bypass pending Stages");
    }
    this.mutate(command);
    if (this.activeStageId !== null) {
      const activeStageId = this.activeStageId;
      this.executionStageExecutions = this.stageExecutions.map((item) => item.stageId.equals(activeStageId) ? new StageExecution({ stageId: item.stageId, status: "COMPLETED" }) : item);
      this.emit(StageCompleted, command, { stageId: activeStageId.toString(), disposition: "COMPLETE", status: "COMPLETED" });
    }
    if (!this.stageExecutions.every((item) => item.status === "COMPLETED" || item.status === "SKIPPED")) throw new InvariantViolation("WorkflowExecution completion requires all Stages completed or skipped");
    this.executionStatus = "COMPLETED";
    this.executionActiveStageId = null;
    this.emit(WorkflowCompleted, command);
  }

  public cancel(command: CancelWorkflowCommand): void {
    if (this.status === "COMPLETED" || this.status === "CANCELLED") throw new InvariantViolation(`WorkflowExecution cannot be cancelled from ${this.status}`);
    this.executionStatus = "CANCELLED";
    this.executionActiveStageId = null;
    this.mutate(command);
    this.emit(WorkflowCancelled, command);
  }

  public fail(command: FailWorkflowExecutionCommand): void {
    if (this.status === "COMPLETED" || this.status === "CANCELLED") throw new InvariantViolation(`WorkflowExecution cannot be failed from ${this.status}`);
    const failure = command.failure.trim();
    if (!failure) throw new InvariantViolation("WorkflowExecution failure reason is required");
    this.executionStatus = "FAILED";
    this.executionFailure = failure;
    this.executionActiveStageId = null;
    this.mutate(command);
    this.emit(WorkflowFailed, command, { failure });
  }

  public toSnapshot(): WorkflowExecutionSnapshot {
    return { schemaVersion: 1, executionId: this.id.toString(), tenantId: this.tenantId.toString(), workflowReference: this.workflowReference.toJSON(), workflowDefinitionVersion: this.workflowDefinitionVersion.value, missionReference: this.missionReference.toJSON(), status: this.status, activeStageId: this.activeStageId?.toString() ?? null, stageDefinitions: this.stageDefinitions.map((item) => item.toJSON() as JsonObject), taskDefinitions: this.taskDefinitions.map((item) => item.toJSON() as JsonObject), stageExecutions: this.stageExecutions.map((item) => item.toJSON() as JsonObject), taskExecutions: this.taskExecutions.map((item) => item.toJSON() as JsonObject), failure: this.failure, evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), version: this.version.value };
  }

  private activateStage(stageId: StageId, command: WorkflowAuditInput): void {
    const stage = this.stageDefinition(stageId);
    if (!this.dependenciesResolved(stage)) throw new InvariantViolation("Stage dependencies are not resolved");
    if (this.stageExecution(stageId).status !== "PENDING") throw new InvariantViolation("Only pending StageExecution can be activated");
    if (this.executionStageExecutions.some((item) => item.status === "ACTIVE")) throw new InvariantViolation("Only one StageExecution can be active");
    this.executionStageExecutions = this.stageExecutions.map((item) => item.stageId.equals(stageId) ? new StageExecution({ stageId: item.stageId, status: "ACTIVE" }) : item);
    this.executionActiveStageId = stageId;
    this.emit(StageActivated, command, { stageId: stageId.toString() });
    for (const taskId of stage.taskIds) {
      this.executionTaskExecutions = this.taskExecutions.map((item) => item.taskId.equals(taskId) && item.status === "PENDING" ? new TaskExecution({ taskId: item.taskId, stageId: item.stageId, status: "READY" }) : item);
      this.emit(TaskReady, command, { taskId: taskId.toString(), stageId: stageId.toString() });
    }
  }

  private mutate(command: WorkflowAuditInput): void {
    this.requireAudit(command);
    this.executionEvidence = [...this.executionEvidence, ...command.evidence];
    this.executionLineage = [...this.executionLineage, ...command.lineage];
    this.incrementVersion();
  }

  private requireRunning(): void {
    if (this.status !== "RUNNING") throw new InvariantViolation(`WorkflowExecution must be RUNNING, not ${this.status}`);
  }

  private requireActiveStageId(): StageId {
    if (this.activeStageId === null) throw new InvariantViolation("WorkflowExecution requires an active Stage");
    return this.activeStageId;
  }

  private stageDefinition(stageId: StageId): StageDefinition {
    const stage = this.stageDefinitions.find((item) => item.stageId.equals(stageId));
    if (stage === undefined) throw new InvariantViolation("StageDefinition was not found", { stageId: stageId.toString() });
    return stage;
  }

  private stageExecution(stageId: StageId): StageExecution {
    const stage = this.stageExecutions.find((item) => item.stageId.equals(stageId));
    if (stage === undefined) throw new InvariantViolation("StageExecution was not found", { stageId: stageId.toString() });
    return stage;
  }

  private taskExecution(taskId: TaskId): TaskExecution {
    const task = this.taskExecutions.find((item) => item.taskId.equals(taskId));
    if (task === undefined) throw new InvariantViolation("TaskExecution was not found", { taskId: taskId.toString() });
    return task;
  }

  private dependenciesResolved(stage: StageDefinition): boolean {
    return stage.dependencies.every((dependency) => {
      const execution = this.stageExecution(dependency);
      return execution.status === "COMPLETED" || execution.status === "SKIPPED";
    });
  }

  private dependenciesResolvedAfterCurrent(stage: StageDefinition, currentStageId: StageId): boolean {
    return stage.dependencies.every((dependency) => {
      if (dependency.equals(currentStageId)) return true;
      const execution = this.stageExecution(dependency);
      return execution.status === "COMPLETED" || execution.status === "SKIPPED";
    });
  }

  private assertState(): void {
    if (!this.workflowReference.tenantId.equals(this.tenantId) || !this.missionReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("WorkflowExecution references crossed a Tenant boundary");
    if (this.executionEvidence.length === 0 || this.executionLineage.length === 0) throw new InvariantViolation("WorkflowExecution requires Evidence and Lineage");
    if (this.stageExecutions.filter((item) => item.status === "ACTIVE").length > 1) throw new InvariantViolation("Only one StageExecution can be active");
    if (this.status === "RUNNING" && this.activeStageId === null) throw new InvariantViolation("RUNNING WorkflowExecution requires an active Stage");
    const stageIds = new Set(this.stageDefinitions.map((item) => item.stageId.toString()));
    const taskIds = new Set(this.taskDefinitions.map((item) => item.taskId.toString()));
    if (this.stageExecutions.some((item) => !stageIds.has(item.stageId.toString()))) throw new InvariantViolation("StageExecution must reference a StageDefinition");
    if (this.taskExecutions.some((item) => !taskIds.has(item.taskId.toString()))) throw new InvariantViolation("TaskExecution must reference a TaskDefinition");
    for (const task of this.taskExecutions) task.assertTenant(this.tenantId);
  }

  private requireAudit(command: WorkflowAuditInput): void {
    if (command.reason.trim().length === 0 || command.evidence.length === 0 || command.lineage.length === 0) throw new InvariantViolation("WorkflowExecution mutation requires reason, Evidence and Lineage");
  }

  private emit(eventType: new (props: import("./WorkflowEvents.js").WorkflowEventProps) => WorkflowDomainEvent, command: WorkflowAuditInput & { readonly correlationId: CorrelationId; readonly causationId?: CausationId }, payload: JsonObject = {}): void {
    this.recordEvent(new eventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version, correlationId: command.correlationId.toString(), ...(command.causationId ? { causationId: command.causationId.toString() } : {}), evidenceIds: command.evidence.map((item) => item.evidenceId.toString()), lineage: command.lineage.map((item) => item.toJSON()), payload }));
  }
}
