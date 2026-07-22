import { deepFreeze, deterministicHash, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";

export interface ReviewEventProps {
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

export class ReviewDomainEvent extends DomainEvent {
  public readonly type: string;
  public readonly correlationId: string;
  public readonly causationId: string | undefined;
  public readonly evidenceIds: readonly string[];
  public readonly lineage: readonly JsonObject[];
  public readonly payload: JsonObject;

  public constructor(type: string, props: ReviewEventProps) {
    super({
      eventId: `event_${deterministicHash(`${type}:${props.aggregateId}:${props.version.value}:${props.occurredAt}`)}`,
      occurredAt: props.occurredAt, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), version: props.version
    });
    this.type = type;
    this.correlationId = props.correlationId;
    this.causationId = props.causationId;
    this.evidenceIds = Object.freeze([...props.evidenceIds]);
    this.lineage = deepFreeze([...props.lineage]);
    this.payload = deepFreeze({ ...(props.payload ?? {}) });
    Object.freeze(this);
  }

  public override toJSON(): JsonObject {
    const value: Record<string, JsonValue> = {
      ...super.toJSON(), type: this.type, correlationId: this.correlationId,
      evidenceIds: [...this.evidenceIds], lineage: [...this.lineage], payload: this.payload
    };
    if (this.causationId !== undefined) value.causationId = this.causationId;
    return value;
  }
}

function eventType(name: string): new (props: ReviewEventProps) => ReviewDomainEvent {
  return class extends ReviewDomainEvent { public constructor(props: ReviewEventProps) { super(name, props); } };
}

export const ReviewCreated = eventType("ReviewCreated");
export const ReviewStarted = eventType("ReviewStarted");
export const ReviewSessionPlanned = eventType("ReviewSessionPlanned");
export const ReviewSessionOpened = eventType("ReviewSessionOpened");
export const ReviewFindingRecorded = eventType("ReviewFindingRecorded");
export const ReviewSessionClosed = eventType("ReviewSessionClosed");
export const ReviewSessionCancelled = eventType("ReviewSessionCancelled");
export const ReviewCompleted = eventType("ReviewCompleted");
export const ReviewArchived = eventType("ReviewArchived");
