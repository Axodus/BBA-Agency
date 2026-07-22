import type { JsonValue } from "../common/serialization.js";
import { Entity } from "../entity/Entity.js";
import { DomainEvent } from "../events/DomainEvent.js";
import { ValueObject } from "../valueobject/ValueObject.js";
import { Version } from "../version/Version.js";

export abstract class AggregateRoot<TId extends ValueObject<JsonValue>> extends Entity<TId> {
  private currentVersion: Version;
  private pendingEvents: DomainEvent[] = [];

  protected constructor(id: TId, version = Version.initial()) {
    super(id);
    this.currentVersion = version;
  }

  public get version(): Version {
    return this.currentVersion;
  }

  protected incrementVersion(): Version {
    this.currentVersion = this.currentVersion.increment();
    return this.currentVersion;
  }

  protected recordEvent(event: DomainEvent): void {
    this.pendingEvents = [...this.pendingEvents, event];
  }

  public get domainEvents(): readonly DomainEvent[] {
    return [...this.pendingEvents];
  }

  public pullEvents(): readonly DomainEvent[] {
    const events = this.domainEvents;
    this.clearEvents();
    return events;
  }

  public clearEvents(): void {
    this.pendingEvents = [];
  }
}
