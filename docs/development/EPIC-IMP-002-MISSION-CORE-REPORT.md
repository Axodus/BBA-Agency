# EPIC-IMP-002 — Mission Core

Program: `BBA Platform Core Implementation`
Epic: `EPIC-IMP-002`
Milestone: `M2 — Governed Mission`
Prerequisites: `EPIC-IMP-000 = PASS`, `EPIC-IMP-001 = PASS`
Date: `2026-07-22`

## Result

- EPIC-IMP-002: `PASS`
- M2 — Governed Mission: `PASS`
- Push realizado: `NÃO`

M2 means that Mission lifecycle changes are protected, attributable,
Tenant-scoped, evidenced, versioned, and auditable through Domain Events. It
does not claim that institutional Authority resolution is implemented; that
responsibility begins in EPIC-IMP-003.

## Normative realization

The requested Draft, Planned, Active, Completed, Cancelled, and Archived labels
conflicted with the certified `BBAPLT-GDE-013` State Model. `ADR-IMP-0008`
therefore realizes the REQ through canonical states and explicit mapping.
Archive remains a retention marker on a terminal Mission rather than an
alternate Mission status.

## REQs

| REQ | Status | Evidence |
| --- | --- | --- |
| REQ-IMP-002-001 | DONE | `core/src/modules/mission/` |
| REQ-IMP-002-002 | DONE | `domain/Mission.ts` |
| REQ-IMP-002-003 | DONE | canonical `MissionStatus` plus ADR-IMP-0008 |
| REQ-IMP-002-004 | DONE | `domain/MissionMetadata.ts` |
| REQ-IMP-002-005 | DONE | `domain/MissionLifecycle.ts` |
| REQ-IMP-002-006 | DONE | Mission creation tests |
| REQ-IMP-002-007 | DONE | `Mission.create` and application CreateMission |
| REQ-IMP-002-008 | DONE | `Mission.rename` and RenameMission |
| REQ-IMP-002-009 | DONE | `Mission.updateDescription` |
| REQ-IMP-002-010 | DONE | PREPARED to IN_PROGRESS activation |
| REQ-IMP-002-011 | DONE | accountable pause transition |
| REQ-IMP-002-012 | DONE | explicit PREPARED or IN_PROGRESS resume |
| REQ-IMP-002-013 | DONE | closure with outcome and learning |
| REQ-IMP-002-014 | DONE | cancellation mapped to STOPPED |
| REQ-IMP-002-015 | DONE | terminal archive retention marker |
| REQ-IMP-002-016 | DONE | command validation tests |
| REQ-IMP-002-017 | DONE | Aggregate invariants |
| REQ-IMP-002-018 | DONE | MissionCreated |
| REQ-IMP-002-019 | DONE | MissionRenamed |
| REQ-IMP-002-020 | DONE | MissionActivated |
| REQ-IMP-002-021 | DONE | MissionPaused |
| REQ-IMP-002-022 | DONE | MissionCompleted |
| REQ-IMP-002-023 | DONE | MissionCancelled |
| REQ-IMP-002-024 | DONE | MissionArchived |
| REQ-IMP-002-025 | DONE | ordered event tests |
| REQ-IMP-002-026 | DONE | Version in Aggregate and snapshot |
| REQ-IMP-002-027 | DONE | one increment per accepted mutation |
| REQ-IMP-002-028 | DONE | EvidenceReference registration and preservation |
| REQ-IMP-002-029 | DONE | LineageReference registration and preservation |
| REQ-IMP-002-030 | DONE | optimistic Version save contract |
| REQ-IMP-002-031 | DONE | stale-write concurrency tests |
| REQ-IMP-002-032 | DONE | MissionRepository port |
| REQ-IMP-002-033 | DONE | InMemoryMissionRepository |
| REQ-IMP-002-034 | DONE | optimistic `save` |
| REQ-IMP-002-035 | DONE | Tenant-scoped `findById` |
| REQ-IMP-002-036 | DONE | Tenant-scoped `exists` |
| REQ-IMP-002-037 | DONE | four application use cases |
| REQ-IMP-002-038 | DONE | repository contract suite |
| REQ-IMP-002-039 | DONE | MissionSnapshot schema version 1 |
| REQ-IMP-002-040 | DONE | MissionRehydration |
| REQ-IMP-002-041 | DONE | deterministic key-ordered serialization |
| REQ-IMP-002-042 | DONE | lossless reconstruction tests |
| REQ-IMP-002-043 | DONE | snapshot compatibility refusal tests |
| REQ-IMP-002-044 | DONE | module READMEs and public barrels |
| REQ-IMP-002-045 | DONE | Mission architecture tests |

