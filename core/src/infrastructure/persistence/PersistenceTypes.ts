import type { JsonObject } from "../../shared/common/serialization.js";
import type { DomainEvent } from "../../shared/events/DomainEvent.js";

export interface TransactionContextProps { readonly transactionId: string; readonly tenantId: string; readonly actor: string; readonly correlationId: string; readonly causationId?: string; readonly startedAt: string; }

export interface AggregateSnapshotCodec<TAggregate, TSnapshot> {
  readonly aggregateType: string;
  getAggregateId(aggregate: TAggregate): string;
  getTenantId(aggregate: TAggregate): string;
  getVersion(aggregate: TAggregate): number;
  toSnapshot(aggregate: TAggregate): TSnapshot;
  rehydrate(snapshot: TSnapshot): TAggregate;
}

export interface PersistedEvent { readonly eventId: string; readonly aggregateType: string; readonly aggregateId: string; readonly tenantId: string; readonly aggregateVersion: number; readonly eventSequence: number; readonly transactionId: string; readonly transactionSequence: number; readonly eventType: string; readonly occurredAt: string; readonly serializedEvent: JsonObject; }
export interface SnapshotRecord { readonly aggregateType: string; readonly aggregateId: string; readonly tenantId: string; readonly aggregateVersion: number; readonly snapshotVersion: number; readonly eventSequence: number; readonly checksum: string; readonly snapshot: JsonObject; }
export interface AuditRecord { readonly auditId: string; readonly transactionId: string; readonly transactionSequence: number; readonly aggregateType: string; readonly aggregateId: string; readonly aggregateVersion: number; readonly actor: string; readonly tenantId: string; readonly timestamp: string; readonly correlationId: string; readonly causationId?: string; readonly evidence: readonly JsonObject[]; readonly operation: string; readonly result: "COMMITTED"; }
export type OutboxStatus = "PENDING" | "DISPATCHED" | "FAILED";
export interface OutboxMessage { readonly messageId: string; readonly revision: number; readonly aggregateType: string; readonly aggregateId: string; readonly tenantId: string; readonly eventType: string; readonly eventVersion: number; readonly payloadReference: string; readonly createdAt: string; readonly status: OutboxStatus; readonly transactionId: string; readonly transactionSequence: number; readonly recordedAt: string; }
export interface OutboxProjectionPort { isEligible(event: DomainEvent, aggregateType: string): boolean; createPayloadReference(input: { readonly tenantId: string; readonly aggregateType: string; readonly aggregateId: string; readonly eventSequence: number }): string; }
