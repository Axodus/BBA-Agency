import { deepFreeze, deterministicHash, stableSerialize, type JsonObject } from "../../shared/common/serialization.js";
import { PersistenceConflict } from "../../shared/errors/PersistenceConflict.js";
import { PersistenceFailure } from "../../shared/errors/PersistenceFailure.js";
import { PostCommitFailure } from "../../shared/errors/PostCommitFailure.js";
import type { DomainEvent } from "../../shared/events/DomainEvent.js";
import type { AggregateSnapshotCodec, AuditRecord, OutboxMessage, OutboxProjectionPort, PersistedEvent, SnapshotRecord } from "./PersistenceTypes.js";
import type { EventStorePort, PersistenceProviderPort, SnapshotStorePort, TransactionOutcome, UnitOfWorkPort, PersistableAggregate } from "./PersistencePorts.js";
import { TransactionContext } from "./TransactionContext.js";

interface StagedAggregate { readonly aggregate: PersistableAggregate; readonly codec: AggregateSnapshotCodec<unknown, unknown>; readonly expectedVersion: number; readonly aggregateType: string; readonly aggregateId: string; readonly tenantId: string; readonly snapshot: JsonObject; readonly events: readonly DomainEvent[]; readonly expectedEventSequence: number; readonly expectedSnapshotVersion: number; }
interface ProviderState { readonly snapshots: Map<string, SnapshotRecord>; readonly events: Map<string, readonly PersistedEvent[]>; readonly audits: readonly AuditRecord[]; readonly outbox: readonly OutboxMessage[]; readonly outcomes: Map<string, { readonly fingerprint: string; readonly transactionSequence: number }>; readonly nextTransactionSequence: number; }

function key(type: string, tenant: string, id: string): string { return `${tenant}|${type}|${id}`; }
function clone<T>(value: T): T { return structuredClone(value); }
function eventType(event: DomainEvent): string { return String((event.toJSON().type as string | undefined) ?? event.constructor.name); }

