import type { TransactionContext } from "../../infrastructure/persistence/TransactionContext.js";
import type { PersistableAggregate, TransactionOutcome, UnitOfWorkPort } from "../../infrastructure/persistence/PersistencePorts.js";
import type { MissionRepository } from "../../modules/mission/ports/MissionRepository.js";

export interface TransactionalRepositorySession {
  readonly mission: MissionRepository;
  readonly context: TransactionContext;
  stageAggregate<TAggregate extends PersistableAggregate, TSnapshot>(aggregate: TAggregate, expectedVersion: number, codec: { readonly aggregateType: string; getAggregateId(value: TAggregate): string; getTenantId(value: TAggregate): string; getVersion(value: TAggregate): number; toSnapshot(value: TAggregate): TSnapshot; rehydrate(snapshot: TSnapshot): TAggregate }): void;
}

export interface ReadRepositorySession { readonly mission: Pick<MissionRepository, "findById" | "exists">; }

export interface CommandTransaction { readonly repositories: TransactionalRepositorySession; commit(fingerprint: import("../../infrastructure/persistence/PersistenceTypes.js").CanonicalPayloadDescriptor): Promise<void>; rollback(): Promise<void>; outcome(): TransactionOutcome; }
export interface CommandTransactionFactory { open(context: TransactionContext): CommandTransaction; }
export interface ReadRepositorySessionFactory { open(context: import("../dto/ApplicationContext.js").QueryContext): ReadRepositorySession; }

export function createTransactionalSession(uow: UnitOfWorkPort, repositories: TransactionalRepositorySession): TransactionalRepositorySession { return Object.freeze({ ...repositories, context: uow.context }); }
