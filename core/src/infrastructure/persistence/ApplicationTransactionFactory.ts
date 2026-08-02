import type { PersistenceProviderPort, PersistableAggregate, TransactionOutcome, UnitOfWorkPort } from "./PersistencePorts.js";
import { TransactionContext } from "./TransactionContext.js";
import { ProviderBackedAgentRepository, ProviderBackedAssetRepository, ProviderBackedAuthorityRepository, ProviderBackedConnectorExecutionRepository, ProviderBackedConnectorRepository, ProviderBackedDecisionRepository, ProviderBackedExecutionRepository, ProviderBackedKnowledgeRepository, ProviderBackedMissionRepository, ProviderBackedPolicyRepository, ProviderBackedPublicationRepository, ProviderBackedReviewRepository, ProviderBackedWorkflowExecutionRepository, ProviderBackedWorkflowRepository } from "./ProviderBackedRepositories.js";
import type { CommandTransaction, CommandTransactionFactory, ReadRepositorySession, ReadRepositorySessionFactory, TransactionalRepositorySession } from "../../application/services/TransactionalRepositorySession.js";
import type { QueryContext } from "../../application/dto/ApplicationContext.js";

class ReferenceCommandTransaction implements CommandTransaction {
  public readonly repositories: TransactionalRepositorySession;
  public constructor(private readonly provider: PersistenceProviderPort, private readonly uow: UnitOfWorkPort, context: TransactionContext) {
    const mission = new ProviderBackedMissionRepository(provider, context).withUnitOfWork(uow);
    const authority = new ProviderBackedAuthorityRepository(provider, context).withUnitOfWork(uow);
    const decision = new ProviderBackedDecisionRepository(provider, context).withUnitOfWork(uow);
    const agent = new ProviderBackedAgentRepository(provider, context).withUnitOfWork(uow);
    const execution = new ProviderBackedExecutionRepository(provider, context).withUnitOfWork(uow);
    const asset = new ProviderBackedAssetRepository(provider, context).withUnitOfWork(uow);
    const knowledge = new ProviderBackedKnowledgeRepository(provider, context).withUnitOfWork(uow); const policy = new ProviderBackedPolicyRepository(provider, context).withUnitOfWork(uow);
    const workflow = new ProviderBackedWorkflowRepository(provider, context).withUnitOfWork(uow); const workflowExecution = new ProviderBackedWorkflowExecutionRepository(provider, context).withUnitOfWork(uow);
    const review = new ProviderBackedReviewRepository(provider, context).withUnitOfWork(uow);
    const publication = new ProviderBackedPublicationRepository(provider, context).withUnitOfWork(uow);
    const connector = new ProviderBackedConnectorRepository(provider, context).withUnitOfWork(uow); const connectorExecution = new ProviderBackedConnectorExecutionRepository(provider, context).withUnitOfWork(uow);
    this.repositories = Object.freeze({ mission, authority, decision, agent, execution, asset, knowledge, policy, workflow, workflowExecution, review, publication, connector, connectorExecution, context, stageAggregate: <TAggregate extends PersistableAggregate, TSnapshot>(aggregate: TAggregate, expectedVersion: number, codec: { readonly aggregateType: string; getAggregateId(value: TAggregate): string; getTenantId(value: TAggregate): string; getVersion(value: TAggregate): number; toSnapshot(value: TAggregate): TSnapshot; rehydrate(snapshot: TSnapshot): TAggregate }) => uow.stage(aggregate, codec, expectedVersion) }) as unknown as TransactionalRepositorySession;
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
      decision: new ProviderBackedDecisionRepository(this.provider),
      agent: new ProviderBackedAgentRepository(this.provider),
      execution: new ProviderBackedExecutionRepository(this.provider),
      asset: new ProviderBackedAssetRepository(this.provider),
      knowledge: new ProviderBackedKnowledgeRepository(this.provider),
      policy: new ProviderBackedPolicyRepository(this.provider),
      workflow: new ProviderBackedWorkflowRepository(this.provider),
      workflowExecution: new ProviderBackedWorkflowExecutionRepository(this.provider),
      review: new ProviderBackedReviewRepository(this.provider),
      publication: new ProviderBackedPublicationRepository(this.provider),
      connector: new ProviderBackedConnectorRepository(this.provider),
      connectorExecution: new ProviderBackedConnectorExecutionRepository(this.provider)
    });
  }
}
