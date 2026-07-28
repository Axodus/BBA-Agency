import assert from "node:assert/strict";
import { test } from "node:test";
import { AggregateRoot } from "../../src/shared/aggregate/AggregateRoot.js";
import { CorrelationId } from "../../src/shared/common/CorrelationId.js";
import { DomainEvent, type DomainEventProps } from "../../src/shared/events/DomainEvent.js";
import { Identity } from "../../src/shared/identity/Identity.js";
import { TenantId } from "../../src/shared/identity/TenantId.js";
import { Version } from "../../src/shared/version/Version.js";
import { PersistenceConflict } from "../../src/shared/errors/PersistenceConflict.js";
import { PersistenceFailure } from "../../src/shared/errors/PersistenceFailure.js";
import { PostCommitFailure } from "../../src/shared/errors/PostCommitFailure.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import { TransactionContext } from "../../src/infrastructure/persistence/TransactionContext.js";
import type { AggregateSnapshotCodec } from "../../src/infrastructure/persistence/PersistenceTypes.js";

class TestEvent extends DomainEvent {
  public constructor(props: DomainEventProps) { super(props); }
  public override toJSON() { return { ...super.toJSON(), type: "TestChanged", evidenceIds: [] }; }
}

interface TestSnapshot { readonly id: string; readonly tenantId: string; readonly value: number; readonly version: number; }
class TestAggregate extends AggregateRoot<Identity> {
  private constructor(public readonly tenantId: TenantId, id: Identity, private value: number, version: Version) { super(id, version); }
  public static create(tenantId: TenantId, id: Identity): TestAggregate { return new TestAggregate(tenantId, id, 0, Version.initial()); }
  public static rehydrate(snapshot: TestSnapshot): TestAggregate { return new TestAggregate(TenantId.from(snapshot.tenantId), Identity.from(snapshot.id), snapshot.value, Version.from(snapshot.version)); }
  public change(at: string): void { this.value += 1; const version = this.incrementVersion(); this.recordEvent(new TestEvent({ eventId: `event_${this.id.toString()}_${version.value}`, occurredAt: at, aggregateId: this.id.toString(), tenantId: this.tenantId.toString(), version })); }
  public touch(): void { this.incrementVersion(); }
  public toSnapshot(): TestSnapshot { return { id: this.id.toString(), tenantId: this.tenantId.toString(), value: this.value, version: this.version.value }; }
  public get currentValue(): number { return this.value; }
}

const codec: AggregateSnapshotCodec<TestAggregate, TestSnapshot> = {
  aggregateType: "TestAggregate",
  getAggregateId: (aggregate) => aggregate.id.toString(),
  getTenantId: (aggregate) => aggregate.tenantId.toString(),
  getVersion: (aggregate) => aggregate.version.value,
  toSnapshot: (aggregate) => aggregate.toSnapshot(),
  rehydrate: (snapshot) => TestAggregate.rehydrate(snapshot)
};

function context(transactionId = "transaction_test"): TransactionContext {
  return new TransactionContext({ transactionId, tenantId: "tenant_test", actor: "human_test", correlationId: CorrelationId.deterministic(transactionId).toString(), startedAt: "2026-07-23T12:00:00.000Z" });
}

function aggregate(id = "aggregate_test"): TestAggregate { return TestAggregate.create(TenantId.from("tenant_test"), Identity.from(id)); }

test("commits snapshots, events, audit and only eligible outbox events", async () => {
  const provider = new ReferencePersistenceProvider().withOutboxProjection({ isEligible: () => true, createPayloadReference: (input) => `event-store://${input.tenantId}/${input.aggregateType}/${input.aggregateId}/${input.eventSequence}` });
  const item = aggregate(); item.change("2026-07-23T12:00:01.000Z");
  const uow = provider.begin(context()); uow.stage(item, codec, 0); await uow.commit();
  assert.equal(provider.getEvents("TestAggregate", "tenant_test", "aggregate_test").length, 1);
  assert.equal(provider.getSnapshot("tenant_test|TestAggregate|aggregate_test")?.eventSequence, 1);
  assert.equal(provider.listAuditRecords("tenant_test").length, 1);
  assert.equal(provider.listOutboxMessages("tenant_test").length, 1);
  assert.equal(item.domainEvents.length, 0);
});

