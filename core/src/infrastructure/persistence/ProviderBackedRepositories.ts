import { deterministicHash, stableSerialize } from "../../shared/common/serialization.js";
import { PersistenceFailure } from "../../shared/errors/PersistenceFailure.js";
import { Identity } from "../../shared/identity/Identity.js";
import { TenantId } from "../../shared/identity/TenantId.js";
import type { Version } from "../../shared/version/Version.js";
import type { AggregateSnapshotCodec } from "./PersistenceTypes.js";
import type { PersistenceProviderPort, UnitOfWorkPort, PersistableAggregate } from "./PersistencePorts.js";
import { TransactionContext } from "./TransactionContext.js";
import { Mission } from "../../modules/mission/domain/Mission.js";
import type { MissionSnapshot } from "../../modules/mission/domain/MissionSnapshot.js";
import type { MissionRepository } from "../../modules/mission/ports/MissionRepository.js";
import { Authority, type AuthoritySnapshot } from "../../modules/governance/domain/index.js";
import type { AuthorityRepository } from "../../modules/governance/ports/AuthorityRepository.js";
import { Decision, type DecisionSnapshot } from "../../modules/governance/domain/index.js";
import type { DecisionRepository } from "../../modules/governance/ports/DecisionRepository.js";
import { Agent, type AgentSnapshot, Execution } from "../../modules/ai-workforce/domain/index.js";
import type { ExecutionSnapshot } from "../../modules/ai-workforce/domain/Execution.js";
import type { AgentRepository } from "../../modules/ai-workforce/ports/AgentRepository.js";
import type { ExecutionRepository } from "../../modules/ai-workforce/ports/ExecutionRepository.js";
import { Asset, type AssetSnapshot } from "../../modules/institutional-assets/domain/index.js";
import type { AssetRepository } from "../../modules/institutional-assets/ports/AssetRepository.js";
import type { AssetUnitOfWorkPort } from "../../modules/institutional-assets/ports/AssetUnitOfWorkPort.js";
import { Knowledge, type KnowledgeSnapshot, Policy, type PolicySnapshot } from "../../modules/knowledge-policy/domain/index.js";
import type { KnowledgeRepository } from "../../modules/knowledge-policy/ports/KnowledgeRepository.js";
import type { PolicyRepository } from "../../modules/knowledge-policy/ports/PolicyRepository.js";
import { Workflow, type WorkflowSnapshot, WorkflowExecution, type WorkflowExecutionSnapshot } from "../../modules/workflow/domain/index.js";
import type { WorkflowRepository } from "../../modules/workflow/ports/WorkflowRepository.js";
import type { WorkflowExecutionRepository } from "../../modules/workflow/ports/WorkflowExecutionRepository.js";
import { Review, type ReviewSnapshot } from "../../modules/review/domain/index.js";
import type { ReviewRepository } from "../../modules/review/ports/ReviewRepository.js";
import { Publication, type PublicationSnapshot } from "../../modules/publication/domain/index.js";
import type { PublicationRepositoryPort } from "../../modules/publication/ports/PublicationRepositoryPort.js";
import { Connector, type ConnectorSnapshot, ConnectorExecution, type ConnectorExecutionSnapshot } from "../../modules/connector/domain/index.js";
import type { ConnectorRepository } from "../../modules/connector/ports/ConnectorRepository.js";
import type { ConnectorExecutionRepository } from "../../modules/connector/ports/ConnectorExecutionRepository.js";

export type RepositoryContextualizer<T> = T & { withContext(context: TransactionContext): T };

function snapshotKey(type: string, tenantId: string, id: string): string { return `${tenantId}|${type}|${id}`; }
function codec<T extends PersistableAggregate, S>(aggregateType: string, toSnapshot: (aggregate: T) => S, rehydrate: (snapshot: S) => T): AggregateSnapshotCodec<T, S> { return { aggregateType, getAggregateId: (aggregate) => aggregate.id.toString(), getTenantId: (aggregate) => { const candidate = aggregate as unknown as { tenantId: { toString(): string } }; return candidate.tenantId.toString(); }, getVersion: (aggregate) => aggregate.version.value, toSnapshot, rehydrate }; }

