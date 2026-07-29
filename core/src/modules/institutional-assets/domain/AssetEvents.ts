import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface AssetEventProps { readonly aggregateId: string; readonly tenantId: TenantId; readonly occurredAt: string; readonly version: Version; readonly correlationId: string; readonly causationId?: string; readonly evidenceIds: readonly string[]; readonly lineage: readonly JsonObject[]; readonly payload?: JsonObject; }
export class AssetDomainEvent extends DomainEvent {
  public readonly type: string; public readonly correlationId: string; public readonly causationId: string | undefined; public readonly evidenceIds: readonly string[]; public readonly lineage: readonly JsonObject[]; public readonly payload: JsonObject;
  public constructor(type: string, props: AssetEventProps) { super({ eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`, occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version }); this.type = type; this.correlationId = props.correlationId; this.causationId = props.causationId; this.evidenceIds = Object.freeze([...props.evidenceIds]); this.lineage = deepFreeze([...props.lineage]); this.payload = deepFreeze({ ...(props.payload ?? {}) }); Object.freeze(this); }
  public override toJSON(): JsonObject { const value: Record<string, JsonValue> = { ...super.toJSON(), type: this.type, correlationId: this.correlationId, evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload }; if (this.causationId !== undefined) value.causationId = this.causationId; return value; }
}
function eventType(name: string): new (props: AssetEventProps) => AssetDomainEvent { return class extends AssetDomainEvent { public constructor(props: AssetEventProps) { super(name, props); } }; }
export const AssetCreated = eventType("AssetCreated");
export const AssetProduced = eventType("AssetProduced");
export const AssetVersionCreated = eventType("AssetVersionCreated");
export const AssetRelationshipCreated = eventType("AssetRelationshipCreated");
export const AssetArchived = eventType("AssetArchived");
export const AssetSuperseded = eventType("AssetSuperseded");
