import { AggregateRoot } from "../../../shared/aggregate/AggregateRoot.js";
import type { CausationId, CorrelationId, JsonObject } from "../../../shared/common/index.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import { TenantId, WorkflowId } from "../../../shared/identity/index.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import { MissionReference, WorkflowReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ActivateWorkflowCommand, ArchiveWorkflowCommand, CreateWorkflowCommand, WorkflowAuditInput } from "./WorkflowCommands.js";
import { assertTaskReferencesTenantBound, StageDefinition, TaskDefinition } from "./WorkflowDefinitions.js";
import { WorkflowActivated, WorkflowArchived, WorkflowCreated, WorkflowDomainEvent } from "./WorkflowEvents.js";
import { WorkflowMetadata } from "./WorkflowMetadata.js";
import { evidenceFromJSON, lineageFromJSON } from "./WorkflowSerialization.js";
import type { WorkflowStatus } from "./WorkflowStatus.js";

export interface WorkflowSnapshot {
  readonly schemaVersion: 1;
  readonly workflowId: string;
  readonly tenantId: string;
  readonly missionReference: JsonObject;
  readonly metadata: JsonObject;
  readonly stageDefinitions: readonly JsonObject[];
  readonly taskDefinitions: readonly JsonObject[];
  readonly status: WorkflowStatus;
  readonly evidence: readonly JsonObject[];
  readonly lineage: readonly JsonObject[];
  readonly version: number;
}

export class Workflow extends AggregateRoot<WorkflowId> {
  private readonly workflowTenantId: TenantId;
  private readonly workflowMissionReference: MissionReference;
  private readonly workflowMetadata: WorkflowMetadata;
  private readonly workflowStageDefinitions: readonly StageDefinition[];
  private readonly workflowTaskDefinitions: readonly TaskDefinition[];
  private workflowStatus: WorkflowStatus;
  private workflowEvidence: EvidenceReference[];
  private workflowLineage: LineageReference[];

  private constructor(id: WorkflowId, state: { readonly tenantId: TenantId; readonly missionReference: MissionReference; readonly metadata: WorkflowMetadata; readonly stageDefinitions: readonly StageDefinition[]; readonly taskDefinitions: readonly TaskDefinition[]; readonly status: WorkflowStatus; readonly evidence: readonly EvidenceReference[]; readonly lineage: readonly LineageReference[]; readonly version: Version }) {
    super(id, state.version);
    this.workflowTenantId = state.tenantId;
    this.workflowMissionReference = state.missionReference;
    this.workflowMetadata = state.metadata;
    this.workflowStageDefinitions = Object.freeze([...state.stageDefinitions]);
    this.workflowTaskDefinitions = Object.freeze([...state.taskDefinitions]);
    this.workflowStatus = state.status;
    this.workflowEvidence = [...state.evidence];
    this.workflowLineage = [...state.lineage];
    this.assertState();
  }

  public static create(command: CreateWorkflowCommand): Workflow {
    const workflow = new Workflow(command.workflowId, { tenantId: command.tenantId, missionReference: command.missionReference, metadata: command.metadata, stageDefinitions: command.stageDefinitions, taskDefinitions: command.taskDefinitions, status: "PROPOSED", evidence: command.evidence, lineage: command.lineage, version: Version.initial() });
    workflow.requireAudit(command);
    workflow.incrementVersion();
    workflow.emit(WorkflowCreated, command, { status: "PROPOSED", stageCount: workflow.stageDefinitions.length, taskCount: workflow.taskDefinitions.length });
    return workflow;
  }

  public static rehydrate(snapshot: WorkflowSnapshot): Workflow {
    if (snapshot.schemaVersion !== 1) throw new InvariantViolation("Unsupported Workflow snapshot schema");
    return new Workflow(WorkflowId.from(snapshot.workflowId), { tenantId: TenantId.from(snapshot.tenantId), missionReference: MissionReference.fromJSON(snapshot.missionReference as { id: string; tenantId: string }), metadata: WorkflowMetadata.fromJSON(snapshot.metadata), stageDefinitions: snapshot.stageDefinitions.map(StageDefinition.fromSnapshot), taskDefinitions: snapshot.taskDefinitions.map(TaskDefinition.fromSnapshot), status: snapshot.status, evidence: snapshot.evidence.map(evidenceFromJSON), lineage: snapshot.lineage.map(lineageFromJSON), version: Version.from(snapshot.version) });
  }