export class ProviderBackedRepository<TAggregate extends PersistableAggregate, TSnapshot> {
  public constructor(protected readonly provider: PersistenceProviderPort, protected readonly aggregateCodec: AggregateSnapshotCodec<TAggregate, TSnapshot>, protected readonly context?: TransactionContext, protected readonly activeUnitOfWork?: UnitOfWorkPort) {}
  public withContext(context: TransactionContext): ProviderBackedRepository<TAggregate, TSnapshot> { return new ProviderBackedRepository(this.provider, this.aggregateCodec, context, this.activeUnitOfWork); }
  public withUnitOfWork(unitOfWork: UnitOfWorkPort): ProviderBackedRepository<TAggregate, TSnapshot> { return new ProviderBackedRepository(this.provider, this.aggregateCodec, unitOfWork.context, unitOfWork); }
  public async save(aggregate: TAggregate, expectedVersion: Version): Promise<void> { const context = this.requireContext(); if (this.activeUnitOfWork !== undefined) { this.activeUnitOfWork.stage(aggregate, this.aggregateCodec, expectedVersion.value); return; } const uow = this.provider.begin(context); uow.stage(aggregate, this.aggregateCodec, expectedVersion.value); await uow.commit(); }
  public async findById(tenantId: TenantId, aggregateId: Identity): Promise<TAggregate | null> { const record = this.provider.getSnapshot(snapshotKey(this.aggregateCodec.aggregateType, tenantId.toString(), aggregateId.toString())); if (record === null) return null; if (record.tenantId !== tenantId.toString() || record.aggregateId !== aggregateId.toString() || record.aggregateType !== this.aggregateCodec.aggregateType) throw new PersistenceFailure("Persistent snapshot identity mismatch"); const expectedChecksum = deterministicHash(stableSerialize(record.snapshot)); if (record.checksum !== expectedChecksum) throw new PersistenceFailure("Persistent snapshot checksum is invalid"); const events = this.provider.getEvents(record.aggregateType, record.tenantId, record.aggregateId); if (record.eventSequence !== events.length) throw new PersistenceFailure("Persistent snapshot is not aligned with Event Store"); return this.aggregateCodec.rehydrate(structuredClone(record.snapshot) as TSnapshot); }
  public async exists(tenantId: TenantId, aggregateId: Identity): Promise<boolean> { return (await this.findById(tenantId, aggregateId)) !== null; }
  public async listByTenant(tenantId: TenantId): Promise<readonly TAggregate[]> { const records = this.provider.listSnapshots(this.aggregateCodec.aggregateType, tenantId.toString()); return Promise.all(records.map((record) => this.findById(tenantId, Identity.from(record.aggregateId)).then((aggregate) => { if (aggregate === null) throw new PersistenceFailure("Snapshot disappeared during list"); return aggregate; }))); }
  public stage(uow: UnitOfWorkPort, aggregate: TAggregate, expectedVersion: Version): void { uow.stage(aggregate, this.aggregateCodec, expectedVersion.value); }
  private requireContext(): TransactionContext { if (this.context === undefined) throw new PersistenceFailure("Provider-backed repository requires an explicit TransactionContext"); return this.context; }
}

