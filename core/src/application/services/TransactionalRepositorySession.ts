import type { TransactionContext } from "../../infrastructure/persistence/TransactionContext.js";
import type { CanonicalPayloadDescriptor } from "../../infrastructure/persistence/PersistenceTypes.js";
import type { PersistableAggregate, TransactionOutcome, UnitOfWorkPort } from "../../infrastructure/persistence/PersistencePorts.js";
import type { MissionRepository } from "../../modules/mission/ports/MissionRepository.js";
import type { AuthorityRepository } from "../../modules/governance/ports/AuthorityRepository.js";
import type { DecisionRepository } from "../../modules/governance/ports/DecisionRepository.js";

export interface TransactionalRepositorySession {
  readonly mission: MissionRepository;
  readonly authority: AuthorityRepository;
  readonly decision: DecisionRepository;
  readonly context: TransactionContext;
  stageAggregate<TAggregate extends PersistableAggregate, TSnapshot>(aggregate: TAggregate, expectedVersion: number, codec: { readonly aggregateType: string; getAggregateId(value: TAggregate): string; getTenantId(value: TAggregate): string; getVersion(value: TAggregate): number; toSnapshot(value: TAggregate): TSnapshot; rehydrate(snapshot: TSnapshot): TAggregate }): void;
}

export interface ReadRepositorySession {
  readonly mission: Pick<MissionRepository, "findById" | "exists">;
  readonly authority: Pick<AuthorityRepository, "findById" | "exists">;
  readonly decision: Pick<DecisionRepository, "findById" | "exists">;
}

export interface CommandTransaction { readonly repositories: TransactionalRepositorySession; commit(fingerprint: CanonicalPayloadDescriptor): Promise<void>; rollback(): Promise<void>; outcome(): TransactionOutcome; committedFingerprint?(): CanonicalPayloadDescriptor | null; }
export interface CommandTransactionFactory { open(context: TransactionContext): CommandTransaction; inspect?(transactionId: string): { readonly outcome: TransactionOutcome; readonly fingerprint: CanonicalPayloadDescriptor | null }; }
export interface ReadRepositorySessionFactory { open(context: import("../dto/ApplicationContext.js").QueryContext): ReadRepositorySession; }

export function createTransactionalSession(uow: UnitOfWorkPort, repositories: TransactionalRepositorySession): TransactionalRepositorySession { return Object.freeze({ ...repositories, context: uow.context }); }
