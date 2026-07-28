# Implementation Traceability Matrix

REQ: `REQ-IMP-000-011`

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-000-001 | BBA-STD-001 | Repository evidence | `docs/development/repository-baseline.md` | M0 review | — | DONE |
| REQ-IMP-000-002 | BBA-POL-001 | Executable boundaries | `docs/development/repository-boundaries.md` | `core/test/architecture/core-isolation.test.ts` | ADR-IMP-0001 | DONE |
| REQ-IMP-000-003 | BBA-GDE-081 | Core isolation | `core/` | `core/test/smoke.test.ts` | ADR-IMP-0001/2 | DONE |
| REQ-IMP-000-004 | BBA-GDE-097 | Reproducible dependencies | `pnpm-workspace.yaml` | CI install | ADR-IMP-0002 | DONE |
| REQ-IMP-000-005 | BBA-GDE-079 | Directional dependency boundary | `core/tools/check-core-boundaries.mjs` | architecture test | ADR-IMP-0001 | DONE |
| REQ-IMP-000-006 | BBA-GDE-080 | Demo non-regression | `docs/development/demo-regression-contract.md` | demo syntax/data checks | — | DONE |
| REQ-IMP-000-007 | BBA-ADR-0001 | Documentation authority | `docs/development/source-index.md` | source availability review | — | DONE |
| REQ-IMP-000-008 | BBAPLT-DEV-001 | Development governance | `docs/development/development-constitution.md` | document review | — | DONE |
| REQ-IMP-000-009 | BBA-STD-002 | Readiness gate | `docs/development/definition-of-ready.md` | checklist review | — | DONE |
| REQ-IMP-000-010 | BBA-STD-002 | Completion evidence | `docs/development/definition-of-done.md` | M0 report | — | DONE |
| REQ-IMP-000-011 | BBA-STD-001 | Bidirectional traceability | this matrix | M0 report | — | DONE |
| REQ-IMP-000-012 | GDE-085 | Error and validation clarity | `docs/development/error-and-validation-taxonomy.md` | Core quality checks | — | DONE |
| REQ-IMP-000-013 | GDE-079 | ADR governance | `docs/adr/` | ADR review | — | DONE |
| REQ-IMP-000-014 | GDE-081 | Core boundary | `core/` | architecture test | ADR-IMP-0001 | DONE |
| REQ-IMP-000-015 | GDE-096/098 | Runtime and build boundary | `core/package.json`, `core/tsconfig.json` | typecheck/test | ADR-IMP-0002 | DONE |
| REQ-IMP-000-016 | ARCH-003 | Modular ownership | `core/` structure | architecture review | ADR-IMP-0003 | DONE |
| REQ-IMP-000-017 | GDE-081/082 | Directional adapters | M0 boundary policy | architecture review | ADR-IMP-0004 | DONE |
| REQ-IMP-000-018 | GDE-083 | Persistence deferred | constitution and ADR | future contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-000-019 | GDE-080/085 | Deterministic tests | `core/test/` | `node:test` | ADR-IMP-0006 | DONE |
| REQ-IMP-000-020 | GDE-080/098 | Quality commands | `core/package.json`, `core/tools/` | Core check | ADR-IMP-0006 | DONE |
| REQ-IMP-000-021 | GDE-098 | CI validation | `.github/workflows/core-foundation.yml` | GitHub Actions config | ADR-IMP-0002/6 | DONE |
| REQ-IMP-000-022 | BBA-STD-001/002 | M0 decision evidence | `docs/development/M0-REPOSITORY-READY-REPORT.md` | validation table | — | DONE |

`DONE` means the local artifact exists and its validation evidence is recorded
in the M0 report.

## EPIC-IMP-011 — Persistence and Auditability

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-011-001 | GDE-083 | Persistence boundary | `core/src/infrastructure/persistence/` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-002 | GDE-083 | Provider ports | `PersistencePorts.ts` | typecheck | ADR-IMP-0034 | DONE |
| REQ-IMP-011-003 | GDE-083 | Transaction context | `TransactionContext.ts` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-004 | GDE-083 | Snapshot codec | `PersistenceTypes.ts` | rehydration tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-005 | GDE-083 | Store contracts | `PersistencePorts.ts` | typecheck | ADR-IMP-0034/35/36 | DONE |
| REQ-IMP-011-006 | GDE-080 | Deterministic serialization | `ReferencePersistenceProvider.ts` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-007 | GDE-080 | Tenant propagation | `TransactionContext.ts` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-008 | GDE-085 | Persistence errors | `shared/errors/Persistence*.ts` | typecheck | ADR-IMP-0034 | DONE |
| REQ-IMP-011-009 | GDE-083 | Unit of Work | `ReferencePersistenceProvider.ts` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-010 | GDE-083 | Begin transaction | `PersistenceProviderPort.begin` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-011 | GDE-083 | Stage Aggregate | `ReferenceUnitOfWork.stage` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-012 | GDE-083 | Commit | `ReferenceUnitOfWork.commit` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-013 | GDE-083 | Rollback | `ReferenceUnitOfWork.rollback` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-014 | GDE-080 | Multi-Aggregate atomicity | `ReferencePersistenceProvider.applyCommit` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-015 | GDE-083 | Zero-event commit | `applyCommit` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-016 | GDE-080 | Event capture | `ReferenceUnitOfWork.stage` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-017 | GDE-080 | Post-commit cleanup | `applyCommit` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-018 | GDE-083 | Application scope | `UnitOfWorkFactory` | typecheck | ADR-IMP-0034 | DONE |
| REQ-IMP-011-019 | GDE-083 | Append-only Event Store | `ReferencePersistenceProvider` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-020 | GDE-083 | Event sequence | `PersistedEvent` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-021 | GDE-083 | Transaction sequence | `transactionSequence` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-022 | GDE-083 | Event ordering | `applyCommit` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-023 | GDE-083 | Event immutability | `getEvents` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-024 | GDE-083 | Aggregate version | `aggregateVersion` | persistence tests | ADR-IMP-0034/35 | DONE |
| REQ-IMP-011-025 | GDE-083 | Optimistic event concurrency | `applyCommit` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-026 | GDE-083 | Event Store query | `EventStorePort` | typecheck | ADR-IMP-0035 | DONE |
| REQ-IMP-011-027 | GDE-083 | Snapshot dependency | `ProviderBackedRepository.findById` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-028 | GDE-083 | Snapshot checksum | `SnapshotRecord.checksum` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-029 | GDE-083 | Snapshot version | `SnapshotRecord.snapshotVersion` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-030 | GDE-083 | Deterministic rehydration | `AggregateSnapshotCodec` | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-031 | GDE-083 | Audit Store | `AuditRecord` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-032 | GDE-083 | Audit identity | `AuditRecord.auditId` | typecheck | ADR-IMP-0036 | DONE |
| REQ-IMP-011-033 | GDE-083 | Audit transaction context | `AuditRecord` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-034 | GDE-083 | Audit actor | `AuditRecord.actor` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-035 | GDE-083 | Audit Tenant | `AuditRecord.tenantId` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-036 | GDE-083 | Audit version | `AuditRecord.aggregateVersion` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-037 | GDE-083 | Audit evidence | `AuditRecord.evidence` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-038 | GDE-083 | Committed result | `AuditRecord.result` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-039 | GDE-083 | Audit immutability | `listAuditRecords` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-040 | GDE-083 | Audit not reconstruction source | `AuditStorePort` | architecture tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-041 | GDE-083 | Outbox Store | `OutboxMessage` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-042 | GDE-083 | Eligible events only | `OutboxProjectionPort` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-043 | GDE-083 | Opaque payload reference | `createPayloadReference` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-044 | GDE-083 | Pending state | `OutboxStatus` | typecheck | ADR-IMP-0036 | DONE |
| REQ-IMP-011-045 | GDE-083 | Append-only revision shape | `OutboxMessage.revision` | typecheck | ADR-IMP-0036 | DONE |
| REQ-IMP-011-046 | GDE-083 | No dispatcher | persistence contracts | scope review | ADR-IMP-0036 | DONE |
| REQ-IMP-011-047 | GDE-083 | No retry | persistence contracts | scope review | ADR-IMP-0036 | DONE |
| REQ-IMP-011-048 | GDE-083 | No artificial events | `applyCommit` | persistence tests | ADR-IMP-0035/36 | DONE |
| REQ-IMP-011-049 | GDE-083 | No artificial outbox | `applyCommit` | persistence tests | ADR-IMP-0036 | DONE |
| REQ-IMP-011-050 | GDE-080 | Tenant-isolated stores | provider store queries | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-051 | GDE-083 | Persistent repository adapter | `ProviderBackedRepositories.ts` | typecheck | ADR-IMP-0034 | DONE |
| REQ-IMP-011-052 | GDE-083 | Repository factory | `createProviderBackedRepositories` | typecheck | ADR-IMP-0034 | DONE |
| REQ-IMP-011-053 | GDE-083 | Asset multi-Aggregate facade | `ProviderBackedAssetUnitOfWork` | persistence tests | ADR-IMP-0034 | DONE |
| REQ-IMP-011-054 | GDE-081 | Domain independence | `core/src/modules/**` | architecture test | ADR-IMP-0034 | DONE |
| REQ-IMP-011-055 | GDE-080 | Repository copy isolation | `findById`/store clones | persistence tests | ADR-IMP-0035 | DONE |
| REQ-IMP-011-056 | GDE-079 | Persistence documentation | `docs/development/contracts/` | document review | ADR-IMP-0034..36 | DONE |
| REQ-IMP-011-057 | GDE-079 | Persistence ADRs | `docs/adr/ADR-IMP-0034..36` | ADR review | ADR-IMP-0034..36 | DONE |
| REQ-IMP-011-058 | GDE-079 | Traceability | this matrix | report review | — | DONE |
| REQ-IMP-011-059 | GDE-080 | Core and demo evidence | M11 report | validation commands | — | DONE |
| REQ-IMP-011-060 | GDE-080 | M11 decision | M11 report | validation commands | ADR-IMP-0034 | DONE |

