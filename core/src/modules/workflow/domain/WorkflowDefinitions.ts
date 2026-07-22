import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { StageId, TaskId, TenantId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, DecisionReference, KnowledgeReference, MissionReference, PolicyReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export type TaskKind = "COORDINATION" | "GOVERNANCE_CHECKPOINT" | "WORK_ASSIGNMENT" | "ASSET_CHECK" | "KNOWLEDGE_CHECK";
export type TaskDefinitionReference = MissionReference | AssetReference | AssetVersionReference | KnowledgeReference | PolicyReference | DecisionReference;
export type TaskDefinitionReferenceKind = "mission" | "asset" | "asset_version" | "knowledge" | "policy" | "decision";
export interface SerializedTaskDefinitionReference { readonly kind: TaskDefinitionReferenceKind; readonly reference: JsonObject; }

export function serializeTaskDefinitionReference(reference: TaskDefinitionReference): SerializedTaskDefinitionReference {
  if (reference instanceof AssetVersionReference) return { kind: "asset_version", reference: reference.toJSON() };
  if (reference instanceof MissionReference) return { kind: "mission", reference: reference.toJSON() };
  if (reference instanceof AssetReference) return { kind: "asset", reference: reference.toJSON() };
  if (reference instanceof KnowledgeReference) return { kind: "knowledge", reference: reference.toJSON() };
  if (reference instanceof PolicyReference) return { kind: "policy", reference: reference.toJSON() };
  return { kind: "decision", reference: reference.toJSON() };
}

export function deserializeTaskDefinitionReference(value: SerializedTaskDefinitionReference): TaskDefinitionReference {
  if (value.kind === "mission") return MissionReference.fromJSON(value.reference as { id: string; tenantId: string });
  if (value.kind === "asset") return AssetReference.fromJSON(value.reference as { id: string; tenantId: string });
  if (value.kind === "asset_version") return AssetVersionReference.fromJSON(value.reference as { assetId: string; versionId: string; tenantId: string });
  if (value.kind === "knowledge") return KnowledgeReference.fromJSON(value.reference as { id: string; tenantId: string });
  if (value.kind === "policy") return PolicyReference.fromJSON(value.reference as { id: string; tenantId: string });
  if (value.kind === "decision") return DecisionReference.fromJSON(value.reference as { id: string; tenantId: string });
  throw new ValidationError("Unsupported TaskDefinition reference kind", { kind: String(value.kind) });
}

export interface TaskDefinitionSnapshot {
  readonly taskId: string;
  readonly name: string;
  readonly kind: TaskKind;
  readonly references: readonly SerializedTaskDefinitionReference[];
  readonly dueDate: string | null;
  readonly metadata: JsonObject;
}

export class TaskDefinition extends ValueObject<JsonObject> {
  public readonly taskId: TaskId;
  public readonly name: string;
  public readonly kind: TaskKind;
  public readonly references: readonly TaskDefinitionReference[];
  public readonly dueDate: string | null;
  public readonly metadata: JsonObject;

  public constructor(props: { readonly taskId: TaskId; readonly name: string; readonly kind: TaskKind; readonly references?: readonly TaskDefinitionReference[]; readonly dueDate?: string | null; readonly metadata?: JsonObject }) {
    const name = props.name.trim();
    if (!name) throw new ValidationError("TaskDefinition requires a name");
    const references = [...(props.references ?? [])];
    const snapshot: TaskDefinitionSnapshot = { taskId: props.taskId.toString(), name, kind: props.kind, references: references.map(serializeTaskDefinitionReference), dueDate: props.dueDate ?? null, metadata: props.metadata ?? {} };
    super(snapshot as unknown as JsonObject);
    this.taskId = props.taskId;
    this.name = name;
    this.kind = props.kind;
    this.references = Object.freeze(references);
    this.dueDate = props.dueDate ?? null;
    this.metadata = this.rawValue.metadata as JsonObject;
    Object.freeze(this);
  }

  public static fromSnapshot(snapshot: JsonObject): TaskDefinition {
    return new TaskDefinition({ taskId: TaskId.from(String(snapshot.taskId)), name: String(snapshot.name), kind: snapshot.kind as TaskKind, references: (snapshot.references as unknown as readonly SerializedTaskDefinitionReference[]).map(deserializeTaskDefinitionReference), dueDate: snapshot.dueDate === null ? null : String(snapshot.dueDate), metadata: snapshot.metadata as JsonObject });
  }
}

export interface StageDefinitionSnapshot {
  readonly stageId: string;
  readonly name: string;
  readonly dependencies: readonly string[];
  readonly taskIds: readonly string[];
  readonly metadata: JsonObject;
}

export class StageDefinition extends ValueObject<JsonObject> {
  public readonly stageId: StageId;
  public readonly name: string;
  public readonly dependencies: readonly StageId[];
  public readonly taskIds: readonly TaskId[];
  public readonly metadata: JsonObject;

  public constructor(props: { readonly stageId: StageId; readonly name: string; readonly dependencies?: readonly StageId[]; readonly taskIds: readonly TaskId[]; readonly metadata?: JsonObject }) {
    const name = props.name.trim();
    if (!name) throw new ValidationError("StageDefinition requires a name");
    if (props.taskIds.length === 0) throw new ValidationError("StageDefinition requires at least one TaskDefinition");
    super({ stageId: props.stageId.toString(), name, dependencies: [...(props.dependencies ?? [])].map((item) => item.toString()), taskIds: props.taskIds.map((item) => item.toString()), metadata: props.metadata ?? {} });
    this.stageId = props.stageId;
    this.name = name;
    this.dependencies = Object.freeze([...(props.dependencies ?? [])]);
    this.taskIds = Object.freeze([...props.taskIds]);
    this.metadata = this.rawValue.metadata as JsonObject;
    Object.freeze(this);
  }

  public static fromSnapshot(snapshot: JsonObject): StageDefinition {
    return new StageDefinition({ stageId: StageId.from(String(snapshot.stageId)), name: String(snapshot.name), dependencies: (snapshot.dependencies as readonly string[]).map(StageId.from), taskIds: (snapshot.taskIds as readonly string[]).map(TaskId.from), metadata: snapshot.metadata as JsonObject });
  }
}

export function assertTaskReferencesTenantBound(task: TaskDefinition, tenantId: TenantId): void {
  for (const reference of task.references) {
    if (!reference.tenantId.equals(tenantId)) throw new ValidationError("TaskDefinition reference crossed a Tenant boundary", { taskId: task.taskId.toString() });
  }
}
