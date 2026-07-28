# Mission Aggregate Contract

Contract: `MissionAggregate`
Epic: `EPIC-IMP-002`
Status: `IMPLEMENTED`
Owner: `Mission Context`

## Normative sources

- `BBA-ADR-0002`;
- `BBAPLT-GDE-011` through `BBAPLT-GDE-016`;
- `BBAPLT-RPT-003`;
- `BBAPLT-ARCH-018`, `020`, `022`, `024`, and `025`;
- `BBAPLT-GDE-082`, `083`, and `085`;
- `ADR-IMP-0008`.
- `ADR-IMP-0009`.

## Responsibilities

Mission is the central Aggregate Root and the only mutation boundary for its
identity, Tenant context, intent, metadata, lifecycle, outcome, Version,
Evidence, Lineage, archive marker, and pending Domain Events.

Mission does not own institutional Authority resolution, AI Workforce,
Assignments, Institutional Assets, Knowledge, Workflow, Publication, or
Connector behavior.

## Invariants

- MissionId and TenantId are canonical and immutable.
- A Mission belongs to exactly one Tenant.
- New Missions enter only `PROPOSED`.
- Metadata, purpose, objective, Steward reference, audience or exclusion
  reason, context, expected outcome, Evidence, and Lineage are mandatory.
- Every accepted mutation increments Version exactly once and emits one event.
- Every consequential transition records actor, authority reference, reason,
  timestamp, and Evidence.
- Invalid transitions and stale writes fail visibly without partial mutation.
- Closure requires outcome, learning, limitations, and residual obligations.
- Archive is a retention marker and preserves the terminal Mission status.
- Rehydration creates no new pending events.

## Canonical states

```text
PROPOSED
AUTHORIZED
PREPARED
IN_PROGRESS
UNDER_REVIEW
OUTCOME_DECISION
PAUSED
DEFERRED
REJECTED
STOPPED
CLOSED_WITH_LEARNING
```

The Draft, Planned, Active, Completed, Cancelled, and Archived labels from the
implementation REQ are mapped by `ADR-IMP-0008`; they are not alternate state
values.

## Transitions

The transition matrix is implemented only by `MissionLifecycle` and mirrors
`BBAPLT-GDE-013`. No application use case or adapter may write status directly.

## Stability boundary

`ADR-IMP-0009` makes the lifecycle contract durable across future Epics:

- Governance controls existing transitions but cannot add states;
- Workflow orchestrates existing commands and events but cannot define or
  mutate lifecycle meaning;
- Publication consumes Mission context but cannot transition Mission as a side
  effect;
- a new state requires an upstream normative Domain change, local ADR,
  compatibility analysis, traceability, and a new implementation gate.

Key paths include:

```text
PROPOSED → AUTHORIZED → PREPARED → IN_PROGRESS
IN_PROGRESS → UNDER_REVIEW → OUTCOME_DECISION → CLOSED_WITH_LEARNING
AUTHORIZED | PREPARED | IN_PROGRESS → PAUSED
PAUSED → PREPARED | IN_PROGRESS | DEFERRED | STOPPED
```

Exceptional `DEFERRED`, `REJECTED`, `STOPPED`, and governed reopen transitions
remain explicit.

## Accepted commands

- create, rename, and update description;
- authorize, prepare, activate, pause, and resume;
- submit for review and begin outcome decision;
- complete, cancel/stop, defer, reject, reopen, and archive;
- register Evidence and register Lineage.

## Emitted events

- `MissionCreated`, `MissionRenamed`, `MissionDescriptionUpdated`;
- `MissionAuthorized`, `MissionPrepared`, `MissionActivated`;
- `MissionPaused`, `MissionResumed`, `MissionReviewStarted`;
- `MissionOutcomeDecisionStarted`, `MissionCompleted`;
- `MissionCancelled`, `MissionDeferred`, `MissionRejected`, `MissionReopened`;
- `MissionArchived`, `MissionEvidenceRegistered`, `MissionLineageRegistered`.

Events carry MissionId, TenantId, occurredAt, Version, type, and structured
payload. Event dispatch and durable event storage are deferred.

## Public API do módulo

`core/src/modules/mission/domain/index.ts` exports the Aggregate, commands,
events, lifecycle, statuses, value objects, snapshot, and rehydration contracts.

`core/src/modules/mission/application/index.ts` exports CreateMission,
RenameMission, ActivateMission, CompleteMission, and MissionNotFoundError.

`core/src/modules/mission/ports/index.ts` exports MissionRepository. The root
Mission barrel intentionally excludes the infrastructure adapter;
`InMemoryMissionRepository` is available only from its infrastructure barrel.

Internal event ID generation, transition maps, snapshot reconstruction helpers,
and application loading coordination are not public contracts.

## Repository contract

MissionRepository supports optimistic `save`, Tenant-scoped `findById`, and
Tenant-scoped `exists`. The in-memory adapter stores detached snapshots,
rehydrates Aggregates on read, rejects stale Versions, and refuses cross-Tenant
identity access.

## Serialization

MissionSnapshot schema version `1` contains identity, Tenant, canonical state,
metadata, intent, Version, Evidence, Lineage, outcome, pause origin, status
reason, and archive timestamp. Serialization sorts object keys deterministically.
Unsupported schema versions fail visibly.

## Permitted dependencies

- Shared Kernel identity, aggregate, event, time, Version, Evidence, Lineage,
  error, and serialization primitives;
- Mission-owned domain, application, port, and adapter modules.

## Prohibited dependencies

- `demo/` and legacy `src/`;
- Human Governance and Authority implementations;
- AI Workforce and Assignments;
- Institutional Assets and Knowledge;
- Workflow, Publication, and Connector contexts;
- HTTP, database, ORM, authentication, authorization, and frontend frameworks.

## Validation

- creation and invariant tests;
- lifecycle, command, event, Evidence, Lineage, and Version tests;
- repository contract and optimistic concurrency tests;
- deterministic snapshot and reconstruction tests;
- application use-case tests;
- architecture boundary tests;
- `pnpm --dir core check`.

## Deferred concerns

Institutional Authority validation and decision ownership are deferred to
EPIC-IMP-003. Production persistence remains deferred to EPIC-IMP-011. HTTP API,
authentication, authorization, and runtime observability remain outside this
contract.
