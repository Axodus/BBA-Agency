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