## Aggregate contract

`docs/development/contracts/MissionAggregate.md` defines responsibilities,
invariants, commands, events, states, transitions, public API, repository,
serialization, dependencies, validation, and deferred concerns.

The Mission root barrel exports Domain, application, and port contracts. The
in-memory adapter is intentionally available only from its infrastructure
barrel.

## Validation

| Command | Result | Evidence |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | strict TypeScript compilation |
| `pnpm --dir core test` | PASS | 13 test files, 13 passed |
| `pnpm --dir core lint` | PASS | deterministic lint check |
| `pnpm --dir core format:check` | PASS | deterministic format check |
| `pnpm --dir core architecture` | PASS | no Core dependency on demo or legacy src |
| `pnpm --dir core check` | PASS | complete aggregate gate |
| Mission architecture tests | PASS | no infrastructure or future Context dependency |
| Demo regression | NOT_APPLICABLE | no file under `demo/` changed |

## Invariant evidence

- MissionId and TenantId are immutable and preserved by snapshots.
- New Missions are complete and enter only `PROPOSED`.
- Mission is the sole state-mutation boundary.
- Lifecycle transitions are centralized and invalid transitions are atomic.
- Consequential transitions require actor, authority reference, reason, time,
  and Evidence.
- Every accepted mutation increments Version once and emits one Domain Event.
- Repository reads are Tenant-scoped and return detached rehydrated Aggregates.
- Stale writes fail with `concurrency_conflict`.
- Snapshot reconstruction preserves state without creating pending events.

## Files

Created:

- `core/src/modules/mission/`;
- `core/test/modules/mission/`;
- `core/test/architecture/mission-boundaries.test.ts`;
- `docs/development/contracts/`;
- `docs/adr/ADR-IMP-0008-CANONICAL-MISSION-LIFECYCLE.md`.

Changed:

- Core root exports, package test command, shared error taxonomy, Core README,
  ADR index, Development source index, and traceability matrix.

Preserved:

- `demo/` and legacy `src/` were not changed;
- no database, ORM, HTTP API, Governance, Workforce, Asset, Publication, or
  Connector implementation was introduced.

## Risks and limitations

- Authority references are mandatory inputs but their institutional validity is
  not resolved until EPIC-IMP-003.
- InMemoryMissionRepository is a contract adapter, not production persistence.
- MissionSnapshot supports schema version 1 only and refuses other versions.
- Domain Events remain pending in memory; durable event storage and dispatch are
  future responsibilities.
- GitHub Actions was not remotely executed in this environment.

## Local commits

- `178d531` — `docs: define mission aggregate contract`;
- `c301d3b` — `feat(core): implement mission aggregate`;
- `68ee2fa` — `test(core): verify mission core contracts`;
- `99ca61d` — `fix(core): freeze mission serialization boundaries`.

The traceability and closeout report are committed separately after final gate
validation.

## Decision

EPIC-IMP-002
Status: `PASS`

Milestone:
`M2 — Governed Mission`

Approved to proceed:
`EPIC-IMP-003 — Human Governance`

Date:
`2026-07-22`

Approved by:
`Implementation Review`
