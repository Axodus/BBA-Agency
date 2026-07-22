import assert from "node:assert/strict";
import test from "node:test";
import { AggregateRoot } from "../../src/shared/aggregate/AggregateRoot.js";
import { DomainEvent } from "../../src/shared/events/DomainEvent.js";
import { InvariantViolation, TenantViolation, ValidationError } from "../../src/shared/errors/index.js";
import { Entity } from "../../src/shared/entity/Entity.js";
import { Identity } from "../../src/shared/identity/Identity.js";
import { ValueObject } from "../../src/shared/valueobject/ValueObject.js";
import { Version } from "../../src/shared/version/Version.js";

class TextValue extends ValueObject<string> {
  public constructor(value: string) { super(value); }
}

class ExampleEntity extends Entity<Identity> {
  public constructor(id: Identity) { super(id); }
}

class ExampleEvent extends DomainEvent {
  public constructor(eventId: string, aggregateId: string, version: Version) {
    super({ eventId, occurredAt: "2026-01-01T00:00:00.000Z", aggregateId, version });
    Object.freeze(this);
  }
}

class ExampleAggregate extends AggregateRoot<Identity> {
  public constructor(id: Identity) { super(id); }
  public publishEvent(): void {
    this.recordEvent(new ExampleEvent("event_1", this.id.toString(), this.version));
  }
  public advance(): void { this.incrementVersion(); }
}

test("ValueObject provides equality, deterministic hashing and safe serialization", () => {
  const first = new TextValue("same");
  const second = new TextValue("same");
  const different = new TextValue("different");

  assert.equal(first.equals(second), true);
  assert.equal(first.hashCode(), second.hashCode());
  assert.equal(first.equals(different), false);
  assert.equal(first.toJSON(), "same");
  assert.equal(Reflect.set(first, "props", "changed"), false);
});

test("Entity equality is based on immutable identity", () => {
  const first = new ExampleEntity(Identity.from("example_1"));
  const second = new ExampleEntity(Identity.from("example_1"));
  const different = new ExampleEntity(Identity.from("example_2"));

  assert.equal(first.equals(second), true);
  assert.equal(first.equals(different), false);
  assert.deepEqual(first.toJSON(), { id: "example_1" });
  assert.equal(Reflect.set(first, "identity", Identity.from("example_2")), false);
});

test("AggregateRoot manages version and pending domain events", () => {
  const aggregate = new ExampleAggregate(Identity.from("example_aggregate"));
  assert.equal(aggregate.version.value, 0);
  aggregate.publishEvent();
  assert.equal(aggregate.domainEvents.length, 1);
  assert.equal(Object.isFrozen(aggregate.domainEvents[0]), true);
  aggregate.advance();
  assert.equal(aggregate.version.value, 1);
  assert.equal(aggregate.pullEvents().length, 1);
  assert.equal(aggregate.domainEvents.length, 0);
  aggregate.publishEvent();
  aggregate.clearEvents();
  assert.equal(aggregate.domainEvents.length, 0);
});

test("Domain errors expose stable categories and details", () => {
  const validation = new ValidationError("invalid", { field: "id" });
  const invariant = new InvariantViolation("broken");
  const tenant = new TenantViolation("cross boundary");
  assert.equal(validation.code, "validation_error");
  assert.equal(invariant.code, "invariant_violation");
  assert.equal(tenant.code, "tenant_violation");
  assert.deepEqual(validation.toJSON().details, { field: "id" });
});
