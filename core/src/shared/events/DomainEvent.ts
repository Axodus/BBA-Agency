import { assertCanonicalTimestamp } from "../common/timestamps.js";
import type { JsonObject, JsonValue } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";
import { Version } from "../version/Version.js";

export interface DomainEventProps {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly aggregateId: string;
  readonly tenantId?: string;
  readonly version: Version;
}

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: string;
  public readonly aggregateId: string;
  public readonly tenantId?: string;
  public readonly version: Version;

  protected constructor(props: DomainEventProps) {
    if (props.eventId.trim().length === 0 || props.aggregateId.trim().length === 0) {
      throw new ValidationError("DomainEvent eventId and aggregateId are required");
    }
    this.eventId = props.eventId;
    this.occurredAt = assertCanonicalTimestamp(props.occurredAt, "occurredAt");
    this.aggregateId = props.aggregateId;
    if (props.tenantId !== undefined) this.tenantId = props.tenantId;
    this.version = props.version;
    for (const field of ["eventId", "occurredAt", "aggregateId", "tenantId", "version"] as const) {
      if (field in this) Object.defineProperty(this, field, { writable: false, configurable: false });
    }
  }

  public toJSON(): JsonObject {
    const result: Record<string, JsonValue> = {
      eventId: this.eventId,
      occurredAt: this.occurredAt,
      aggregateId: this.aggregateId,
      version: this.version.toJSON()
    };
    if (this.tenantId !== undefined) result.tenantId = this.tenantId;
    return result;
  }
}