const missionCodec = codec<Mission, MissionSnapshot>("Mission", (aggregate) => aggregate.toSnapshot(), (snapshot) => (Mission as unknown as { rehydrate(snapshot: MissionSnapshot): Mission }).rehydrate(snapshot));
const authorityCodec = codec<Authority, AuthoritySnapshot>("Authority", (aggregate) => aggregate.toSnapshot(), (snapshot) => Authority.rehydrate(snapshot));
const decisionCodec = codec<Decision, DecisionSnapshot>("Decision", (aggregate) => aggregate.toSnapshot(), (snapshot) => Decision.rehydrate(snapshot));
const agentCodec = codec<Agent, AgentSnapshot>("Agent", (aggregate) => aggregate.toSnapshot(), (snapshot) => Agent.rehydrate(snapshot));
const executionCodec = codec<Execution, ExecutionSnapshot>("Execution", (aggregate) => aggregate.toSnapshot(), (snapshot) => Execution.rehydrate(snapshot));
const assetCodec = codec<Asset, AssetSnapshot>("Asset", (aggregate) => aggregate.toSnapshot(), (snapshot) => Asset.rehydrate(snapshot));
const knowledgeCodec = codec<Knowledge, KnowledgeSnapshot>("Knowledge", (aggregate) => aggregate.toSnapshot(), (snapshot) => Knowledge.rehydrate(snapshot));
const policyCodec = codec<Policy, PolicySnapshot>("Policy", (aggregate) => aggregate.toSnapshot(), (snapshot) => Policy.rehydrate(snapshot));
const workflowCodec = codec<Workflow, WorkflowSnapshot>("Workflow", (aggregate) => aggregate.toSnapshot(), (snapshot) => Workflow.rehydrate(snapshot));
const workflowExecutionCodec = codec<WorkflowExecution, WorkflowExecutionSnapshot>("WorkflowExecution", (aggregate) => aggregate.toSnapshot(), (snapshot) => WorkflowExecution.rehydrate(snapshot));
const reviewCodec = codec<Review, ReviewSnapshot>("Review", (aggregate) => aggregate.toSnapshot(), (snapshot) => Review.rehydrate(snapshot));
const publicationCodec = codec<Publication, PublicationSnapshot>("Publication", (aggregate) => aggregate.toSnapshot(), (snapshot) => Publication.rehydrate(snapshot));
const connectorCodec = codec<Connector, ConnectorSnapshot>("Connector", (aggregate) => aggregate.toSnapshot(), (snapshot) => Connector.rehydrate(snapshot));
const connectorExecutionCodec = codec<ConnectorExecution, ConnectorExecutionSnapshot>("ConnectorExecution", (aggregate) => aggregate.toSnapshot(), (snapshot) => ConnectorExecution.rehydrate(snapshot));

