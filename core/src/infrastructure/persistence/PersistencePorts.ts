import type { DomainEvent } from "../../shared/events/DomainEvent.js";
import type { TransactionContext } from "./TransactionContext.js";
import type { AggregateSnapshotCodec, AuditRecord, CanonicalPayloadDescriptor, OutboxMessage, OutboxProjectionPort, PersistedEvent, SnapshotRecord } from "./PersistenceTypes.js";

export type TransactionOutcome = "NOT_FOUND" | "COMMITTED" | "FAILED_FINAL" | "UNKNOWN";
export interface SnapshotStorePort { getSnapshot(key: string): SnapshotRecord | null; listSnapshots(aggregateType: string, tenantId: string): readonly SnapshotRecord[]; }
export interface EventStorePort { getEvents(aggregateType: string, tenantId: string, aggregateId: string): readonly PersistedEvent[]; }
export interface AuditStorePort { listAuditRecords(tenantId: string): readonly AuditRecord[]; }
export interface OutboxStorePort { listOutboxMessages(tenantId: string): readonly OutboxMessage[]; }
export interface PersistableAggregate { readonly id: { toString(): string }; readonly version: { value: number }; readonly domainEvents: readonly DomainEvent[]; clearEvents(): void; }
export interface UnitOfWorkPort {
  readonly context: TransactionContext;
  stage<TAggregate, TSnapshot>(aggregate: TAggregate & PersistableAggregate, codec: AggregateSnapshotCodec<TAggregate, TSnapshot>, expectedVersion: number): void;
  commit(payloadFingerprint?: CanonicalPayloadDescriptor): Promise<void>;
  rollback(): Promise<void>;
}
export type UnitOfWork = UnitOfWorkPort;
export type SnapshotStore = SnapshotStorePort;
export type EventStore = EventStorePort;
export type AuditStore = AuditStorePort;
export type OutboxStore = OutboxStorePort;
export interface PersistenceProviderPort extends SnapshotStorePort, EventStorePort, AuditStorePort, OutboxStorePort {
  begin(context: TransactionContext): UnitOfWorkPort;
  getTransactionOutcome(transactionId: string): TransactionOutcome;
  getTransactionFingerprint(transactionId: string): CanonicalPayloadDescriptor | null;
  isInvalidated(aggregate: PersistableAggregate): boolean;
  withOutboxProjection(projection: OutboxProjectionPort): PersistenceProviderPort;
}