test("allows a committed mutation with zero domain events", async () => {
  const provider = new ReferencePersistenceProvider(); const item = aggregate(); item.touch();
  const uow = provider.begin(context("transaction_zero_events")); uow.stage(item, codec, 0); await uow.commit();
  assert.equal(provider.getEvents("TestAggregate", "tenant_test", "aggregate_test").length, 0);
  assert.equal(provider.getSnapshot("tenant_test|TestAggregate|aggregate_test")?.snapshotVersion, 1);
  assert.equal(provider.listAuditRecords("tenant_test")[0]?.operation, "AggregateMutation");
  assert.equal(provider.listOutboxMessages("tenant_test").length, 0);
});

test("is atomic across aggregates and rejects optimistic conflicts", async () => {
  const provider = new ReferencePersistenceProvider(); const first = aggregate("aggregate_a"); const second = aggregate("aggregate_b"); first.change("2026-07-23T12:00:01.000Z"); second.change("2026-07-23T12:00:02.000Z");
  const uow = provider.begin(context("transaction_multi")); uow.stage(first, codec, 0); uow.stage(second, codec, 0); await uow.commit();
  const stale = TestAggregate.rehydrate(first.toSnapshot()); stale.change("2026-07-23T12:00:03.000Z");
  const conflict = provider.begin(context("transaction_conflict")); conflict.stage(stale, codec, 0);
  await assert.rejects(() => conflict.commit(), PersistenceConflict);
  assert.equal(provider.getSnapshot("tenant_test|TestAggregate|aggregate_a")?.aggregateVersion, 1);
});

test("same transaction id is idempotent and different content conflicts", async () => {
  const provider = new ReferencePersistenceProvider(); const item = aggregate(); item.change("2026-07-23T12:00:01.000Z");
  const first = provider.begin(context("transaction_idempotent")); first.stage(item, codec, 0); await first.commit();
  const counts = [provider.getEvents("TestAggregate", "tenant_test", "aggregate_test").length, provider.listAuditRecords("tenant_test").length];
  await first.commit(); assert.deepEqual([provider.getEvents("TestAggregate", "tenant_test", "aggregate_test").length, provider.listAuditRecords("tenant_test").length], counts);
  const different = aggregate(); different.change("2026-07-23T12:00:02.000Z"); const second = provider.begin(context("transaction_idempotent")); second.stage(different, codec, 0);
  await assert.rejects(() => second.commit(), PersistenceConflict);
});

test("requires a snapshot for an existing event stream and exposes not found distinctly", async () => {
  const provider = new ReferencePersistenceProvider(); assert.equal(provider.getTransactionOutcome("missing"), "NOT_FOUND");
  const item = aggregate(); item.change("2026-07-23T12:00:01.000Z"); const uow = provider.begin(context("transaction_snapshot")); uow.stage(item, codec, 0); await uow.commit();
  assert.deepEqual(TestAggregate.rehydrate(provider.getSnapshot("tenant_test|TestAggregate|aggregate_test")!.snapshot as unknown as TestSnapshot).currentValue, 1);
  assert.equal(provider.getEvents("TestAggregate", "tenant_test", "aggregate_test").length, 1);
});

test("post-commit acknowledgement failure invalidates the in-memory aggregate", async () => {
  const provider = new ReferencePersistenceProvider(); provider.failNextAcknowledgment = true; const item = aggregate(); item.change("2026-07-23T12:00:01.000Z"); const uow = provider.begin(context("transaction_ack")); uow.stage(item, codec, 0);
  await assert.rejects(() => uow.commit(), PostCommitFailure); assert.equal(provider.getTransactionOutcome("transaction_ack"), "COMMITTED"); assert.equal(provider.isInvalidated(item), true); assert.throws(() => { const retry = provider.begin(context("transaction_retry")); retry.stage(item, codec, 0); }, PersistenceFailure);
});