## EPIC-IMP-012 — Application API

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-012-001 | GDE-081 | Application structure | `core/src/application/` | typecheck | ADR-IMP-0037 | DONE |
| REQ-IMP-012-002 | GDE-081 | Commands | `application/dto/` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-003 | GDE-081 | Queries | `application/dto/` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-004 | GDE-081 | Neutral DTOs | `ApplicationContext.ts` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-005 | GDE-081 | Command contexts | `ApplicationCommandContext` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-006 | GDE-081 | Query contexts | `QueryContext` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-007 | GDE-081 | Typed context ports | `ApplicationApiPorts.ts` | typecheck | ADR-IMP-0037 | DONE |
| REQ-IMP-012-008 | GDE-081 | Mission API | `MissionApplicationApi` | `mission-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012-009 | Corrective M12 scope | Governance API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-010 | Corrective M12 scope | Workforce API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-011 | Corrective M12 scope | Assets API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-012 | Corrective M12 scope | Knowledge Policy API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-013 | Corrective M12 scope | Workflow API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-014 | Corrective M12 scope | Review API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-015 | Corrective M12 scope | Publication API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-016 | Corrective M12 scope | Connector API expansion | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-017 | GDE-081 | Request mappers | `ApplicationMappers.ts` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-018 | GDE-081 | Response mappers | `toAggregateDto` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-019 | GDE-080 | Validation before UoW | `ApplicationCommandRunner` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-020 | GDE-080 | Query validation | `ApplicationQueryRunner` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-021 | GDE-083 | Transaction runner | `ApplicationCommandRunner` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-022 | GDE-083 | Restricted transactional session | `TransactionalRepositorySession` | typecheck/architecture | ADR-IMP-0039 | DONE |
| REQ-IMP-012-023 | GDE-083 | Read-only session | `ReadRepositorySession` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-024 | GDE-083 | Commit after handler | command runner | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-025 | GDE-083 | Rollback after failure | command runner | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-026 | GDE-083 | Outcome-aware uncertainty | command transaction | typecheck | ADR-IMP-0039 | DONE |
| REQ-IMP-012-027 | GDE-080 | Transaction identity derivation | `deriveTransactionId` | API tests | ADR-IMP-0038 | DONE |
| REQ-IMP-012-028 | GDE-080 | Canonical fingerprint | `payloadFingerprint` | API tests | ADR-IMP-0038 | DONE |
| REQ-IMP-012-029 | GDE-080 | Reason included | runner canonical payload | API tests | ADR-IMP-0038 | DONE |
| REQ-IMP-012-030 | GDE-080 | Canonicalization version | `CanonicalPayloadDescriptor` | typecheck | ADR-IMP-0038 | DONE |
| REQ-IMP-012-031 | GDE-085 | Stable application errors | `ApplicationError` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-032 | GDE-085 | Concurrency mapping | `mapFailure` | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-033 | GDE-085 | Sanitized public errors | `ApplicationError.toJSON` | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-034 | GDE-081 | No HTTP/framework imports | application tree | architecture test | ADR-IMP-0037 | DONE |
| REQ-IMP-012-035 | GDE-081 | No ORM/database imports | application tree | architecture test | ADR-IMP-0037 | DONE |
| REQ-IMP-012-036 | GDE-081 | Aggregates unchanged | domain modules | regression suite | ADR-IMP-0039 | DONE |
| REQ-IMP-012-037 | Corrective M12 scope | Connector scope deferred | EPIC-IMP-012B backlog | document review | ADR-IMP-0037 | NOT_APPLICABLE |
| REQ-IMP-012-038 | GDE-083 | M11 compatibility | `ApplicationTransactionFactory` | typecheck | ADR-IMP-0039 | DONE |
| REQ-IMP-012-039 | GDE-080 | ID factory compatibility | application contracts | API tests | ADR-IMP-0038 | DONE |
| REQ-IMP-012-040 | GDE-080 | No generated-ID retry | outcome contract | document review | ADR-IMP-0038 | DONE |
| REQ-IMP-012-041 | GDE-081 | Commands do not expose Aggregates | DTO contracts | API tests | ADR-IMP-0037 | DONE |
| REQ-IMP-012-042 | GDE-081 | Queries do not mutate | query runner | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-043 | GDE-081 | No handler commit control | handler contract | typecheck | ADR-IMP-0039 | DONE |
| REQ-IMP-012-044 | GDE-081 | No handler provider access | handler contract | architecture review | ADR-IMP-0039 | DONE |
| REQ-IMP-012-045 | GDE-081 | No transport serializer | DTO contracts | architecture test | ADR-IMP-0037 | DONE |
| REQ-IMP-012-046 | GDE-081 | Exposed use case compatibility | Mission application use cases | regression and API suite | ADR-IMP-0039 | DONE |
| REQ-IMP-012-047 | GDE-080 | Tenant validation | context validation | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-048 | GDE-080 | Actor context | context validation | API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012-049 | GDE-080 | Correlation propagation | TransactionContext | typecheck | ADR-IMP-0039 | DONE |
| REQ-IMP-012-050 | GDE-080 | Causation propagation | TransactionContext | typecheck | ADR-IMP-0039 | DONE |
| REQ-IMP-012-051 | GDE-081 | Application barrels | `application/index.ts` | typecheck | ADR-IMP-0037 | DONE |
| REQ-IMP-012-052 | GDE-079 | API documentation | `contracts/ApplicationApi.md` | document review | ADR-IMP-0037 | DONE |
| REQ-IMP-012-053 | GDE-079 | Pipeline documentation | `contracts/ApplicationPipeline.md` | document review | ADR-IMP-0039 | DONE |
| REQ-IMP-012-054 | GDE-079 | Error documentation | `contracts/ApplicationErrors.md` | document review | ADR-IMP-0037 | DONE |
| REQ-IMP-012-055 | GDE-079 | Application ADRs | ADR-IMP-0037..39 | ADR review | ADR-IMP-0037..39 | DONE |
| REQ-IMP-012-056 | GDE-080 | Core validation | M12 report | validation commands | — | DONE |
| REQ-IMP-012-057 | GDE-080 | Demo preservation | M12 report | demo checks | — | DONE |
| REQ-IMP-012-058 | GDE-080 | Legacy preservation | M12 report | git status | — | DONE |
| REQ-IMP-012-059 | GDE-080 | Traceability | this matrix | report review | — | DONE |
| REQ-IMP-012-060 | GDE-080 | M12 decision | M12 report | validation commands | ADR-IMP-0037 | DONE |

## EPIC-IMP-012B.1 — Governance Application API

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- |
| REQ-IMP-012B.1-001 | GDE-081 | Typed Governance command surface | `GovernanceCommandApiPort` | `governance-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012B.1-002 | GDE-081 | Typed Governance query surface | `GovernanceQueryApiPort` | `GovernanceApplicationApi` | `governance-application-api.test.ts` | DONE |
| REQ-IMP-012B.1-003 | GDE-083 | Existing M11 repository composition | `ApplicationTransactionFactory` | application API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012B.1-004 | GDE-080 | Idempotent command replay | `GovernanceBindings` | governance application API tests | ADR-IMP-0038 | DONE |
| REQ-IMP-012B.1-005 | GDE-081 | Read-only Governance queries | `ReadRepositorySession` | governance application API tests | ADR-IMP-0039 | DONE |
| REQ-IMP-012B.1-006 | GDE-080 | No domain or transport expansion | `core/src/application/` | architecture and regression suites | ADR-IMP-0037 | DONE |

## EPIC-IMP-012B.2 — AI Workforce Application API

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-012B.2-001 | GDE-081 | Typed AI Workforce Command surface | `AIWorkforceCommandApiPort` | `ai-workforce-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012B.2-002 | GDE-081 | Typed AI Workforce Query surface | `AIWorkforceQueryApiPort` | `ai-workforce-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012B.2-003 | GDE-083 | Agent and Execution session composition | `ApplicationTransactionFactory` | `ai-workforce-application-api.test.ts` | ADR-IMP-0039 | DONE |
| REQ-IMP-012B.2-004 | GDE-080 | Generic committed replay | `ApplicationBindingRegistry` | `ai-workforce-application-api.test.ts` | ADR-IMP-0038 | DONE |
| REQ-IMP-012B.2-005 | GDE-081 | Read-only Workforce queries | `ReadRepositorySession` | `ai-workforce-application-api.test.ts` | ADR-IMP-0039 | DONE |
| REQ-IMP-012B.2-006 | GDE-080 | Atomic Agent and Execution start | `AIWorkforceBindings` | `ai-workforce-application-api.test.ts` | ADR-IMP-0039 | DONE |

