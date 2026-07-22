import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { StageId, TaskId, TenantId } from "../../../shared/identity/index.js";
import { WorkAssignmentReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import type { StageExecutionStatus } from "./StageExecutionStatus.js";
import type { TaskExecutionStatus } from "./TaskExecutionStatus.js";

export interface StageExecutionSnapshot extends JsonObject {
  readonly stageId: string;
  readonly status: StageExecutionStatus;
}

export class StageExecution extends ValueObject<JsonObject> {
  public readonly stageId: StageId;
  public readonly status: StageExecutionStatus;

  public constructor(props: { readonly stageId: StageId; readonly status: StageExecutionStatus }) {
    super({ stageId: props.stageId.toString(), status: props.status });
    this.stageId = props.stageId;
    this.status = props.status;
    Object.freeze(this);
  }

  public static fromSnapshot(snapshot: JsonObject): StageExecution {
    return new StageExecution({ stageId: StageId.from(String(snapshot.stageId)), status: snapshot.status as StageExecutionStatus });
  }
}

export interface TaskExecutionSnapshot extends JsonObject {
  readonly taskId: string;
  readonly stageId: string;
  readonly status: TaskExecutionStatus;
  readonly workAssignmentReference: JsonObject | null;
  readonly failure: string | null;
}

export class TaskExecution extends ValueObject<JsonObject> {
  public readonly taskId: TaskId;
  public readonly stageId: StageId;
  public readonly status: TaskExecutionStatus;
  public readonly workAssignmentReference: WorkAssignmentReference | null;
  public readonly failure: string | null;

  public constructor(props: { readonly taskId: TaskId; readonly stageId: StageId; readonly status: TaskExecutionStatus; readonly workAssignmentReference?: WorkAssignmentReference | null; readonly failure?: string | null }) {
    const failure = props.failure?.trim() ?? null;
    if (props.status === "FAILED" && !failure) throw new InvariantViolation("Failed TaskExecution requires a failure reason");
    super({ taskId: props.taskId.toString(), stageId: props.stageId.toString(), status: props.status, workAssignmentReference: props.workAssignmentReference?.toJSON() ?? null, failure });
    this.taskId = props.taskId;
    this.stageId = props.stageId;
    this.status = props.status;
    this.workAssignmentReference = props.workAssignmentReference ?? null;
    this.failure = failure;
    Object.freeze(this);
  }

  public static fromSnapshot(snapshot: JsonObject): TaskExecution {
    return new TaskExecution({ taskId: TaskId.from(String(snapshot.taskId)), stageId: StageId.from(String(snapshot.stageId)), status: snapshot.status as TaskExecutionStatus, workAssignmentReference: snapshot.workAssignmentReference === null ? null : WorkAssignmentReference.fromJSON(snapshot.workAssignmentReference as { id: string; tenantId: string }), failure: snapshot.failure === null ? null : String(snapshot.failure) });
  }

  public assertTenant(tenantId: TenantId): void {
    if (this.workAssignmentReference !== null && !this.workAssignmentReference.tenantId.equals(tenantId)) throw new InvariantViolation("TaskExecution WorkAssignmentReference crossed a Tenant boundary");
  }
}
