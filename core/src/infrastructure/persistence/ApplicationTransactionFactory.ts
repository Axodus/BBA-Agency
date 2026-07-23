import type { PersistenceProviderPort, PersistableAggregate, TransactionOutcome, UnitOfWorkPort } from "./PersistencePorts.js";
import { TransactionContext } from "./TransactionContext.js";
import { ProviderBackedAuthorityRepository, ProviderBackedDecisionRepository, ProviderBackedMissionRepository } from "./ProviderBackedRepositories.js";
import type { CommandTransaction, CommandTransactionFactory, ReadRepositorySession, ReadRepositorySessionFactory, TransactionalRepositorySession } from "../../application/services/TransactionalRepositorySession.js";
import type { QueryContext } from "../../application/dto/ApplicationContext.js";

class ReferenceCommandTransaction implements CommandTransaction {
  public readonly repositories: TransactionalRepositorySession;
  public constructor(private readonly provider: PersistenceProviderPort, private readonly uow: UnitOfWorkPort, context: TransactionContext) {
    const mission = new ProviderBackedMissionRepository(provider, context).withUnitOfWork(uow);
    const authority = new ProviderBackedAuthorityRepository(provider, context).withUnitOfWork(uow);
    const decision = new ProviderBackedDecisionRepository(provider, context).withUnitOfWork(uow);
    this.repositories = Object.freeze({ mission, authority, decision, context, stageAggregate: <TAggregate extends PersistableAggregate, TSnapshot>(aggregate: TAggregate, expectedVersion: number, codec: { readonly aggregateType: string; getAggregateId(value: TAggregate): string; getTenantId(value: TAggregate): string; getVersion(value: TAggregate): number; toSnapshot(value: TAggregate): TSnapshot; rehydrate(snapshot: TSnapshot): TAggregate }) => uow.stage(aggregate, codec, expectedVersion) }) as TransactionalRepositorySession;
  }
  public async commit(fingerprint: import("./PersistenceTypes.js").CanonicalPayloadDescriptor): Promise<void> { await this.uow.commit(fingerprint); }
  public async rollback(): Promise<void> { await this.uow.rollback(); }
  public outcome(): TransactionOutcome { return this.provider.getTransactionOutcome(this.uow.context.transactionId); }
  public committedFingerprint() { return this.provider.getTransactionFingerprint(this.uow.context.transactionId); }
}

export class ReferenceApplicationTransactionFactory implements CommandTransactionFactory {
  public constructor(private readonly provider: PersistenceProviderPort) {}
  public open(context: TransactionContext): CommandTransaction { const uow = this.provider.begin(context); return new ReferenceCommandTransaction(this.provider, uow, context); }
  public inspect(transactionId: string) { return { outcome: this.provider.getTransactionOutcome(transactionId), fingerprint: this.provider.getTransactionFingerprint(transactionId) }; }
}

export class ReferenceReadRepositorySessionFactory implements ReadRepositorySessionFactory {
  public constructor(private readonly provider: PersistenceProviderPort) {}
  public open(_context: QueryContext): ReadRepositorySession {
    return Object.freeze({
      mission: new ProviderBackedMissionRepository(this.provider),
      authority: new ProviderBackedAuthorityRepository(this.provider),
      decision: new ProviderBackedDecisionRepository(this.provider)
    });
  }
}