export class ReferencePersistenceProvider implements PersistenceProviderPort, SnapshotStorePort, EventStorePort {
  private state: ProviderState = { snapshots: new Map(), events: new Map(), audits: [], outbox: [], outcomes: new Map(), nextTransactionSequence: 0 };
  private projection: OutboxProjectionPort = { isEligible: () => false, createPayloadReference: ({ tenantId, aggregateType, aggregateId, eventSequence }) => `event-store://${tenantId}/${aggregateType}/${aggregateId}/${eventSequence}` };
  private readonly invalidated = new WeakSet<object>();
  public failNextAcknowledgment = false;
  public begin(context: TransactionContext): UnitOfWorkPort { return new ReferenceUnitOfWork(this, context); }
  public withOutboxProjection(projection: OutboxProjectionPort): PersistenceProviderPort { this.projection = projection; return this; }
  public getTransactionOutcome(transactionId: string): TransactionOutcome { return this.state.outcomes.has(transactionId) ? "COMMITTED" : "NOT_FOUND"; }
  public isInvalidated(aggregate: PersistableAggregate): boolean { return this.invalidated.has(aggregate); }
  public getSnapshot(keyValue: string): SnapshotRecord | null { const record = this.state.snapshots.get(keyValue); return record === undefined ? null : deepFreeze(clone(record)); }
  public listSnapshots(aggregateType: string, tenantId: string): readonly SnapshotRecord[] { return this.freezeList([...this.state.snapshots.values()].filter((item) => item.aggregateType === aggregateType && item.tenantId === tenantId)); }
  public getEvents(aggregateType: string, tenantId: string, aggregateId: string): readonly PersistedEvent[] { return this.freezeList(this.state.events.get(key(aggregateType, tenantId, aggregateId)) ?? []); }
  public listAuditRecords(tenantId: string): readonly AuditRecord[] { return this.freezeList(this.state.audits.filter((item) => item.tenantId === tenantId)); }
  public listOutboxMessages(tenantId: string): readonly OutboxMessage[] { return this.freezeList(this.state.outbox.filter((item) => item.tenantId === tenantId)); }
  public markInvalid(aggregate: PersistableAggregate): void { this.invalidated.add(aggregate); }
  public applyCommit(context: TransactionContext, staged: readonly StagedAggregate[], fingerprint: string): void {
    const known = this.state.outcomes.get(context.transactionId);
    if (known !== undefined) { if (known.fingerprint !== fingerprint) throw new PersistenceConflict("TransactionId was reused with different staged content"); return; }
    const snapshots = new Map(this.state.snapshots); const events = new Map(this.state.events); let audits = [...this.state.audits]; let outbox = [...this.state.outbox];
    const transactionSequence = this.state.nextTransactionSequence + 1;
    const ordered = [...staged].sort((a, b) => `${a.tenantId}|${a.aggregateType}|${a.aggregateId}`.localeCompare(`${b.tenantId}|${b.aggregateType}|${b.aggregateId}`));
    const auditRecords: AuditRecord[] = []; const outboxMessages: OutboxMessage[] = [];
    for (const item of ordered) {
      if (item.tenantId !== context.tenantId) throw new PersistenceFailure("Transaction and Aggregate Tenant differ");
      const aggregateKey = key(item.aggregateType, item.tenantId, item.aggregateId); const currentSnapshot = snapshots.get(aggregateKey); const currentEvents = events.get(aggregateKey) ?? [];
      if ((currentSnapshot?.aggregateVersion ?? 0) !== item.expectedVersion || (currentSnapshot?.eventSequence ?? 0) !== item.expectedEventSequence || (currentSnapshot?.snapshotVersion ?? 0) !== item.expectedSnapshotVersion) throw new PersistenceConflict("Persistent Aggregate concurrency check failed", { aggregateId: item.aggregateId });
      if (item.aggregate.version.value <= item.expectedVersion) throw new PersistenceFailure("Committed Aggregate must advance its Version", { aggregateId: item.aggregateId });
      const persistedEvents: PersistedEvent[] = []; let sequence = currentEvents.length;
      for (const event of item.events) { sequence += 1; persistedEvents.push({ eventId: event.eventId, aggregateType: item.aggregateType, aggregateId: item.aggregateId, tenantId: item.tenantId, aggregateVersion: event.version.value, eventSequence: sequence, transactionId: context.transactionId, transactionSequence, eventType: eventType(event), occurredAt: event.occurredAt, serializedEvent: clone(event.toJSON()) }); }
      events.set(aggregateKey, [...currentEvents, ...persistedEvents]);
      const snapshotJson = clone(item.snapshot); const snapshot: SnapshotRecord = deepFreeze({ aggregateType: item.aggregateType, aggregateId: item.aggregateId, tenantId: item.tenantId, aggregateVersion: item.aggregate.version.value, snapshotVersion: item.expectedSnapshotVersion + 1, eventSequence: sequence, checksum: deterministicHash(stableSerialize(snapshotJson)), snapshot: snapshotJson }); snapshots.set(aggregateKey, snapshot);
      auditRecords.push(deepFreeze({ auditId: `audit_${deterministicHash(`${context.transactionId}:${item.aggregateType}:${item.aggregateId}:${item.aggregate.version.value}`)}`, transactionId: context.transactionId, transactionSequence, aggregateType: item.aggregateType, aggregateId: item.aggregateId, aggregateVersion: item.aggregate.version.value, actor: context.actor, tenantId: item.tenantId, timestamp: context.startedAt, correlationId: context.correlationId, ...(context.causationId === undefined ? {} : { causationId: context.causationId }), evidence: persistedEvents.flatMap((event) => Array.isArray(event.serializedEvent.evidenceIds) ? event.serializedEvent.evidenceIds.map((id) => ({ evidenceId: String(id) })) : []), operation: persistedEvents[0]?.eventType ?? "AggregateMutation", result: "COMMITTED" }));
      for (const event of persistedEvents) { const original = item.events.find((candidate) => candidate.eventId === event.eventId); if (original !== undefined && this.projection.isEligible(original, item.aggregateType)) outboxMessages.push(deepFreeze({ messageId: `outbox_${deterministicHash(event.eventId)}`, revision: 1, aggregateType: item.aggregateType, aggregateId: item.aggregateId, tenantId: item.tenantId, eventType: event.eventType, eventVersion: event.aggregateVersion, payloadReference: this.projection.createPayloadReference({ tenantId: item.tenantId, aggregateType: item.aggregateType, aggregateId: item.aggregateId, eventSequence: event.eventSequence }), createdAt: event.occurredAt, status: "PENDING", transactionId: context.transactionId, transactionSequence, recordedAt: context.startedAt })); }
    }
    audits = [...audits, ...auditRecords]; outbox = [...outbox, ...outboxMessages];
    this.state = { snapshots, events, audits, outbox, outcomes: new Map(this.state.outcomes).set(context.transactionId, { fingerprint, transactionSequence }), nextTransactionSequence: transactionSequence };
    if (this.failNextAcknowledgment) { this.failNextAcknowledgment = false; for (const item of staged) this.markInvalid(item.aggregate); throw new PostCommitFailure("Commit confirmed but acknowledgment failed", { transactionId: context.transactionId }); }
    for (const item of staged) { try { item.aggregate.clearEvents(); } catch (error) { this.markInvalid(item.aggregate); throw new PostCommitFailure("Commit confirmed but event cleanup failed", { transactionId: context.transactionId, cause: String(error) }); } }
  }
  private freezeList<T>(values: readonly T[]): readonly T[] { return deepFreeze(clone(values)); }
}

