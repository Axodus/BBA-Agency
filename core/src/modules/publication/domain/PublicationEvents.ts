import { DomainEvent } from "../../../shared/events/DomainEvent.js";
import type { CausationId, CorrelationId, JsonObject, JsonValue } from "../../../shared/common/index.js";
import { TenantId } from "../../../shared/identity/index.js";
import { Version } from "../../../shared/version/Version.js";

export interface PublicationEventProps {
  readonly aggregateId: string;
  readonly tenantId: TenantId;
  readonly occurredAt: string;
  readonly version: Version;
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly reason: string;
  readonly payload?: JsonObject;
}

export abstract class PublicationDomainEvent extends DomainEvent {
  public readonly type: string;
  public readonly correlationId: CorrelationId;
  public readonly causationId?: CausationId;
  public readonly reason: string;
  public readonly payload: JsonObject;
  protected constructor(type: string, props: PublicationEventProps) {
    super({ eventId: `${type}:${props.aggregateId}:${props.version.value}`, aggregateId: props.aggregateId, tenantId: props.tenantId.toString(), occurredAt: props.occurredAt, version: props.version });
    this.type = type;
    this.correlationId = props.correlationId;
    if (props.causationId !== undefined) this.causationId = props.causationId;
    this.reason = props.reason;
    this.payload = props.payload ?? {};
    Object.freeze(this);
  }
  public override toJSON(): JsonObject {
    const base = super.toJSON();
    const result: Record<string, JsonValue> = { ...base, type: this.type, correlationId: this.correlationId.toString(), reason: this.reason, payload: this.payload };
    if (this.causationId !== undefined) result.causationId = this.causationId.toString();
    return result;
  }
}

export class PublicationCreated extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationCreated", props); } }
export class PublicationPrepared extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationPrepared", props); } }
export class PublicationAuthorized extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationAuthorized", props); } }
export class PublicationOutcomeRecorded extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationOutcomeRecorded", props); } }
export class PublicationPublished extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationPublished", props); } }
export class PublicationArchived extends PublicationDomainEvent { public constructor(props: PublicationEventProps) { super("PublicationArchived", props); } }