export class ProviderBackedMissionRepository extends ProviderBackedRepository<Mission, MissionSnapshot> implements MissionRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, missionCodec, context); } }
export class ProviderBackedAuthorityRepository extends ProviderBackedRepository<Authority, AuthoritySnapshot> implements AuthorityRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, authorityCodec, context); } }
export class ProviderBackedDecisionRepository extends ProviderBackedRepository<Decision, DecisionSnapshot> implements DecisionRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, decisionCodec, context); } }
export class ProviderBackedAgentRepository extends ProviderBackedRepository<Agent, AgentSnapshot> implements AgentRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, agentCodec, context); } }
export class ProviderBackedExecutionRepository extends ProviderBackedRepository<Execution, ExecutionSnapshot> implements ExecutionRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, executionCodec, context); } }
export class ProviderBackedAssetRepository extends ProviderBackedRepository<Asset, AssetSnapshot> implements AssetRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, assetCodec, context); } }
export class ProviderBackedKnowledgeRepository extends ProviderBackedRepository<Knowledge, KnowledgeSnapshot> implements KnowledgeRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, knowledgeCodec, context); } }
export class ProviderBackedPolicyRepository extends ProviderBackedRepository<Policy, PolicySnapshot> implements PolicyRepository {
  public constructor(provider: PersistenceProviderPort, context?: TransactionContext, activeUnitOfWork?: UnitOfWorkPort) { super(provider, policyCodec, context, activeUnitOfWork); }
  public override withUnitOfWork(unitOfWork: UnitOfWorkPort): ProviderBackedPolicyRepository { return new ProviderBackedPolicyRepository(this.provider, unitOfWork.context, unitOfWork); }
  public async existsVersion(tenantId: TenantId, policyVersionId: Identity): Promise<boolean> {
    return this.provider.listSnapshots("Policy", tenantId.toString()).some((record) => {
      const versions = record.snapshot.versions as readonly { id?: string }[];
      return versions.some((version) => version.id === policyVersionId.toString());
    });
  }
}
export class ProviderBackedWorkflowRepository extends ProviderBackedRepository<Workflow, WorkflowSnapshot> implements WorkflowRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, workflowCodec, context); } }
export class ProviderBackedWorkflowExecutionRepository extends ProviderBackedRepository<WorkflowExecution, WorkflowExecutionSnapshot> implements WorkflowExecutionRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, workflowExecutionCodec, context); } }
export class ProviderBackedReviewRepository extends ProviderBackedRepository<Review, ReviewSnapshot> implements ReviewRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, reviewCodec, context); } }
export class ProviderBackedPublicationRepository extends ProviderBackedRepository<Publication, PublicationSnapshot> implements PublicationRepositoryPort { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, publicationCodec, context); } }
export class ProviderBackedConnectorRepository extends ProviderBackedRepository<Connector, ConnectorSnapshot> implements ConnectorRepository { public constructor(provider: PersistenceProviderPort, context?: TransactionContext) { super(provider, connectorCodec, context); } }
export class ProviderBackedConnectorExecutionRepository extends ProviderBackedRepository<ConnectorExecution, ConnectorExecutionSnapshot> implements ConnectorExecutionRepository {
  public constructor(provider: PersistenceProviderPort, context?: TransactionContext, activeUnitOfWork?: UnitOfWorkPort) { super(provider, connectorExecutionCodec, context, activeUnitOfWork); }
  public override withUnitOfWork(unitOfWork: UnitOfWorkPort): ProviderBackedConnectorExecutionRepository { return new ProviderBackedConnectorExecutionRepository(this.provider, unitOfWork.context, unitOfWork); }
  public async findByIdempotencyKey(tenantId: TenantId, connectorId: Identity, operationKey: string, idempotencyKey: string): Promise<ConnectorExecution | null> {
    const records = this.provider.listSnapshots("ConnectorExecution", tenantId.toString());
    for (const record of records) {
      const request = record.snapshot.request as { connectorReference?: { id?: string }; idempotencyKey?: string };
      if ((record.snapshot.connectorReference as { id?: string }).id === connectorId.toString() && record.snapshot.operationKey === operationKey && request.idempotencyKey === idempotencyKey) return this.findById(tenantId, Identity.from(record.aggregateId));
    }
    return null;
  }
}

export class ProviderBackedAssetUnitOfWork implements AssetUnitOfWorkPort {
  public constructor(private readonly provider: PersistenceProviderPort, private readonly context: TransactionContext) {}
  public async commitSupersession(previous: Asset, expectedPreviousVersion: Version, successor: Asset, expectedSuccessorVersion: Version): Promise<void> { const uow = this.provider.begin(this.context); uow.stage(previous, assetCodec, expectedPreviousVersion.value); uow.stage(successor, assetCodec, expectedSuccessorVersion.value); await uow.commit(); }
}

export function createProviderBackedRepositories(provider: PersistenceProviderPort, context: TransactionContext) { return { mission: new ProviderBackedMissionRepository(provider, context), authority: new ProviderBackedAuthorityRepository(provider, context), decision: new ProviderBackedDecisionRepository(provider, context), agent: new ProviderBackedAgentRepository(provider, context), execution: new ProviderBackedExecutionRepository(provider, context), asset: new ProviderBackedAssetRepository(provider, context), knowledge: new ProviderBackedKnowledgeRepository(provider, context), policy: new ProviderBackedPolicyRepository(provider, context), workflow: new ProviderBackedWorkflowRepository(provider, context), workflowExecution: new ProviderBackedWorkflowExecutionRepository(provider, context), review: new ProviderBackedReviewRepository(provider, context), publication: new ProviderBackedPublicationRepository(provider, context), connector: new ProviderBackedConnectorRepository(provider, context), connectorExecution: new ProviderBackedConnectorExecutionRepository(provider, context), assetUnitOfWork: new ProviderBackedAssetUnitOfWork(provider, context) }; }
