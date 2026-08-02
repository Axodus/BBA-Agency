export { TransactionContext } from "./TransactionContext.js";
export { TransactionScope, UnitOfWorkFactory } from "./TransactionScope.js";
export { ReferencePersistenceProvider } from "./ReferencePersistenceProvider.js";
export { RepositoryFactory } from "./RepositoryFactory.js";
export { ReferenceApplicationTransactionFactory } from "./ApplicationTransactionFactory.js";
export type { AuditStore, EventStore, OutboxStore, SnapshotStore, UnitOfWork } from "./PersistencePorts.js";
export type { AggregateSnapshotCodec, AuditRecord, CanonicalPayloadDescriptor, OutboxMessage, OutboxProjectionPort, OutboxStatus, PersistedEvent, SnapshotRecord, TransactionContextProps } from "./PersistenceTypes.js";
export type { AuditStorePort, EventStorePort, OutboxStorePort, PersistenceProviderPort, SnapshotStorePort, TransactionOutcome, UnitOfWorkPort } from "./PersistencePorts.js";
