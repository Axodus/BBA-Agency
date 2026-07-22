import type { CausationId, CorrelationId } from "../../../shared/common/index.js";
import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { LineageReference } from "../../../shared/lineage/LineageReference.js";
import type { MissionReference, WorkflowReference, WorkAssignmentReference } from "../../../shared/references/index.js";
import type { StageId, TenantId, TaskId, WorkflowExecutionId, WorkflowId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { StageDefinition, TaskDefinition } from "./WorkflowDefinitions.js";
import type { StageDisposition } from "./StageDisposition.js";
import type { TaskObservedState } from "./TaskObservedState.js";
import type { WorkflowMetadata } from "./WorkflowMetadata.js";

export interface WorkflowAuditInput {
  readonly reason: string;
  readonly occurredAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly evidence: readonly EvidenceReference[];
  readonly lineage: readonly LineageReference[];
}

export interface CreateWorkflowCommand extends WorkflowAuditInput {
  readonly workflowId: WorkflowId;
  readonly tenantId: TenantId;
  readonly missionReference: MissionReference;
  readonly metadata: WorkflowMetadata;
  readonly stageDefinitions: readonly StageDefinition[];
  readonly taskDefinitions: readonly TaskDefinition[];
}
export interface ActivateWorkflowCommand extends WorkflowAuditInput {}
export interface ArchiveWorkflowCommand extends WorkflowAuditInput {}

export interface StartWorkflowCommand extends WorkflowAuditInput {
  readonly executionId: WorkflowExecutionId;
  readonly workflowReference: WorkflowReference;
  readonly missionReference: MissionReference;
  readonly tenantId: TenantId;
  readonly initialStageId: StageId;
}
export interface AdvanceStageCommand extends WorkflowAuditInput { readonly nextStageId: StageId; readonly disposition: StageDisposition; }
export interface PauseWorkflowCommand extends WorkflowAuditInput {}
export interface ResumeWorkflowCommand extends WorkflowAuditInput {}
export interface CompleteWorkflowCommand extends WorkflowAuditInput {}
export interface CancelWorkflowCommand extends WorkflowAuditInput {}
export interface FailWorkflowExecutionCommand extends WorkflowAuditInput { readonly failure: string; }
export interface RecordTaskStateCommand extends WorkflowAuditInput { readonly taskId: TaskId; readonly observedState: TaskObservedState; readonly workAssignmentReference?: WorkAssignmentReference; }
export interface RecordTaskFailureCommand extends WorkflowAuditInput { readonly taskId: TaskId; readonly failure: string; readonly workAssignmentReference?: WorkAssignmentReference; }
export interface PersistedWorkflowCommand<T> { readonly tenantId: TenantId; readonly expectedVersion: Version; readonly command: T; }
