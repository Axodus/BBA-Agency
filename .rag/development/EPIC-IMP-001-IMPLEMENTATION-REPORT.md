# EPIC-IMP-001 — Shared Kernel and Tenant Context

Program: `BBA Platform Core Implementation`
Epic: `EPIC-IMP-001`
Milestone: `M1 — Executable Domain Foundation`
Prerequisite: `EPIC-IMP-000 = PASS`
Date: `2026-07-22`

## Result

- EPIC-IMP-001: `PASS`
- M1 — Executable Domain Foundation: `PASS`
- Push realizado: `NÃO`

## Scope result

The Core now contains reusable, infrastructure-independent domain primitives:

- Shared Kernel base contracts: ValueObject, Entity, AggregateRoot,
  DomainEvent, and domain errors;
- canonical opaque IDs and deterministic test factory;
- TenantContext, provider/port contracts, and same-Tenant rules;
- Clock, Version, CorrelationId, CausationId, AuditMetadata;
- EvidenceReference and directional LineageReference;
- explicit public API barrels and module READMEs.

No Mission, Workflow, Governance, Agent, Assignment, Asset, Knowledge, Policy,
Connector, API, repository, database, ORM, authentication, authorization, or
frontend concept was introduced.

## REQs

| REQ | Status | Evidence |
| --- | --- | --- |
| REQ-IMP-001-001 | DONE | `core/src/shared/README.md` |
| REQ-IMP-001-002 | DONE | `core/src/shared/valueobject/ValueObject.ts` |
| REQ-IMP-001-003 | DONE | `core/src/shared/entity/Entity.ts` |
| REQ-IMP-001-004 | DONE | `core/src/shared/aggregate/AggregateRoot.ts` |
| REQ-IMP-001-005 | DONE | `core/src/shared/events/DomainEvent.ts` |
| REQ-IMP-001-006 | DONE | `core/src/shared/errors/` |
| REQ-IMP-001-007 | DONE | `core/src/shared/identity/Identity.ts` |
| REQ-IMP-001-008 | DONE | `core/src/shared/identity/TenantId.ts` |
| REQ-IMP-001-009 | DONE | `core/src/shared/identity/MissionId.ts` |
| REQ-IMP-001-010 | DONE | `core/src/shared/identity/AssetId.ts` |
| REQ-IMP-001-011 | DONE | Agent, Assignment, Decision, Evidence, and Connector ID modules |
| REQ-IMP-001-012 | DONE | `core/src/shared/identity/IdentityFactory.ts` |
| REQ-IMP-001-013 | DONE | `core/test/shared/identity.test.ts` |
| REQ-IMP-001-014 | DONE | `core/src/shared/tenant/TenantContext.ts` |
| REQ-IMP-001-015 | DONE | `core/src/shared/tenant/tenantRules.ts` |
| REQ-IMP-001-016 | DONE | `core/src/shared/tenant/TenantContextProvider.ts` |
| REQ-IMP-001-017 | DONE | `core/src/shared/tenant/CurrentTenantPort.ts` |
| REQ-IMP-001-018 | DONE | `core/test/shared/tenant.test.ts` |
| REQ-IMP-001-019 | DONE | `core/src/shared/time/Clock.ts` |
| REQ-IMP-001-020 | DONE | `core/src/shared/time/{SystemClock,FakeClock}.ts` |
| REQ-IMP-001-021 | DONE | `core/src/shared/version/Version.ts` |
| REQ-IMP-001-022 | DONE | CorrelationId and CausationId |
| REQ-IMP-001-023 | DONE | `core/src/shared/evidence/EvidenceReference.ts` |
| REQ-IMP-001-024 | DONE | `core/src/shared/lineage/LineageReference.ts` |
| REQ-IMP-001-025 | DONE | `core/src/shared/common/AuditMetadata.ts` |
| REQ-IMP-001-026 | DONE | `core/test/shared/temporal-evidence.test.ts` |

## Public API do módulo

Each Shared Kernel module exposes only its barrel `index.ts`; its README
documents the exported classes, interfaces, types, and factories. Internal
serialization fields, validation helpers, and Tenant extraction helpers remain
unexported.

## Validation

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | strict TypeScript compilation |
| `pnpm --dir core test` | PASS | 6 test files passed |
| `pnpm --dir core lint` | PASS | deterministic Core lint |
| `pnpm --dir core format:check` | PASS | deterministic format check |
| `pnpm --dir core architecture` | PASS | no demo/src dependency |
| `pnpm --dir core check` | PASS | aggregate gate |

## Invariant review

- Tenant Isolation: enforced by `sameTenant`, `assertSameTenant`, and
  `TenantViolation` tests;
- Identity: canonical, opaque, prefixed, immutable Value Objects;
- Time: canonical ISO timestamps and replaceable Clock contract;
- Version: non-negative immutable value with comparison and increment;
- Lineage: directional relationship with source, target, type, time, and reason;
- Evidence: source, type, capture time, locator, and limitation;
- Domain Independence: no infrastructure or external runtime imports;
- Ports before Adapters: Tenant provider and current-Tenant contracts are
  interfaces only.

## Risks and limitations

- Identity tokens use deterministic pure hashing for tests; cryptographic or
  externally coordinated identity generation remains out of scope.
- TenantContext validates non-empty timezone and locale values but does not
  select an external timezone or locale database.
- `SystemClock` is a minimal runtime adapter; persistence and event dispatch
  remain future concerns.
- The GitHub CI workflow has not been remotely executed in this environment.

## Next gate

EPIC-IMP-002 — Mission Core is authorized to begin. It must use these public
contracts and preserve the M0 architecture baseline.