## EPIC-IMP-012B.3 — Institutional Assets Application API

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-012B.3-001 | GDE-081 | Typed Asset command surface | `InstitutionalAssetsCommandApiPort` | `institutional-assets-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012B.3-002 | GDE-081 | Typed Asset query surface | `InstitutionalAssetsQueryApiPort` | `institutional-assets-application-api.test.ts` | ADR-IMP-0037 | DONE |
| REQ-IMP-012B.3-003 | GDE-080 | Generic Asset replay | `InstitutionalAssetsBindings` | `institutional-assets-application-api.test.ts` | ADR-IMP-0038 | DONE |
| REQ-IMP-012B.3-004 | GDE-081 | Read-only Asset projections | `ReadRepositorySession.asset` | `institutional-assets-application-api.test.ts` | ADR-IMP-0039 | DONE |
| REQ-IMP-012B.3-005 | GDE-081 | `assignAsset` blocked without use case | inventory and API contract | document review | ADR-IMP-0037 | BLOCKED |

## EPIC-IMP-010 — Connector Framework

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-010-001 | ARCH-003/GDE-081 | Connector module ownership | `core/src/modules/connector/` | connector tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-002 | GDE-076/082 | Connector identities | `shared/identity/Connector*.ts` | identity tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-003 | GDE-081 | Neutral references | `shared/references/Connector*Reference.ts` | identity tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-004 | GDE-081 | Public Connector namespace | `modules/index.ts` | typecheck | ADR-IMP-0031 | DONE |
| REQ-IMP-010-005 | GDE-080 | Technical metadata | `domain/ConnectorValues.ts` | metadata tests | ADR-IMP-0031/33 | DONE |
| REQ-IMP-010-006 | GDE-080 | Foundation tests | `connector.test.ts` | node:test | ADR-IMP-0031 | DONE |
| REQ-IMP-010-007 | GDE-045 | Connector Aggregate | `domain/Connector.ts` | lifecycle tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-008 | GDE-045 | Connector lifecycle | `ConnectorStatus` | lifecycle tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-009 | GDE-079 | Immutable capabilities | `ConnectorCapability` | capability tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-010 | GDE-049 | RegisterConnector | `Connector.create()` | application tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-011 | GDE-049 | Activate/Suspend | Connector use cases | lifecycle tests | ADR-IMP-0031/32 | DONE |
| REQ-IMP-010-012 | GDE-049 | RetireConnector | Connector use case | lifecycle tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-013 | GDE-080 | Lifecycle invariants | Connector domain | invalid transition tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-014 | GDE-045 | ConnectorExecution Aggregate | `domain/ConnectorExecution.ts` | execution tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-015 | GDE-045 | Execution lifecycle | `ConnectorExecutionStatus` | lifecycle tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-016 | GDE-079 | Request metadata | `ConnectorRequestMetadata` | metadata tests | ADR-IMP-0031/33 | DONE |
| REQ-IMP-010-017 | GDE-079 | Result metadata | `ConnectorResultMetadata` | result tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-018 | GDE-079 | External evidence | `ExternalEvidenceSuccess/Failure` | evidence tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-019 | GDE-079 | Terminal immutability | execution domain | terminal tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-020 | GDE-080 | Tenant boundaries | Connector/Execution | Tenant tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-021 | GDE-080 | Capability compatibility | `createExecution` | compatibility tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-022 | GDE-080 | Idempotent execution request | execution repository | idempotency tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-023 | GDE-081 | Connector Application use cases | `ConnectorUseCases.ts` | application tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-024 | GDE-081 | Transport port | `ConnectorTransportPort.ts` | port tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-025 | GDE-081 | Execution request port | `ConnectorExecutionRequestPort.ts` | architecture tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-026 | GDE-081 | Observation delivery port | `ConnectorObservationDeliveryPort.ts` | application tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-027 | GDE-081 | Configuration port | `ConnectorConfigurationPort.ts` | typecheck | ADR-IMP-0031 | DONE |
| REQ-IMP-010-028 | GDE-081 | Audit port | `ConnectorAuditPort.ts` | typecheck | ADR-IMP-0033 | DONE |
| REQ-IMP-010-029 | GDE-081 | No external Aggregate access | neutral DTOs | architecture tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-030 | GDE-080 | Application ordering | `executeTransport` | ordering tests | ADR-IMP-0032/33 | DONE |
| REQ-IMP-010-031 | GDE-085 | Visible post-save failure | observation delivery contract | application tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-032 | GDE-083 | Connector repository | `ConnectorRepository.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-010-033 | GDE-083 | Execution repository | `ConnectorExecutionRepository.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-010-034 | GDE-083 | In-memory Connector adapter | `InMemoryConnectorRepository.ts` | contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-010-035 | GDE-083 | In-memory Execution adapter | `InMemoryConnectorExecutionRepository.ts` | contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-010-036 | GDE-083 | Optimistic concurrency | repository save | concurrency tests | ADR-IMP-0005 | DONE |
| REQ-IMP-010-037 | GDE-083 | Deep-frozen snapshots | `toSnapshot()` | snapshot tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-038 | GDE-083 | Deterministic serialization | `serialize()` | serialization tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-039 | GDE-083 | Deterministic rehydration | `rehydrate()` | reconstruction tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-040 | GDE-083 | Idempotency lookup | `findByIdempotencyKey()` | idempotency tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-041 | ARCH-025 | ConnectorRegistered/Activated | `ConnectorEvents.ts` | event tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-042 | ARCH-025 | ConnectorSuspended/Retired | `ConnectorEvents.ts` | event tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-043 | ARCH-025 | ExecutionCreated/Started | `ConnectorEvents.ts` | event tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-044 | ARCH-025 | ExecutionSucceeded | `ConnectorEvents.ts` | evidence tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-045 | ARCH-025 | ExecutionFailed | `ConnectorEvents.ts` | failure tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-046 | ARCH-025 | ExecutionCancelled | `ConnectorEvents.ts` | cancellation tests | ADR-IMP-0032 | DONE |
| REQ-IMP-010-047 | ARCH-025 | Full audit metadata | Connector events | event tests | ADR-IMP-0033 | DONE |
| REQ-IMP-010-048 | GDE-079 | Connector contracts | `contracts/Connector*.md` | document review | ADR-IMP-0031..33 | DONE |
| REQ-IMP-010-049 | GDE-079 | Technical boundary ADR | ADR-IMP-0031 | ADR review | ADR-IMP-0031 | DONE |
| REQ-IMP-010-050 | GDE-079 | Execution model ADR | ADR-IMP-0032 | ADR review | ADR-IMP-0032 | DONE |
| REQ-IMP-010-051 | GDE-079 | Evidence ownership ADR | ADR-IMP-0033 | ADR review | ADR-IMP-0033 | DONE |
| REQ-IMP-010-052 | ARCH-003 | Bounded context map | `BOUNDED-CONTEXT-MAP.md` | architecture tests | ADR-IMP-0031 | DONE |
| REQ-IMP-010-053 | GDE-079 | Traceability update | this matrix | M10 report | ADR-IMP-0031 | DONE |
| REQ-IMP-010-054 | GDE-081/082 | Public API and isolation | barrels / matrix test | typecheck/architecture | ADR-IMP-0031 | DONE |
| REQ-IMP-010-055 | GDE-080 | M10 completion evidence | `EPIC-IMP-010-CONNECTOR-REPORT.md` | Core/demo checks | — | DONE |

## EPIC-IMP-003 — Human Governance

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-003-001 | GDE-041 | Governance module ownership | `core/src/modules/governance/` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-002 | GDE-043 | Authority Aggregate | `domain/Authority.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-003 | GDE-045 | Decision Aggregate | `domain/Decision.ts` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-004 | GDE-045 | Approval Entity | `domain/Approval.ts` | governance test | — | DONE |
| REQ-IMP-003-005 | GDE-046 | Assignment reference | `shared/references/AssignmentReference.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-006 | GDE-080 | Valid Aggregate creation | governance domain | governance test | — | DONE |
| REQ-IMP-003-007 | ARCH-018 | Authority identity | `shared/identity/AuthorityId.ts` | identity/governance tests | — | DONE |
| REQ-IMP-003-008 | GDE-043 | Authority level | `domain/AuthorityLevel.ts` | governance test | — | DONE |
| REQ-IMP-003-009 | GDE-043 | Authority scope | `domain/AuthorityScope.ts` | governance test | — | DONE |
| REQ-IMP-003-010 | GDE-048 | Authority lifecycle status | `domain/AuthorityStatus.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-011 | GDE-048 | Protected lifecycle commands | `domain/Authority.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-012 | GDE-080 | Lifecycle validation | Authority domain | governance test | — | DONE |
| REQ-IMP-003-013 | GDE-046 | Assignment ownership | `domain/Assignment.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-014 | GDE-046 | Assignment status | `domain/AssignmentStatus.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-015 | GDE-046 | Temporal delegation | `domain/AssignmentPeriod.ts` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-016 | GDE-046 | Grant authority | `Authority.assign()` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-017 | GDE-046 | Revoke assignment | `Authority.revokeAssignment()` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-018 | GDE-046 | Expire assignment | `Authority.expireAssignment()` | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-019 | GDE-046 | Overlap and invalid delegation rejection | Authority domain | governance test | ADR-IMP-0011 | DONE |
| REQ-IMP-003-020 | GDE-045 | Decision type | `domain/DecisionType.ts` | governance test | — | DONE |
| REQ-IMP-003-021 | GDE-045 | Decision status | `domain/DecisionStatus.ts` | governance test | — | DONE |
| REQ-IMP-003-022 | GDE-045 | Create Decision | `Decision.create()` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-023 | GDE-045 | Approve Decision | `Decision.approve()` | governance test | — | DONE |
| REQ-IMP-003-024 | GDE-045 | Reject Decision | `Decision.reject()` | governance test | — | DONE |
| REQ-IMP-003-025 | GDE-045 | Finalize Decision | `Decision.finalize()` | governance test | — | DONE |
| REQ-IMP-003-026 | GDE-045 | Approval outcome | `domain/ApprovalOutcome.ts` | governance test | — | DONE |
| REQ-IMP-003-027 | GDE-045 | Decision validation | Decision domain | governance test | — | DONE |
| REQ-IMP-003-028 | GDE-043 | Authority reference | `shared/references/AuthorityReference.ts` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-029 | GDE-045 | Decision reference | `shared/references/DecisionReference.ts` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-030 | GDE-045 | Approval reference | `shared/references/ApprovalReference.ts` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-031 | GDE-050 | Governance policy boundary | Governance README/contract | architecture test | — | DONE |
| REQ-IMP-003-032 | GDE-049 | Authorized Mission command | `GovernanceAuthorizationPort.ts` | coordinator test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-033 | GDE-051 | Same-Tenant Decision | `DecisionAuthorizationService.ts` | governance test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-034 | GDE-081 | Mission/Governance integration boundary | Application ports/coordinator | coordinator test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-035 | GDE-081 | Authority repository port | `ports/AuthorityRepository.ts` | repository test | ADR-IMP-0004 | DONE |
| REQ-IMP-003-036 | GDE-081 | Decision repository port | `ports/DecisionRepository.ts` | repository test | ADR-IMP-0004 | DONE |
| REQ-IMP-003-037 | GDE-083 | In-memory Authority repository | `InMemoryAuthorityRepository.ts` | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-003-038 | GDE-083 | In-memory Decision repository | `InMemoryDecisionRepository.ts` | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-003-039 | GDE-082 | Application use cases | `governance/application/` | governance test | ADR-IMP-0004 | DONE |
| REQ-IMP-003-040 | GDE-083 | Repository contracts | governance repositories | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-003-041 | ARCH-025 | AuthorityCreated | `GovernanceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-003-042 | ARCH-025 | AssignmentGranted | `GovernanceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-003-043 | ARCH-025 | DecisionCreated | `GovernanceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-003-044 | ARCH-025 | DecisionApproved | `GovernanceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-003-045 | ARCH-025 | DecisionRejected | `GovernanceEvents.ts` | Decision tests | — | DONE |
| REQ-IMP-003-046 | ARCH-025 | DecisionFinalized | `GovernanceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-003-047 | ARCH-025 | Governance audit metadata | `GovernanceAuditMetadata.ts` | serialization test | — | DONE |
| REQ-IMP-003-048 | ARCH-025 | Tenant/Version/Evidence/Correlation/Causation | Governance events | governance test | — | DONE |
| REQ-IMP-003-049 | GDE-041 | Governance contract | `contracts/GovernanceAggregate.md` | document review | ADR-IMP-0010 | DONE |
| REQ-IMP-003-050 | GDE-045 | Decision contract | `contracts/DecisionAggregate.md` | document review | ADR-IMP-0010 | DONE |
| REQ-IMP-003-051 | GDE-043 | Authority contract | `contracts/AuthorityAggregate.md` | document review | ADR-IMP-0011 | DONE |
| REQ-IMP-003-052 | GDE-081 | Forbidden context dependencies | bounded context matrix | architecture test | ADR-IMP-0010 | DONE |
| REQ-IMP-003-053 | GDE-079 | Traceability update | this matrix | `M3-HUMAN-GOVERNANCE-READY-REPORT.md` | — | DONE |
| REQ-IMP-003-054 | GDE-079 | Public API review | governance barrels/README | typecheck | — | DONE |
| REQ-IMP-003-055 | GDE-080 | Epic completion evidence | `M3-HUMAN-GOVERNANCE-READY-REPORT.md` | Core check | — | DONE |

## EPIC-IMP-001 — Shared Kernel and Tenant Context

