import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface WorkflowEventProps {
  readonly aggregateId: string;
  readonly tenantId: TenantId;
  readonly occurredAt: string;
  readonly version: Version;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly evidenceIds: readonly string[];
  readonly lineage: readonly JsonObject[];
  readonly payload?: JsonObject;
}

export class WorkflowDomainEvent extends DomainEvent {
  public readonly type: string;
  public readonly correlationId: string;
  public readonly causationId: string | undefined;
  public readonly evidenceIds: readonly string[];
  public readonly lineage: readonly JsonObject[];
  public readonly payload: JsonObject;

  public constructor(type: string, props: WorkflowEventProps) {
    super({ eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`, occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version });
    this.type = type;
    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
    this.evidenceIds = Object.freeze([...props.evidenceIds]);
    this.lineage = deepFreeze([...props.lineage]);
    this.payload = deepFreeze({ ...(props.payload ?? {}) });
    Object.freeze(this);
  }

  public override toJSON(): JsonObject {
    const value: Record<string, JsonValue> = { ...super.toJSON(), type: this.type, correlationId: this.correlationId, evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload };
    if (this.causationId !== undefined) value.causationId = this.causationId;
    return value;
  }
}

function eventType(name: string): new (props: WorkflowEventProps) => WorkflowDomainEvent {
  return class extends WorkflowDomainEvent { public constructor(props: WorkflowEventProps) { super(name, props); } };
}

export const WorkflowCreated = eventType("WorkflowCreated");
export const WorkflowActivated = eventType("WorkflowActivated");
export const WorkflowArchived = eventType("WorkflowArchived");
export const WorkflowStarted = eventType("WorkflowStarted");
export const StageActivated = eventType("StageActivated");
export const StageCompleted = eventType("StageCompleted");
export const TaskReady = eventType("TaskReady");
export const TaskObserved = eventType("TaskObserved");
export const WorkflowPaused = eventType("WorkflowPaused");
export const WorkflowResumed = eventType("WorkflowResumed");
export const WorkflowCompleted = eventType("WorkflowCompleted");
export const WorkflowCancelled = eventType("WorkflowCancelled");
export const WorkflowFailed = eventType("WorkflowFailed");
