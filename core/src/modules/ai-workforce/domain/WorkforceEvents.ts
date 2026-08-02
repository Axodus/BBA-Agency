import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { DomainEvent, type DomainEventProps } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface WorkforceEventProps { readonly aggregateId: string; readonly tenantId: TenantId; readonly occurredAt: string; readonly version: Version; readonly correlationId: string; readonly causationId?: string; readonly evidenceIds?: readonly string[]; readonly lineage?: readonly JsonObject[]; readonly payload?: JsonObject; }

export class WorkforceDomainEvent extends DomainEvent {
  public readonly type: string; public readonly correlationId: string; public readonly causationId: string | undefined; public readonly evidenceIds: readonly string[]; public readonly lineage: readonly JsonObject[]; public readonly payload: JsonObject;
  public constructor(type: string, props: WorkforceEventProps) {
    const base: DomainEventProps = { eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`, occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version };
    super(base); this.type = type; this.correlationId = props.correlationId; this.causationId = props.causationId;
    this.evidenceIds = Object.freeze([...(props.evidenceIds ?? [])]); this.lineage = deepFreeze([...(props.lineage ?? [])]); this.payload = deepFreeze({ ...(props.payload ?? {}) }); Object.freeze(this);
  }
  public override toJSON(): JsonObject { const result: Record<string, JsonValue> = { ...super.toJSON(), type: this.type, correlationId: this.correlationId, evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload }; if (this.causationId !== undefined) result.causationId = this.causationId; return result; }
}

function eventType(name: string): new (props: WorkforceEventProps) => WorkforceDomainEvent { return class extends WorkforceDomainEvent { public constructor(props: WorkforceEventProps) { super(name, props); } }; }
export const AgentProvisioned = eventType("AgentProvisioned");
export const AgentActivated = eventType("AgentActivated");
export const AgentPaused = eventType("AgentPaused");
export const AgentResumed = eventType("AgentResumed");
export const AgentRetired = eventType("AgentRetired");
export const AgentAssigned = eventType("AgentAssigned");
export const ExecutionStarted = eventType("ExecutionStarted");
export const ExecutionCompleted = eventType("ExecutionCompleted");
export const ExecutionFailed = eventType("ExecutionFailed");
export const ExecutionCancelled = eventType("ExecutionCancelled");
