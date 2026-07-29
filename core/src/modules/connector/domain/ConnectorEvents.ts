import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import type { DomainEventProps } from "../../../shared/events/DomainEvent.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface ConnectorEventProps { readonly aggregateId: string; readonly tenantId: TenantId; readonly occurredAt: string; readonly version: Version; readonly correlationId: string; readonly causationId?: string; readonly evidenceIds: readonly string[]; readonly lineage: readonly JsonObject[]; readonly payload?: JsonObject; }
export class ConnectorDomainEvent extends DomainEvent {
  public readonly type: string; public readonly correlationId: string; public readonly causationId: string | undefined; public readonly evidenceIds: readonly string[]; public readonly lineage: readonly JsonObject[]; public readonly payload: JsonObject;
  public constructor(type: string, props: ConnectorEventProps) {
    super({ eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`, occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version });
    this.type = type; this.correlationId = props.correlationId; this.causationId = props.causationId; this.evidenceIds = Object.freeze([...props.evidenceIds]); this.lineage = deepFreeze([...props.lineage]); this.payload = deepFreeze({ ...(props.payload ?? {}) }); Object.freeze(this);
  }
  public override toJSON(): JsonObject { const result: Record<string, JsonValue> = { ...super.toJSON(), type: this.type, correlationId: this.correlationId, evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload }; if (this.causationId !== undefined) result.causationId = this.causationId; return result; }
}
function eventType(name: string): new (props: ConnectorEventProps) => ConnectorDomainEvent { return class extends ConnectorDomainEvent { public constructor(props: ConnectorEventProps) { super(name, props); } }; }
export const ConnectorRegistered = eventType("ConnectorRegistered");
export const ConnectorActivated = eventType("ConnectorActivated");
export const ConnectorSuspended = eventType("ConnectorSuspended");
export const ConnectorRetired = eventType("ConnectorRetired");
export const ConnectorExecutionCreated = eventType("ConnectorExecutionCreated");
export const ConnectorExecutionStarted = eventType("ConnectorExecutionStarted");
export const ConnectorExecutionSucceeded = eventType("ConnectorExecutionSucceeded");
export const ConnectorExecutionFailed = eventType("ConnectorExecutionFailed");
export const ConnectorExecutionCancelled = eventType("ConnectorExecutionCancelled");