  public get tenantId(): TenantId { return this.workflowTenantId; }
  public get missionReference(): MissionReference { return this.workflowMissionReference; }
  public get metadata(): WorkflowMetadata { return this.workflowMetadata; }
  public get stageDefinitions(): readonly StageDefinition[] { return [...this.workflowStageDefinitions]; }
  public get taskDefinitions(): readonly TaskDefinition[] { return [...this.workflowTaskDefinitions]; }
  public get status(): WorkflowStatus { return this.workflowStatus; }
  public get evidence(): readonly EvidenceReference[] { return [...this.workflowEvidence]; }
  public get lineage(): readonly LineageReference[] { return [...this.workflowLineage]; }
  public get reference(): WorkflowReference { return new WorkflowReference(this.id, this.tenantId); }

  public activate(command: ActivateWorkflowCommand): void {
    if (this.status !== "PROPOSED") throw new InvariantViolation(`Workflow cannot be activated from ${this.status}`);
    this.workflowStatus = "ACTIVE";
    this.mutate(command);
    this.emit(WorkflowActivated, command);
  }

  public archive(command: ArchiveWorkflowCommand): void {
    if (this.status !== "ACTIVE") throw new InvariantViolation(`Workflow cannot be archived from ${this.status}`);
    this.workflowStatus = "ARCHIVED";
    this.mutate(command);
    this.emit(WorkflowArchived, command);
  }

  public toSnapshot(): WorkflowSnapshot {
    return { schemaVersion: 1, workflowId: this.id.toString(), tenantId: this.tenantId.toString(), missionReference: this.missionReference.toJSON(), metadata: this.metadata.toJSON(), stageDefinitions: this.stageDefinitions.map((item) => item.toJSON() as JsonObject), taskDefinitions: this.taskDefinitions.map((item) => item.toJSON() as JsonObject), status: this.status, evidence: this.evidence.map((item) => item.toJSON()), lineage: this.lineage.map((item) => item.toJSON()), version: this.version.value };
  }

  private mutate(command: WorkflowAuditInput): void {
    this.requireAudit(command);
    this.workflowEvidence = [...this.workflowEvidence, ...command.evidence];
    this.workflowLineage = [...this.workflowLineage, ...command.lineage];
    this.incrementVersion();
  }

  private assertState(): void {
    if (!this.missionReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("Workflow MissionReference crossed a Tenant boundary");
    if (this.stageDefinitions.length === 0 || this.taskDefinitions.length === 0) throw new InvariantViolation("Workflow requires StageDefinition and TaskDefinition");
    if (this.workflowEvidence.length === 0 || this.workflowLineage.length === 0) throw new InvariantViolation("Workflow requires Evidence and Lineage");
    const taskIds = new Set(this.taskDefinitions.map((item) => item.taskId.toString()));
    if (taskIds.size !== this.taskDefinitions.length) throw new InvariantViolation("TaskDefinition ids must be unique");
    const stageIds = new Set(this.stageDefinitions.map((item) => item.stageId.toString()));
    if (stageIds.size !== this.stageDefinitions.length) throw new InvariantViolation("StageDefinition ids must be unique");
    for (const task of this.taskDefinitions) assertTaskReferencesTenantBound(task, this.tenantId);
    for (const stage of this.stageDefinitions) {
      if (stage.dependencies.some((dependency) => !stageIds.has(dependency.toString()))) throw new InvariantViolation("StageDefinition dependency is missing");
      if (stage.taskIds.some((taskId) => !taskIds.has(taskId.toString()))) throw new InvariantViolation("StageDefinition references a missing TaskDefinition");
    }
    this.assertLocalDag();
  }

  private assertLocalDag(): void {
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const byId = new Map(this.stageDefinitions.map((item) => [item.stageId.toString(), item]));
    const visit = (stageId: string): void => {
      if (visited.has(stageId)) return;
      if (visiting.has(stageId)) throw new InvariantViolation("Workflow StageDefinition dependencies must form a DAG");
      visiting.add(stageId);
      for (const dependency of byId.get(stageId)?.dependencies ?? []) visit(dependency.toString());
      visiting.delete(stageId);
      visited.add(stageId);
    };
    for (const stage of this.stageDefinitions) visit(stage.stageId.toString());
  }

  private requireAudit(command: WorkflowAuditInput): void {
    if (command.reason.trim().length === 0 || command.evidence.length === 0 || command.lineage.length === 0) throw new InvariantViolation("Workflow mutation requires reason, Evidence and Lineage");
  }

  private emit(eventType: new (props: import("./WorkflowEvents.js").WorkflowEventProps) => WorkflowDomainEvent, command: WorkflowAuditInput & { readonly correlationId: CorrelationId; readonly causationId?: CausationId }, payload: JsonObject = {}): void {
    this.recordEvent(new eventType({ aggregateId: this.id.toString(), tenantId: this.tenantId, occurredAt: command.occurredAt, version: this.version, correlationId: command.correlationId.toString(), ...(command.causationId ? { causationId: command.causationId.toString() } : {}), evidenceIds: command.evidence.map((item) => item.evidenceId.toString()), lineage: command.lineage.map((item) => item.toJSON()), payload }));
  }
}