| Requirement | Source document | Invariant / responsibility | Code path | Test path | Status |
| --- | --- | --- | --- | --- | --- |
| REQ-IMP-001-001 | GDE-076, GDE-080 | Shared Kernel ownership | `core/src/shared/README.md` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-002 | GDE-080 | Immutable ValueObject base | `core/src/shared/valueobject/ValueObject.ts` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-003 | GDE-080 | Identity-based Entity base | `core/src/shared/entity/Entity.ts` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-004 | GDE-080 | Aggregate version and events | `core/src/shared/aggregate/AggregateRoot.ts` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-005 | ARCH-025 | Domain event evidence | `core/src/shared/events/DomainEvent.ts` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-006 | GDE-085 | Stable domain error taxonomy | `core/src/shared/errors/` | `shared-kernel.test.ts` | DONE |
| REQ-IMP-001-007 | ARCH-018 | Canonical opaque identity | `core/src/shared/identity/Identity.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-008 | ARCH-018 | Tenant identity | `core/src/shared/identity/TenantId.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-009 | ARCH-018 | Mission identity reserved for future context | `core/src/shared/identity/MissionId.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-010 | ARCH-018 | Asset identity reserved for future context | `core/src/shared/identity/AssetId.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-011 | ARCH-018 | Workforce, decision, evidence and connector identities | `core/src/shared/identity/{Agent,Assignment,Decision,Evidence,Connector}Id.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-012 | GDE-085 | Deterministic identity factory | `core/src/shared/identity/IdentityFactory.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-013 | GDE-080 | Identity equality and validation | `core/test/shared/identity.test.ts` | `identity.test.ts` | DONE |
| REQ-IMP-001-014 | ARCH-024 | Tenant context | `core/src/shared/tenant/TenantContext.ts` | `tenant.test.ts` | DONE |
| REQ-IMP-001-015 | ARCH-024 | Cross-Tenant rejection | `core/src/shared/tenant/tenantRules.ts` | `tenant.test.ts` | DONE |
| REQ-IMP-001-016 | GDE-082 | Infrastructure-free context provider | `core/src/shared/tenant/TenantContextProvider.ts` | `tenant.test.ts` | DONE |
| REQ-IMP-001-017 | GDE-082 | Current Tenant port | `core/src/shared/tenant/CurrentTenantPort.ts` | `tenant.test.ts` | DONE |
| REQ-IMP-001-018 | ARCH-024 | Tenant switching and isolation tests | `core/test/shared/tenant.test.ts` | `tenant.test.ts` | DONE |
| REQ-IMP-001-019 | GDE-082 | Clock port | `core/src/shared/time/Clock.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-020 | GDE-085 | System and deterministic clocks | `core/src/shared/time/{SystemClock,FakeClock}.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-021 | ARCH-022 | Immutable version semantics | `core/src/shared/version/Version.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-022 | ARCH-025 | Correlation and causation identifiers | `core/src/shared/common/{CorrelationId,CausationId}.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-023 | ARCH-022 | Evidence reference | `core/src/shared/evidence/EvidenceReference.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-024 | ARCH-022 | Directional lineage reference | `core/src/shared/lineage/LineageReference.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-025 | ARCH-025 | Audit metadata | `core/src/shared/common/AuditMetadata.ts` | `temporal-evidence.test.ts` | DONE |
| REQ-IMP-001-026 | GDE-080, GDE-085 | Shared foundation contract tests | `core/test/shared/` | all shared tests | DONE |

## EPIC-IMP-002 — Mission Core

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-002-001 | GDE-011, GDE-082 | Mission module ownership | `core/src/modules/mission/` | Mission architecture tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-002 | BBA-ADR-0002, GDE-011 | Central Aggregate Root | `core/src/modules/mission/domain/Mission.ts` | `core/test/modules/mission/mission-domain.test.ts` | ADR-IMP-0008 | DONE |
| REQ-IMP-002-003 | GDE-013 | Canonical Mission status | `core/src/modules/mission/domain/MissionStatus.ts` | lifecycle tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-004 | GDE-011, GDE-014 | Mission metadata | `core/src/modules/mission/domain/MissionMetadata.ts` | creation tests | — | DONE |
| REQ-IMP-002-005 | GDE-012, GDE-013 | Protected lifecycle | `core/src/modules/mission/domain/MissionLifecycle.ts` | lifecycle tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-006 | GDE-080, GDE-082 | Complete creation | `core/src/modules/mission/domain/Mission.ts` | `core/test/modules/mission/mission-domain.test.ts` | — | DONE |
| REQ-IMP-002-007 | GDE-011, GDE-013 | Create Mission in PROPOSED | `core/src/modules/mission/domain/Mission.ts` | domain/application tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-008 | GDE-014 | Rename through Aggregate | `core/src/modules/mission/domain/Mission.ts` | command/application tests | — | DONE |
| REQ-IMP-002-009 | GDE-014 | Description change through Aggregate | `core/src/modules/mission/domain/Mission.ts` | command tests | — | DONE |
| REQ-IMP-002-010 | GDE-013 | Activate only from PREPARED | `core/src/modules/mission/domain/Mission.ts` | lifecycle/application tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-011 | GDE-012, GDE-013 | Pause with accountable reason | `core/src/modules/mission/domain/Mission.ts` | command tests | — | DONE |
| REQ-IMP-002-012 | GDE-013 | Explicit resume target | `core/src/modules/mission/domain/Mission.ts` | command tests | — | DONE |
| REQ-IMP-002-013 | GDE-013, GDE-014 | Closure with learning | `core/src/modules/mission/domain/Mission.ts` | command/application tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-014 | GDE-013 | Cancel mapped to STOPPED | `core/src/modules/mission/domain/Mission.ts` | command tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-015 | ARCH-020 | Archive preserves terminal status | `core/src/modules/mission/domain/Mission.ts` | command tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-016 | GDE-080 | Command validation | `core/test/modules/mission/` | command/domain tests | — | DONE |
| REQ-IMP-002-017 | GDE-014, GDE-016 | Identity, Tenant, metadata, Version, status | `core/src/modules/mission/domain/Mission.ts` | domain/evidence tests | — | DONE |
| REQ-IMP-002-018 | ARCH-025 | MissionCreated | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | — | DONE |
| REQ-IMP-002-019 | ARCH-025 | MissionRenamed | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | — | DONE |
| REQ-IMP-002-020 | GDE-013, ARCH-025 | MissionActivated | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | — | DONE |
| REQ-IMP-002-021 | GDE-013, ARCH-025 | MissionPaused | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | — | DONE |
| REQ-IMP-002-022 | GDE-014, ARCH-025 | MissionCompleted | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | — | DONE |
| REQ-IMP-002-023 | GDE-013, ARCH-025 | MissionCancelled | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-024 | ARCH-020, ARCH-025 | MissionArchived | `core/src/modules/mission/domain/MissionEvents.ts` | event tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-025 | GDE-080, ARCH-025 | Ordered versioned events | `core/src/modules/mission/domain/MissionEvents.ts` | `core/test/modules/mission/mission-commands-events.test.ts` | — | DONE |
| REQ-IMP-002-026 | ARCH-022, GDE-083 | Mission Version | `core/src/modules/mission/domain/Mission.ts` | version tests | — | DONE |
| REQ-IMP-002-027 | GDE-082, GDE-085 | One increment per mutation | `core/src/modules/mission/domain/Mission.ts` | version/event tests | — | DONE |
| REQ-IMP-002-028 | ARCH-022, ARCH-025 | Evidence preservation | `core/src/modules/mission/domain/Mission.ts` | evidence tests | — | DONE |
| REQ-IMP-002-029 | ARCH-022 | Lineage preservation | `core/src/modules/mission/domain/Mission.ts` | lineage tests | — | DONE |
| REQ-IMP-002-030 | GDE-083, GDE-085 | Optimistic Version check | `core/src/modules/mission/infrastructure/InMemoryMissionRepository.ts` | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-031 | GDE-080, GDE-083 | Stale-write rejection | in-memory adapter | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-032 | GDE-081, GDE-083 | Consumer-owned repository port | `core/src/modules/mission/ports/MissionRepository.ts` | repository contract | ADR-IMP-0004/5 | DONE |
| REQ-IMP-002-033 | GDE-083 | In-memory reference adapter | `core/src/modules/mission/infrastructure/InMemoryMissionRepository.ts` | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-034 | GDE-083 | Optimistic save | in-memory adapter | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-035 | GDE-083, ARCH-024 | Tenant-scoped findById | in-memory adapter | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-036 | GDE-083, ARCH-024 | Tenant-scoped exists | in-memory adapter | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-002-037 | GDE-081, GDE-082 | Application use cases | `core/src/modules/mission/application/` | `core/test/modules/mission/mission-application.test.ts` | ADR-IMP-0004 | DONE |
| REQ-IMP-002-038 | GDE-080, GDE-083 | Repository parity contract | in-memory adapter and port | `mission-repository-contract.test.ts` | ADR-IMP-0005 | DONE |
| REQ-IMP-002-039 | ARCH-018, ARCH-022 | Versioned MissionSnapshot | `core/src/modules/mission/domain/MissionSnapshot.ts` | serialization tests | — | DONE |
| REQ-IMP-002-040 | GDE-083 | Complete rehydration | `core/src/modules/mission/domain/MissionRehydration.ts` | serialization/repository tests | — | DONE |
| REQ-IMP-002-041 | ARCH-022, GDE-085 | Deterministic serialization | `core/src/modules/mission/domain/MissionSnapshot.ts` | serialization tests | — | DONE |
| REQ-IMP-002-042 | GDE-080 | Lossless reconstruction | Mission rehydration | `mission-serialization.test.ts` | — | DONE |
| REQ-IMP-002-043 | GDE-083, GDE-085 | Snapshot compatibility refusal | Mission snapshot parser | `mission-serialization.test.ts` | — | DONE |
| REQ-IMP-002-044 | GDE-079, GDE-082 | Explicit public API | Mission barrels and READMEs | architecture tests | ADR-IMP-0008 | DONE |
| REQ-IMP-002-045 | GDE-081, GDE-082 | Context and infrastructure isolation | Mission source boundaries | `mission-boundaries.test.ts` | ADR-IMP-0003/4 | DONE |