class ReferenceUnitOfWork implements UnitOfWorkPort {
  private readonly staged = new Map<string, StagedAggregate>(); private state: "OPEN" | "COMMITTED" | "ROLLED_BACK" = "OPEN";
  public constructor(private readonly provider: ReferencePersistenceProvider, public readonly context: TransactionContext) {}
  public stage<TAggregate, TSnapshot>(aggregate: TAggregate & PersistableAggregate, codec: AggregateSnapshotCodec<TAggregate, TSnapshot>, expectedVersion: number): void {
    if (this.state !== "OPEN") throw new PersistenceFailure("Cannot stage after UnitOfWork completion"); if (this.provider.isInvalidated(aggregate)) throw new PersistenceFailure("Aggregate instance was invalidated after a post-commit failure");
    const aggregateType = codec.aggregateType; const aggregateId = codec.getAggregateId(aggregate); const tenantId = codec.getTenantId(aggregate); const aggregateKey = key(aggregateType, tenantId, aggregateId); if (this.staged.has(aggregateKey)) throw new PersistenceConflict("Aggregate is already staged in this UnitOfWork");
    const events = aggregate.domainEvents.map((event) => event); const currentEvents = this.provider.getEvents(aggregateType, tenantId, aggregateId); const currentSnapshot = this.provider.getSnapshot(`${aggregateType}|${tenantId}|${aggregateId}`);
    this.staged.set(aggregateKey, { aggregate, codec: codec as unknown as AggregateSnapshotCodec<unknown, unknown>, expectedVersion, aggregateType, aggregateId, tenantId, snapshot: clone(codec.toSnapshot(aggregate) as unknown as JsonObject), events, expectedEventSequence: currentEvents.length, expectedSnapshotVersion: currentSnapshot?.snapshotVersion ?? 0 });
  }
  public async commit(): Promise<void> { if (this.state === "COMMITTED") return; if (this.state === "ROLLED_BACK") throw new PersistenceFailure("UnitOfWork was rolled back"); const items = [...this.staged.values()]; const fingerprint = stableSerialize({ context: this.context.toJSON(), items: items.map((item) => ({ aggregateType: item.aggregateType, aggregateId: item.aggregateId, tenantId: item.tenantId, expectedVersion: item.expectedVersion, snapshot: item.snapshot, events: item.events.map((event) => event.toJSON()) })).sort((a, b) => `${a.tenantId}|${a.aggregateType}|${a.aggregateId}`.localeCompare(`${b.tenantId}|${b.aggregateType}|${b.aggregateId}`)) } as unknown as JsonObject); this.provider.applyCommit(this.context, items, fingerprint); this.state = "COMMITTED"; }
  public async rollback(): Promise<void> { if (this.state === "OPEN") this.state = "ROLLED_BACK"; }
}
