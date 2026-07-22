import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface KnowledgePolicyEventProps { readonly aggregateId: string; readonly tenantId: TenantId; readonly occurredAt: string; readonly version: Version; readonly correlationId: string; readonly causationId?: string; readonly evidenceIds: readonly string[]; readonly lineage: readonly JsonObject[]; readonly payload?: JsonObject; }
export class KnowledgePolicyDomainEvent extends DomainEvent {
  public readonly type: string; public readonly correlationId: string; public readonly causationId: string | undefined; public readonly evidenceIds: readonly string[]; public readonly lineage: readonly JsonObject[]; public readonly payload: JsonObject;
  public constructor(type: string, props: KnowledgePolicyEventProps) { super({ eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`, occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version }); this.type = type; this.correlationId = props.correlationId; this.causationId = props.causationId; this.evidenceIds = Object.freeze([...props.evidenceIds]); this.lineage = deepFreeze([...props.lineage]); this.payload = deepFreeze({ ...(props.payload ?? {}) }); Object.freeze(this); }
  public override toJSON(): JsonObject { const value: Record<string, JsonValue> = { ...super.toJSON(), type: this.type, correlationId: this.correlationId, evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload }; if (this.causationId !== undefined) value.causationId = this.causationId; return value; }
}
function eventType(name: string): new (props: KnowledgePolicyEventProps) => KnowledgePolicyDomainEvent { return class extends KnowledgePolicyDomainEvent { public constructor(props: KnowledgePolicyEventProps) { super(name, props); } }; }
export const KnowledgeCreated = eventType("KnowledgeCreated");
export const KnowledgeCurated = eventType("KnowledgeCurated");
export const KnowledgeLinked = eventType("KnowledgeLinked");
export const KnowledgeArchived = eventType("KnowledgeArchived");
export const KnowledgeSuperseded = eventType("KnowledgeSuperseded");
export const PolicyCreated = eventType("PolicyCreated");
export const PolicyVersionCreated = eventType("PolicyVersionCreated");