## EPIC-IMP-004 — AI Workforce

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-004-001 | GDE-029 | AI Workforce module ownership | `core/src/modules/ai-workforce/` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-002 | GDE-030 | Agent Aggregate | `domain/Agent.ts` | workforce test | ADR-IMP-0014/15 | DONE |
| REQ-IMP-004-003 | GDE-035 | Execution Aggregate | `domain/Execution.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-004 | GDE-032 | Operational WorkAssignment Entity | `domain/WorkAssignment.ts` | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-005 | GDE-031 | Capability Value Object | `domain/Capability.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-006 | GDE-080 | Valid Aggregate creation | workforce domain | workforce test | — | DONE |
| REQ-IMP-004-007 | ARCH-018 | Agent identity | `shared/identity/AgentId.ts` | identity/workforce tests | — | DONE |
| REQ-IMP-004-008 | GDE-035 | Lifecycle and availability status | `domain/AgentStatus.ts` | workforce test | ADR-IMP-0014 | DONE |
| REQ-IMP-004-009 | GDE-031 | Immutable CapabilitySet | `domain/Capability.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-010 | GDE-034 | Provision Agent | `Agent.provision()` | workforce test | ADR-IMP-0014 | DONE |
| REQ-IMP-004-011 | GDE-034/035 | Protected Agent lifecycle | `Agent.activate/pause/resume/retire()` | workforce test | ADR-IMP-0014 | DONE |
| REQ-IMP-004-012 | GDE-080 | Lifecycle validation | Agent domain | workforce test | — | DONE |
| REQ-IMP-004-013 | GDE-032 | Operational WorkAssignment identity | `shared/identity/WorkAssignmentId.ts` | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-014 | GDE-035 | Assignment execution states | `domain/AssignmentStatus.ts` | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-015 | GDE-032/038 | Assign Agent | `Agent.assign()` | workforce/coordinator tests | ADR-IMP-0013 | DONE |
| REQ-IMP-004-016 | GDE-035 | Cancel assignment transition | `WorkAssignment.cancel()` | domain tests | ADR-IMP-0013 | DONE |
| REQ-IMP-004-017 | GDE-035 | Complete assignment transition | `WorkAssignment.complete()` | domain tests | ADR-IMP-0013 | DONE |
| REQ-IMP-004-018 | GDE-038 | Assignment policy | `domain/AssignmentPolicy.ts` | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-019 | GDE-036 | Incompatible assignment prevention | Agent assignment guard | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-020 | GDE-035 | Execution status | `domain/ExecutionStatus.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-021 | GDE-035 | Start execution | `Execution.start()` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-022 | GDE-037 | Complete execution | `Execution.complete()` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-023 | GDE-035 | Fail execution | `Execution.fail()` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-024 | GDE-035 | Cancel execution | `Execution.cancel()` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-025 | GDE-033/037 | Structured ExecutionResult | `domain/ExecutionResult.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-026 | GDE-080 | Execution validation | Execution domain | workforce test | — | DONE |
| REQ-IMP-004-027 | ARCH-018 | AgentReference | `shared/references/AgentReference.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-028 | ARCH-022 | ExecutionReference | `shared/references/ExecutionReference.ts` | serialization tests | ADR-IMP-0015 | DONE |
| REQ-IMP-004-029 | ARCH-022 | WorkAssignmentReference | `shared/references/WorkAssignmentReference.ts` | workforce test | ADR-IMP-0013 | DONE |
| REQ-IMP-004-030 | GDE-036 | Application coordinator | `application/AIWorkCoordinator.ts` | coordinator test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-031 | GDE-038/040 | Execution policy boundary | `domain/AssignmentPolicy.ts` | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-032 | ARCH-015/024 | Mission/Governance/Tenant references | neutral refs and port | coordinator/architecture tests | ADR-IMP-0013/15 | DONE |
| REQ-IMP-004-033 | GDE-081 | Integration boundary tests | Application ports | coordinator test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-034 | GDE-081/083 | Agent repository port | `ports/AgentRepository.ts` | repository test | ADR-IMP-0004/5 | DONE |
| REQ-IMP-004-035 | GDE-081/083 | Execution repository port | `ports/ExecutionRepository.ts` | repository test | ADR-IMP-0004/5 | DONE |
| REQ-IMP-004-036 | GDE-083 | In-memory Agent repository | `InMemoryAgentRepository.ts` | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-004-037 | GDE-083 | In-memory Execution repository | `InMemoryExecutionRepository.ts` | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-004-038 | GDE-082 | Application use cases | `ai-workforce/application/` | coordinator/workforce tests | ADR-IMP-0004 | DONE |
| REQ-IMP-004-039 | GDE-083 | Repository contracts | workforce repositories | repository test | ADR-IMP-0005 | DONE |
| REQ-IMP-004-040 | ARCH-025 | AgentProvisioned | `domain/WorkforceEvents.ts` | event assertions | — | DONE |
| REQ-IMP-004-041 | ARCH-025 | AgentAssigned | `domain/WorkforceEvents.ts` | event assertions | ADR-IMP-0013 | DONE |
| REQ-IMP-004-042 | ARCH-025 | ExecutionStarted | `domain/WorkforceEvents.ts` | event assertions | ADR-IMP-0015 | DONE |
| REQ-IMP-004-043 | ARCH-025 | ExecutionCompleted | `domain/WorkforceEvents.ts` | event assertions | ADR-IMP-0015 | DONE |
| REQ-IMP-004-044 | ARCH-025 | ExecutionFailed | `domain/WorkforceEvents.ts` | event assertions | ADR-IMP-0015 | DONE |
| REQ-IMP-004-045 | ARCH-025 | ExecutionCancelled | `domain/WorkforceEvents.ts` | event assertions | ADR-IMP-0015 | DONE |
| REQ-IMP-004-046 | ARCH-025 | Workforce audit metadata | `domain/WorkforceAuditMetadata.ts` | serialization tests | ADR-IMP-0015 | DONE |
| REQ-IMP-004-047 | ARCH-025 | Audit event metadata | Workforce events | workforce test | ADR-IMP-0015 | DONE |
| REQ-IMP-004-048 | GDE-079 | Agent contract | `contracts/AgentAggregate.md` | document review | ADR-IMP-0014 | DONE |
| REQ-IMP-004-049 | GDE-079 | Execution contract | `contracts/ExecutionAggregate.md` | document review | ADR-IMP-0015 | DONE |
| REQ-IMP-004-050 | GDE-079 | WorkAssignment contract | `contracts/WorkAssignment.md` | document review | ADR-IMP-0013 | DONE |
| REQ-IMP-004-051 | GDE-079 | Context contract | `contracts/AIWorkforceContext.md` | document review | ADR-IMP-0013/15 | DONE |
| REQ-IMP-004-052 | GDE-081/082 | No lateral dependencies | bounded context tests | `bounded-context-matrix.test.ts` | ADR-IMP-0013/15 | DONE |
| REQ-IMP-004-053 | ARCH-003 | Context map | `BOUNDED-CONTEXT-MAP.md` | architecture review | ADR-IMP-0013/15 | DONE |
| REQ-IMP-004-054 | GDE-079 | Bidirectional traceability | this matrix | report review | — | DONE |
| REQ-IMP-004-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-004-AI-WORKFORCE-REPORT.md` | Core check | — | DONE |
| REQ-IMP-005-001 | GDE-018 | Institutional Assets module | `core/src/modules/institutional-assets/` | institutional-assets test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-002 | GDE-018/019 | Canonical Asset Aggregate | `domain/Asset.ts` | Asset creation/lifecycle tests | ADR-IMP-0016 | DONE |
| REQ-IMP-005-003 | GDE-023 | Asset owns immutable versions | `domain/AssetVersion.ts` | version tests | ADR-IMP-0017 | DONE |
| REQ-IMP-005-004 | GDE-020 | Canonical meaning, no format | `domain/CanonicalContent.ts` | content validation test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-005 | GDE-019 | Asset metadata | `domain/AssetMetadata.ts` | creation test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-006 | GDE-080 | Valid Aggregate foundation | Institutional Assets domain | institutional-assets test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-007 | GDE-022 | Canonical lifecycle states | `domain/AssetStatus.ts` | lifecycle test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-008 | GDE-022 | Create in PROPOSED | `Asset.create()` / `createAsset()` | lifecycle/application tests | ADR-IMP-0016 | DONE |
| REQ-IMP-005-009 | GDE-022 | Produce transition | `Asset.produce()` / `produceAsset()` | lifecycle/application tests | ADR-IMP-0016 | DONE |
| REQ-IMP-005-010 | GDE-022/027 | Governed supersession | `supersedeAsset()` | supersession tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-011 | GDE-022 | Archive published Asset | `Asset.archive()` / `archiveAsset()` | archive tests | ADR-IMP-0016 | DONE |
| REQ-IMP-005-012 | GDE-080 | Protected lifecycle | `domain/Asset.ts` | lifecycle tests | ADR-IMP-0016 | DONE |
| REQ-IMP-005-013 | GDE-023 | Monotonic version number | `domain/AssetVersionNumber.ts` | version test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-014 | GDE-023 | Append immutable version | `Asset.createVersion()` | version/application tests | ADR-IMP-0017 | DONE |
| REQ-IMP-005-015 | GDE-023 | Supersede current pointer, not history | `Asset.currentVersionId` | prior snapshot test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-016 | GDE-023 | Single current version source | `Asset.currentAssetVersion` | version test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-017 | GDE-023 | Exactly one currentVersionId | `Asset.assertState()` | reconstruction test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-018 | GDE-080 | Versioning validation | Asset/AssetVersion | version tests | ADR-IMP-0017 | DONE |
| REQ-IMP-005-019 | GDE-019 | Semantic classification | `domain/AssetClassification.ts` | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-020 | GDE-019 | Sensitivity taxonomy | `AssetClassification.ts` | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-021 | GDE-019 | Semantic category taxonomy | `ASSET_CATEGORIES` | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-022 | GDE-019 | Normalized semantic tags | `AssetTag` | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-023 | GDE-019 | Classification policy guard | `AssetClassification` constructor | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-024 | GDE-080 | Classification validation | classification domain | classification test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-025 | GDE-027 | Immutable relationship | `domain/AssetRelationship.ts` | graph tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-026 | GDE-027 | Four canonical relation types | `AssetRelationshipType` | graph tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-027 | GDE-027/081 | Global graph policy at Application edge | graph port/use cases | graph tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-028 | GDE-026/027 | Conditional acyclicity | `AssetRelationshipGraphPort` | cycle tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-029 | GDE-019/027 | Intra-Tenant relationships | `AssetRelationship` | Tenant tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-030 | GDE-080 | Relationship validation | graph adapter/use cases | graph tests | ADR-IMP-0018 | DONE |
| REQ-IMP-005-031 | GDE-081/083 | Asset repository port | `ports/AssetRepository.ts` | repository contract test | ADR-IMP-0004/5 | DONE |
| REQ-IMP-005-032 | GDE-083 | In-memory Asset repository | `InMemoryAssetRepository.ts` | repository contract test | ADR-IMP-0005 | DONE |
| REQ-IMP-005-033 | GDE-082 | Asset application use cases | `application/AssetUseCases.ts` | application tests | ADR-IMP-0004/16/18 | DONE |
| REQ-IMP-005-034 | GDE-023/083 | Complete snapshots | `AssetSnapshot` | round-trip test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-035 | GDE-079 | Deterministic serialization | `toSnapshot()` / Value Objects | serialization tests | ADR-IMP-0017 | DONE |
| REQ-IMP-005-036 | GDE-083 | Full rehydration | `Asset.rehydrate()` | reconstruction test | ADR-IMP-0017 | DONE |
| REQ-IMP-005-037 | GDE-083 | Repository contract | AssetRepository adapters | concurrency/Tenant tests | ADR-IMP-0005 | DONE |
| REQ-IMP-005-038 | ARCH-025 | AssetCreated | `domain/AssetEvents.ts` | event assertions | ADR-IMP-0016 | DONE |
| REQ-IMP-005-039 | ARCH-025 | AssetProduced | `domain/AssetEvents.ts` | lifecycle test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-040 | ARCH-025 | AssetVersionCreated | `domain/AssetEvents.ts` | version/event tests | ADR-IMP-0017 | DONE |
| REQ-IMP-005-041 | ARCH-025 | AssetSuperseded | `domain/AssetEvents.ts` | supersession test | ADR-IMP-0018 | DONE |
| REQ-IMP-005-042 | ARCH-025 | AssetArchived | `domain/AssetEvents.ts` | archive test | ADR-IMP-0016 | DONE |
| REQ-IMP-005-043 | ARCH-025 | AssetRelationshipCreated | `domain/AssetEvents.ts` | graph test | ADR-IMP-0018 | DONE |
| REQ-IMP-005-044 | ARCH-025 | Complete event audit metadata | `AssetDomainEvent` | event assertions | ADR-IMP-0016/17/18 | DONE |
| REQ-IMP-005-045 | GDE-080 | Event validation | Asset events | institutional-assets test | ADR-IMP-0016/17/18 | DONE |
| REQ-IMP-005-046 | GDE-079 | Asset contract | `contracts/AssetAggregate.md` | document review | ADR-IMP-0016 | DONE |
| REQ-IMP-005-047 | GDE-079 | AssetVersion contract | `contracts/AssetVersion.md` | document review | ADR-IMP-0017 | DONE |
| REQ-IMP-005-048 | GDE-079 | Relationship contract | `contracts/AssetRelationship.md` | document review | ADR-IMP-0018 | DONE |
| REQ-IMP-005-049 | GDE-079 | Context contract | `contracts/InstitutionalAssetsContext.md` | document review | ADR-IMP-0016/17/18 | DONE |
| REQ-IMP-005-050 | GDE-079 | Durable Asset decisions | `docs/adr/ADR-IMP-0016..0018` | ADR review | ADR-IMP-0016/17/18 | DONE |
| REQ-IMP-005-051 | ARCH-003 | Context boundary map | `BOUNDED-CONTEXT-MAP.md` | architecture review | ADR-IMP-0016 | DONE |
| REQ-IMP-005-052 | GDE-079 | Bidirectional traceability | this matrix | report review | — | DONE |
| REQ-IMP-005-053 | GDE-081/082 | No lateral context imports | bounded context test | `bounded-context-matrix.test.ts` | ADR-IMP-0016 | DONE |
| REQ-IMP-005-054 | GDE-079 | Explicit public module API | module indexes and README | typecheck/contract review | ADR-IMP-0016 | DONE |
| REQ-IMP-005-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-005-INSTITUTIONAL-ASSETS-REPORT.md` | Core check | — | DONE |
| REQ-IMP-006-001 | GDE-028 | Knowledge & Policy module | `core/src/modules/knowledge-policy/` | knowledge-policy test | ADR-IMP-0019 | DONE |
| REQ-IMP-006-002 | GDE-028 | Knowledge Aggregate | `domain/Knowledge.ts` | aggregate tests | ADR-IMP-0019 | DONE |
| REQ-IMP-006-003 | GDE-028 | Policy Aggregate | `domain/Policy.ts` | aggregate tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-004 | GDE-028 | Metadata Value Objects | `KnowledgeMetadata.ts` / `PolicyMetadata.ts` | creation tests | ADR-IMP-0019/20 | DONE |
| REQ-IMP-006-005 | GDE-079 | Public namespaces | module barrels | typecheck | — | DONE |
| REQ-IMP-006-006 | GDE-080 | Valid Aggregate foundation | Knowledge/Policy domain | knowledge-policy test | — | DONE |
| REQ-IMP-006-007 | GDE-028 | Knowledge lifecycle states | `KnowledgeStatus.ts` | lifecycle test | ADR-IMP-0019 | DONE |
| REQ-IMP-006-008 | GDE-028 | CreateKnowledge | `Knowledge.create()` / use case | creation/application tests | ADR-IMP-0019 | DONE |
| REQ-IMP-006-009 | GDE-028 | CurateKnowledge | `Knowledge.curate()` / use case | lifecycle/application tests | ADR-IMP-0019 | DONE |
| REQ-IMP-006-010 | GDE-028 | ArchiveKnowledge | `Knowledge.archive()` | lifecycle test | ADR-IMP-0019 | DONE |
| REQ-IMP-006-011 | GDE-028 | SupersedeKnowledge | `Knowledge.supersede()` | lifecycle test coverage | ADR-IMP-0019 | DONE |
| REQ-IMP-006-012 | GDE-080 | Knowledge lifecycle tests | `knowledge-policy.test.ts` | lifecycle test | ADR-IMP-0019 | DONE |
| REQ-IMP-006-013 | GDE-029 | PolicyVersion | `domain/PolicyVersion.ts` | version tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-014 | GDE-029 | PolicyRule Value Object | `domain/PolicyRule.ts` | policy rule tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-015 | GDE-029 | Immutable PolicyRuleSet | `domain/PolicyRuleSet.ts` | immutability tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-016 | GDE-029 | Policy lifecycle states | `PolicyStatus.ts` | creation tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-017 | GDE-029 | CreatePolicy | `Policy.create()` / use case | creation/application tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-018 | GDE-029 | CreatePolicyVersion | `Policy.createVersion()` / use case | version tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-019 | GDE-080 | Policy tests | `knowledge-policy.test.ts` | policy tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-020 | GDE-028/030 | Asset references only | Shared references | architecture/application tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-021 | GDE-028/030 | Policy references only | `PolicyReference` | relationship tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-022 | GDE-030 | KnowledgeRelationship types | `KnowledgeRelationship.ts` | relationship tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-023 | GDE-030 | Relationship policy | relationship constructor rules | relationship tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-024 | GDE-030 | Reject cross-Tenant references | Knowledge/Relationship invariants | Tenant tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-025 | GDE-080 | Relationship tests | `knowledge-policy.test.ts` | relationship tests | ADR-IMP-0021 | DONE |
| REQ-IMP-006-026 | GDE-081/083 | Knowledge repository port | `ports/KnowledgeRepository.ts` | repository contract | ADR-IMP-0004/5 | DONE |
| REQ-IMP-006-027 | GDE-081/083 | Policy repository port | `ports/PolicyRepository.ts` | repository contract | ADR-IMP-0004/5 | DONE |
| REQ-IMP-006-028 | GDE-081 | Reference validation port | `KnowledgeReferenceValidationPort.ts` | application test | ADR-IMP-0021 | DONE |
| REQ-IMP-006-029 | GDE-083 | In-memory adapters | `infrastructure/` | repository/application tests | ADR-IMP-0005 | DONE |
| REQ-IMP-006-030 | GDE-082 | Application use cases | `application/KnowledgePolicyUseCases.ts` | application tests | ADR-IMP-0004/19/20/21 | DONE |
| REQ-IMP-006-031 | GDE-083 | Snapshots | `KnowledgeSnapshot` / `PolicySnapshot` | snapshot tests | ADR-IMP-0019/20 | DONE |
| REQ-IMP-006-032 | GDE-079 | Serialization | `toSnapshot()` / Value Objects | snapshot tests | ADR-IMP-0019/20 | DONE |
| REQ-IMP-006-033 | GDE-083 | Rehydration | `Knowledge.rehydrate()` / `Policy.rehydrate()` | snapshot tests | ADR-IMP-0019/20 | DONE |
| REQ-IMP-006-034 | GDE-083 | Contract tests | repository adapters | concurrency/Tenant tests | ADR-IMP-0005 | DONE |
| REQ-IMP-006-035 | ARCH-025 | KnowledgeCreated | `KnowledgePolicyEvents.ts` | event assertions | ADR-IMP-0019 | DONE |
| REQ-IMP-006-036 | ARCH-025 | KnowledgeCurated | `KnowledgePolicyEvents.ts` | event assertions | ADR-IMP-0019 | DONE |
| REQ-IMP-006-037 | ARCH-025 | PolicyCreated | `KnowledgePolicyEvents.ts` | event assertions | ADR-IMP-0020 | DONE |
| REQ-IMP-006-038 | ARCH-025 | PolicyVersionCreated | `KnowledgePolicyEvents.ts` | event assertions | ADR-IMP-0020 | DONE |
| REQ-IMP-006-039 | ARCH-025 | KnowledgeLinked | `KnowledgePolicyEvents.ts` | event assertions | ADR-IMP-0021 | DONE |
| REQ-IMP-006-040 | ARCH-025 | Complete event metadata | `KnowledgePolicyDomainEvent` | event assertions | ADR-IMP-0019/20/21 | DONE |
| REQ-IMP-006-041 | GDE-080 | Event tests | Knowledge/Policy events | knowledge-policy test | ADR-IMP-0019/20/21 | DONE |
| REQ-IMP-006-042 | GDE-029 | PolicyRule excludes Workflow | `PolicyRule.ts` | validation/architecture tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-043 | GDE-029 | PolicyRule excludes Review | `PolicyRule.ts` | validation/architecture tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-044 | GDE-029 | PolicyRule excludes Publication | `PolicyRule.ts` | validation/architecture tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-045 | GDE-029 | Institutional rule only | `PolicyRule.ts` | validation tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-046 | GDE-029 | PolicyAuthorityContext | `PolicyAuthorityContext.ts` | creation/Tenant tests | ADR-IMP-0020 | DONE |
| REQ-IMP-006-047 | GDE-080 | Policy decoupling tests | policy tests | knowledge-policy test | ADR-IMP-0020 | DONE |
| REQ-IMP-006-048 | GDE-079 | Knowledge contract | `contracts/KnowledgeAggregate.md` | document review | ADR-IMP-0019/21 | DONE |
| REQ-IMP-006-049 | GDE-079 | Policy contract | `contracts/PolicyAggregate.md` | document review | ADR-IMP-0020 | DONE |
| REQ-IMP-006-050 | GDE-079 | Context contract | `contracts/KnowledgePolicyContext.md` | document review | ADR-IMP-0019/20/21 | DONE |
| REQ-IMP-006-051 | GDE-079 | Durable Knowledge/Policy ADRs | `docs/adr/ADR-IMP-0019..0021` | ADR review | ADR-IMP-0019/20/21 | DONE |
| REQ-IMP-006-052 | ARCH-003 | Context boundary map | `BOUNDED-CONTEXT-MAP.md` | architecture review | ADR-IMP-0019 | DONE |
| REQ-IMP-006-053 | GDE-079 | Bidirectional traceability | this matrix | report review | — | DONE |
| REQ-IMP-006-054 | GDE-081/082 | No lateral context imports | bounded context test | `bounded-context-matrix.test.ts` | ADR-IMP-0021 | DONE |
| REQ-IMP-006-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-006-KNOWLEDGE-POLICY-REPORT.md` | Core check | — | DONE |
| REQ-IMP-007-001 | ARCH-015 | Workflow module | `core/src/modules/workflow/` | workflow test | ADR-IMP-0022 | DONE |
| REQ-IMP-007-002 | ARCH-015 | Workflow Aggregate | `domain/Workflow.ts` | aggregate tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-003 | ARCH-015 | WorkflowExecution Aggregate | `domain/WorkflowExecution.ts` | execution tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-004 | ARCH-015 | StageDefinition | `WorkflowDefinitions.ts` | definition tests | ADR-IMP-0022/24 | DONE |
| REQ-IMP-007-005 | ARCH-015 | TaskDefinition | `WorkflowDefinitions.ts` | definition tests | ADR-IMP-0022/23 | DONE |
| REQ-IMP-007-006 | GDE-080 | Basic Aggregate tests | `workflow.test.ts` | node:test | — | DONE |
| REQ-IMP-007-007 | GDE-076/082 | WorkflowId | `shared/identity/WorkflowId.ts` | identity tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-008 | GDE-076/082 | WorkflowExecutionId | `shared/identity/WorkflowExecutionId.ts` | identity tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-009 | GDE-076/082 | StageId | `shared/identity/StageId.ts` | identity tests | ADR-IMP-0024 | DONE |
| REQ-IMP-007-010 | GDE-076/082 | TaskId | `shared/identity/TaskId.ts` | identity tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-011 | ARCH-015 | Workflow lifecycle | `WorkflowStatus.ts` | lifecycle tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-012 | ARCH-015 | CreateWorkflow | `Workflow.create()` / use case | application tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-013 | ARCH-015 | ActivateWorkflow | `Workflow.activate()` / use case | lifecycle tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-014 | ARCH-015 | ArchiveWorkflow | `Workflow.archive()` / use case | lifecycle tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-015 | ARCH-015 | Immutable ACTIVE definition | `Workflow.ts` | execution version test | ADR-IMP-0022/23 | DONE |
| REQ-IMP-007-016 | ARCH-015 | WorkflowExecution lifecycle | `WorkflowExecutionStatus.ts` | execution tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-017 | ARCH-015 | StartWorkflow | `WorkflowExecution.start()` / use case | start tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-018 | ARCH-015 | AdvanceStage | `WorkflowExecution.advanceStage()` | stage tests | ADR-IMP-0024 | DONE |
| REQ-IMP-007-019 | ARCH-015 | PauseWorkflow | `WorkflowExecution.pause()` | lifecycle tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-020 | ARCH-015 | ResumeWorkflow | `WorkflowExecution.resume()` | lifecycle tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-021 | ARCH-015 | CompleteWorkflow | `WorkflowExecution.complete()` | completion tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-022 | ARCH-015 | CancelWorkflow | `WorkflowExecution.cancel()` | lifecycle tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-023 | ARCH-015 | FailWorkflowExecution | `WorkflowExecution.fail()` | failure tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-024 | ARCH-015 | StageDisposition | `StageDisposition.ts` | advance tests | ADR-IMP-0024 | DONE |
| REQ-IMP-007-025 | ARCH-015 | StageExecution state | `WorkflowExecutionState.ts` | execution tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-026 | ARCH-015 | TaskExecution state | `WorkflowExecutionState.ts` | task tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-027 | ARCH-015 | TaskReady origin | `WorkflowExecution.activateStage()` | TaskReady tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-028 | ARCH-015 | recordTaskState | use case / Aggregate method | task observation tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-029 | ARCH-015 | RecordTaskFailure | use case / Aggregate method | failure tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-030 | ARCH-015 | WorkflowReference | shared references | typecheck/tests | ADR-IMP-0022 | DONE |
| REQ-IMP-007-031 | ARCH-015 | WorkflowExecutionReference | shared references | typecheck/tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-032 | GDE-081 | MissionWorkflowPort | `ports/MissionWorkflowPort.ts` | application tests | ADR-IMP-0004 | DONE |
| REQ-IMP-007-033 | GDE-081 | WorkflowGovernancePort | `ports/WorkflowGovernancePort.ts` | application tests | ADR-IMP-0004 | DONE |
| REQ-IMP-007-034 | GDE-081 | WorkflowAssignmentPort | `ports/WorkflowAssignmentPort.ts` | task observation tests | ADR-IMP-0004 | DONE |
| REQ-IMP-007-035 | GDE-081 | WorkflowAssetPort | `ports/WorkflowAssetPort.ts` | application tests | ADR-IMP-0004 | DONE |
| REQ-IMP-007-036 | GDE-081 | WorkflowKnowledgePort | `ports/WorkflowKnowledgePort.ts` | application tests | ADR-IMP-0004 | DONE |
| REQ-IMP-007-037 | GDE-081 | WorkflowDependencyGraphPort | `ports/WorkflowDependencyGraphPort.ts` | graph tests | ADR-IMP-0024 | DONE |
| REQ-IMP-007-038 | GDE-083 | In-memory graph adapter | `InMemoryWorkflowDependencyGraph.ts` | graph tests | ADR-IMP-0024 | DONE |
| REQ-IMP-007-039 | GDE-081/083 | WorkflowRepositoryPort | `ports/WorkflowRepository.ts` | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-007-040 | GDE-081/083 | WorkflowExecutionRepositoryPort | `ports/WorkflowExecutionRepository.ts` | repository contract | ADR-IMP-0005 | DONE |
| REQ-IMP-007-041 | GDE-083 | InMemoryWorkflowRepository | `infrastructure/InMemoryWorkflowRepository.ts` | contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-007-042 | GDE-083 | InMemoryWorkflowExecutionRepository | `infrastructure/InMemoryWorkflowExecutionRepository.ts` | contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-007-043 | GDE-083 | Optimistic concurrency | repositories | concurrency tests | ADR-IMP-0005 | DONE |
| REQ-IMP-007-044 | GDE-083 | Snapshots | `WorkflowSnapshot` / `WorkflowExecutionSnapshot` | snapshot tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-045 | GDE-079 | Deterministic serialization | `toSnapshot()` | snapshot tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-046 | GDE-083 | Rehydration | `rehydrate()` methods | snapshot tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-047 | ARCH-025 | Workflow events | `WorkflowEvents.ts` | event assertions | ADR-IMP-0022/23 | DONE |
| REQ-IMP-007-048 | ARCH-025 | TaskObserved event | `WorkflowEvents.ts` | task tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-049 | ARCH-025 | WorkflowFailed event | `WorkflowEvents.ts` | failure tests | ADR-IMP-0023 | DONE |
| REQ-IMP-007-050 | ARCH-025 | Complete audit metadata | `WorkflowDomainEvent` | event tests | ADR-IMP-0022/23 | DONE |
| REQ-IMP-007-051 | GDE-079 | Workflow contracts | `contracts/Workflow*.md` | document review | ADR-IMP-0022/23 | DONE |
| REQ-IMP-007-052 | GDE-079 | Stage and Task contracts | `contracts/Stage.md` / `Task.md` | document review | ADR-IMP-0023/24 | DONE |
| REQ-IMP-007-053 | ARCH-003 | Bounded context map | `BOUNDED-CONTEXT-MAP.md` | architecture review | ADR-IMP-0022 | DONE |
| REQ-IMP-007-054 | GDE-081/082 | No lateral imports | bounded context test | architecture test | ADR-IMP-0022 | DONE |
| REQ-IMP-007-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-007-WORKFLOW-REPORT.md` | Core check | — | DONE |
| REQ-IMP-008-001 | GDE-045/ARCH-003 | Isolated Review implementation module | `modules/review/` | Review/architecture tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-002 | GDE-076/082 | Review canonical identities | `shared/identity/Review*.ts` | identity tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-003 | ARCH-007 | Neutral Review references | `shared/references/Review*.ts` | typecheck/architecture tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-004 | GDE-081 | Public Review namespace | `modules/index.ts` / Review barrels | public API tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-005 | GDE-037 | Owned immutable ReviewRequest | `ReviewRequest.ts` | ownership/immutability tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-006 | GDE-037/ARCH-024 | Immutable Tenant-bound ReviewScope | `ReviewScope.ts` | scope boundary tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-007 | GDE-037 | Review request type and criteria | `ReviewTypes.ts` / `ReviewRequest.ts` | request validation tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-008 | GDE-045 | Review Aggregate | `Review.ts` | aggregate tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-009 | GDE-045 | Review statuses | `ReviewTypes.ts` | lifecycle tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-010 | GDE-080 | Valid initial Aggregate | Review domain | basic Review tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-011 | GDE-045 | CreateReview | `Review.create()` / use case | creation tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-012 | GDE-037 | StartReview | `Review.start()` / use case | lifecycle/port tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-013 | GDE-045/049 | CompleteReview | `Review.complete()` / use case | completion tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-014 | GDE-049 | ArchiveReview | `Review.archive()` / use case | authorization tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-015 | GDE-045 | Protected Review lifecycle | `Review.ts` | invalid transition tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-016 | GDE-037 | ReviewSession entity | `ReviewSession.ts` | session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-017 | GDE-037 | ReviewSession statuses | `ReviewTypes.ts` | session lifecycle tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-018 | GDE-037 | PlanSession | Aggregate/application | planned session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-019 | GDE-037 | OpenSession | Aggregate/application | active session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-020 | GDE-037 | CloseSession | Aggregate/application | closed session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-021 | GDE-037 | CancelSession | Aggregate/application | cancellation tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-022 | GDE-049 | Single ACTIVE session | `Review.ts` | concurrency invariant test | ADR-IMP-0026 | DONE |
| REQ-IMP-008-023 | GDE-080 | Session contract coverage | Review test suite | session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-024 | GDE-076/082 | ReviewFindingId | shared identity | identity tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-025 | GDE-037 | FindingCategory | `ReviewTypes.ts` | Finding tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-026 | GDE-037 | FindingSeverity | `ReviewTypes.ts` | Finding tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-027 | GDE-037 | Immutable ReviewFinding | `ReviewFinding.ts` | immutability tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-028 | GDE-037 | RecordFinding | Aggregate/application | ACTIVE session tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-029 | ARCH-025 | Finding session ownership | `ReviewSession.ts` / `Review.ts` | ownership tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-030 | GDE-080 | Finding contract coverage | Review test suite | Finding tests | ADR-IMP-0026 | DONE |
| REQ-IMP-008-031 | GDE-076/082 | ReviewConclusionId and outcomes | shared identity / `ReviewTypes.ts` | identity/outcome tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-032 | GDE-045 | Immutable ReviewConclusion | `ReviewConclusion.ts` | conclusion tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-033 | GDE-045/049 | External completion authorization | `CompletionAuthorization` | Governance port tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-034 | GDE-037 | CLOSED-only contribution | `Review.complete()` | cancelled contribution tests | ADR-IMP-0026/27 | DONE |
| REQ-IMP-008-035 | GDE-045 | Conclusion is not Approval | Review outcome contract | all-outcome tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-036 | GDE-080 | Conclusion contract coverage | Review test suite | conclusion tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-037 | GDE-081 | Structural target validation port | `ReviewReferenceValidationPort.ts` | application port tests | ADR-IMP-0004/25 | DONE |
| REQ-IMP-008-038 | GDE-081 | Mission validation port | `ReviewMissionPort.ts` | application port tests | ADR-IMP-0004/25 | DONE |
| REQ-IMP-008-039 | GDE-081 | Governance authorization port | `ReviewGovernancePort.ts` | authorization tests | ADR-IMP-0004/27 | DONE |
| REQ-IMP-008-040 | GDE-081 | Workflow notification port | `ReviewWorkflowPort.ts` | notification tests | ADR-IMP-0004/25 | DONE |
| REQ-IMP-008-041 | GDE-081 | Publication outcome notification | `ReviewPublicationPort.ts` | post-save tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-042 | GDE-080 | Port behavior and failure order | `ReviewUseCases.ts` | before/during/after-save tests | ADR-IMP-0027 | DONE |
| REQ-IMP-008-043 | GDE-081/083 | ReviewRepository port | `ReviewRepository.ts` | repository contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-008-044 | GDE-083 | InMemoryReviewRepository | `InMemoryReviewRepository.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-008-045 | GDE-083 | Optimistic concurrency | in-memory repository | concurrency test | ADR-IMP-0005 | DONE |
| REQ-IMP-008-046 | GDE-083 | Deep-frozen snapshots | `Review.toSnapshot()` | snapshot tests | ADR-IMP-0025/26 | DONE |
| REQ-IMP-008-047 | GDE-083 | Deterministic serialization/rehydration | `Review.serialize()` / `rehydrate()` | reconstruction tests | ADR-IMP-0025/26 | DONE |
| REQ-IMP-008-048 | GDE-080/083 | Repository contract coverage | Review test suite | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-008-049 | ARCH-025 | Review domain events | `ReviewEvents.ts` | event sequence tests | ADR-IMP-0025/26 | DONE |
| REQ-IMP-008-050 | ARCH-025 | Complete event audit metadata | `ReviewDomainEvent` | audit metadata tests | ADR-IMP-0025 | DONE |
| REQ-IMP-008-051 | GDE-079 | Review contracts | `contracts/Review*.md` | document review | ADR-IMP-0025/26/27 | DONE |
| REQ-IMP-008-052 | GDE-079 | Durable Review decisions | `ADR-IMP-0025..0027` | ADR review | ADR-IMP-0025/26/27 | DONE |
| REQ-IMP-008-053 | ARCH-003 | Context map and traceability | map and this matrix | architecture review | ADR-IMP-0025 | DONE |
| REQ-IMP-008-054 | GDE-081/082 | Public API and no lateral imports | barrels / bounded context test | typecheck/architecture test | ADR-IMP-0025 | DONE |
| REQ-IMP-008-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-008-REVIEW-REPORT.md` | Core/demo checks | — | DONE |
| REQ-IMP-009-001 | ARCH-003/GDE-081 | Publication implementation module | `core/src/modules/publication/` | publication/architecture tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-002 | GDE-076/082 | Publication identities | `shared/identity/Publication*.ts` | identity tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-003 | GDE-076/082 | ConnectorReference backed by ConnectorId | `shared/references/ConnectorReference.ts` | identity/publication tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-004 | GDE-081 | Publication references | `shared/references/Publication*.ts` | typecheck/identity tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-005 | GDE-081 | Public Publication namespace | `modules/publication/index.ts` | typecheck | ADR-IMP-0028 | DONE |
| REQ-IMP-009-006 | GDE-080 | Foundation tests | `publication.test.ts` | node:test | ADR-IMP-0028 | DONE |
| REQ-IMP-009-007 | GDE-045 | Publication Aggregate | `domain/Publication.ts` | lifecycle tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-008 | GDE-045 | Canonical lifecycle | `PublicationStatus` | lifecycle tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-009 | GDE-045/049 | CreatePublication | `Publication.create()` / use case | package tests | ADR-IMP-0028/29 | DONE |
| REQ-IMP-009-010 | GDE-049 | PreparePublication | application use case | eligibility tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-011 | GDE-049 | AuthorizePublication | application use case | governance tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-012 | GDE-049 | ArchivePublication | application use case | lifecycle tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-013 | GDE-080 | Transition tests | `publication.test.ts` | invalid transition tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-014 | GDE-079 | Immutable PublicationPackage | `PublicationPackage.ts` | immutability tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-015 | GDE-079 | Package item pairing | `PublicationPackageItem` | pairing tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-016 | GDE-079 | Destination model | `PublicationDestination` | destination tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-017 | GDE-079 | Package Tenant boundary | `PublicationPackage.assertState()` | Tenant tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-018 | GDE-079 | Exact destination coverage | `Publication.recordOutcome()` | outcome tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-019 | GDE-079 | PublicationVersionNumber | `PublicationVersionNumber` | retry tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-020 | GDE-079 | PublicationManifest snapshot | `PublicationManifest` | snapshot tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-021 | GDE-079 | PublicationRecord semantics | `PublicationRecord` | record tests | ADR-IMP-0029/30 | DONE |
| REQ-IMP-009-022 | GDE-079 | Record SUCCESS/FAILED invariants | `PublicationRecord` | record tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-023 | GDE-079 | Result derivation | `PublicationVersion` | partial/failed/success tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-024 | GDE-079 | Idempotent observationBatchKey | `Publication.recordOutcome()` | idempotency tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-025 | GDE-081 | PublicationMissionPort | `ports/PublicationMissionPort.ts` | application tests | ADR-IMP-0004 | DONE |
| REQ-IMP-009-026 | GDE-081 | PublicationReviewPort | `ports/PublicationReviewPort.ts` | eligibility tests | ADR-IMP-0027/30 | DONE |
| REQ-IMP-009-027 | GDE-081 | PublicationGovernancePort | `ports/PublicationGovernancePort.ts` | authorization tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-028 | GDE-081 | PublicationReferenceValidationPort | `ports/PublicationReferenceValidationPort.ts` | application tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-029 | GDE-081 | PublicationConnectorEvidencePort | `ports/PublicationConnectorEvidencePort.ts` | outcome tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-030 | GDE-049/081 | Eligibility snapshot | `PublicationEligibility.ts` | manifest tests | ADR-IMP-0028/30 | DONE |
| REQ-IMP-009-031 | GDE-049/081 | Authorization snapshot | `PublicationAuthorization.ts` | manifest tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-032 | GDE-081 | CreatePublication use case | `PublicationUseCases.ts` | application tests | ADR-IMP-0004/28 | DONE |
| REQ-IMP-009-033 | GDE-081 | PreparePublication use case | `PublicationUseCases.ts` | eligibility tests | ADR-IMP-0004/28 | DONE |
| REQ-IMP-009-034 | GDE-081 | AuthorizePublication use case | `PublicationUseCases.ts` | authorization tests | ADR-IMP-0004/30 | DONE |
| REQ-IMP-009-035 | GDE-081 | RecordPublicationOutcome use case | `PublicationUseCases.ts` | outcome/idempotency tests | ADR-IMP-0004/29 | DONE |
| REQ-IMP-009-036 | GDE-081 | ArchivePublication use case | `PublicationUseCases.ts` | lifecycle tests | ADR-IMP-0004/30 | DONE |
| REQ-IMP-009-037 | GDE-083 | PublicationRepositoryPort | `ports/PublicationRepositoryPort.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-009-038 | GDE-083 | InMemoryPublicationRepository | `infrastructure/InMemoryPublicationRepository.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-009-039 | GDE-083 | Optimistic concurrency | repository save | concurrency tests | ADR-IMP-0005 | DONE |
| REQ-IMP-009-040 | GDE-083 | Deep-frozen snapshots | `toSnapshot()` | snapshot tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-041 | GDE-083 | Deterministic serialization | `serialize()` | serialization tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-042 | GDE-083 | Rehydration | `Publication.rehydrate()` | reconstruction tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-043 | GDE-083 | Append-only attempts | `PublicationVersion[]` | retry tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-044 | GDE-083 | Repository contract coverage | `publication.test.ts` | repository tests | ADR-IMP-0005 | DONE |
| REQ-IMP-009-045 | ARCH-025 | PublicationCreated | `PublicationEvents.ts` | event tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-046 | ARCH-025 | PublicationPrepared | `PublicationEvents.ts` | event tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-047 | ARCH-025 | PublicationAuthorized | `PublicationEvents.ts` | event tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-048 | ARCH-025 | PublicationOutcomeRecorded | `PublicationEvents.ts` | event tests | ADR-IMP-0029 | DONE |
| REQ-IMP-009-049 | ARCH-025 | PublicationPublished | `PublicationEvents.ts` | event order tests | ADR-IMP-0028 | DONE |
| REQ-IMP-009-050 | ARCH-025 | PublicationArchived | `PublicationEvents.ts` | lifecycle tests | ADR-IMP-0030 | DONE |
| REQ-IMP-009-051 | GDE-079 | Publication contracts | `contracts/Publication*.md` | document review | ADR-IMP-0028/29/30 | DONE |
| REQ-IMP-009-052 | GDE-079 | Publication ADRs | ADR-IMP-0028..0030 | ADR review | ADR-IMP-0028/29/30 | DONE |
| REQ-IMP-009-053 | ARCH-003 | Bounded context map | `BOUNDED-CONTEXT-MAP.md` | architecture test | ADR-IMP-0028 | DONE |
| REQ-IMP-009-054 | GDE-081/082 | Public API and no lateral imports | barrels / bounded context test | typecheck/architecture test | ADR-IMP-0028/30 | DONE |
| REQ-IMP-009-055 | GDE-080 | Epic completion evidence | `EPIC-IMP-009-PUBLICATION-REPORT.md` | Core/demo checks | — | DONE |
