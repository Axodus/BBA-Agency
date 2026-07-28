# EPIC-IMP-012 — Application API Report

Date: 2026-07-23  
Milestone: `M12 - Persistent Core API`  
Status: `PASS`

## Decision

M12 concludes the transport-neutral Application infrastructure and the public
surface explicitly declared in `ApplicationApiPorts.ts`.

Module `application/index.ts` exports are available capabilities, not automatic
public API obligations. Their incremental exposure belongs to
`EPIC-IMP-012B — Application API Surface Expansion`.

## Public surface

| Context | Operation | Kind | Use case / capability | Status |
| --- | --- | --- | --- | --- |
| Mission | `createMission` | Command | `CreateMission` | EXECUTABLE |
| Mission | `activateMission` | Command | `ActivateMission` | EXECUTABLE |
| Mission | `renameMission` | Command | `RenameMission` | EXECUTABLE |
| Mission | `completeMission` | Command | `CompleteMission` | EXECUTABLE |
| Mission | `getMission` | Query | `MissionRepository.findById` | EXECUTABLE |

```text
Methods declared in ApplicationApiPorts.ts: 5
Methods with executable implementation: 5
Pending methods: 0
Public surface coverage: 100%
```

## Command result and replay

All public Commands return:

```text
CommittedOperationResultDto
- transactionId
- status: COMMITTED
- resourceReferences[]
```

The first execution and replay use the same response shape. A confirmed replay:

- checks the M11 transaction outcome and canonical fingerprint;
- does not execute the handler again;
- does not regenerate identity or timestamps;
- does not reconstruct an Aggregate;
- returns the confirmed Mission resource reference.

Detailed current state is retrieved by `getMission`.

## Validation evidence

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | Strict TypeScript compilation. |
| `pnpm --dir core test` | PASS | M0-M11 regression plus public Mission API tests. |
| `pnpm --dir core lint` | PASS | Quality lint. |
| `pnpm --dir core format:check` | PASS | Deterministic format. |
| `pnpm --dir core architecture` | PASS | No forbidden transport or repository-boundary imports. |
| `pnpm --dir core check` | PASS | Aggregate Core validation. |
| `git diff --check` | PASS | No whitespace errors. |
| deterministic demo checks | PASS | `demo/` unchanged. |
| local commit | BLOCKED | `.git/index.lock`: read-only filesystem. |

The API tests prove:

- all five declared methods have a concrete binding;
- Commands call the existing Mission use cases;
- successful Commands commit once;
- replay does not add another audit record;
- validation failure occurs before opening a Unit of Work;
- Queries use the read-only session and return the confirmed Mission DTO.

## Boundaries

- No HTTP, controller, OpenAPI, authentication or transport serializer exists.
- Commands require explicit Tenant, actor, correlation and idempotency context.
- Queries use a separate read-only repository session.
- Handlers do not receive commit, rollback, provider or store controls.
- Public errors do not expose stacks, Aggregates, full Commands, snapshots,
  provider internals or secrets.
- Domain, Aggregates and existing use cases remain semantically unchanged.
- `demo/` and legacy `src/` remain unchanged.
- No push, merge or release was performed.

The local commit attempt failed with:

```text
fatal: Unable to create '/opt/Axodus/BBA-Agency/.git/index.lock': Read-only file system
```

This environment limitation does not change the functional M12 validation, but
the worktree is not claimed as clean and no local commit hash is reported.

## Informational backlog

`core/tools/inventory-application-exports.mjs` remains available as an
informational report of module capabilities. Its counts are not an M12 gate.

Governance, AI Workforce, Institutional Assets, Knowledge/Policy, Workflow,
Review, Publication and Connector public operations are tracked by
`EPIC-IMP-012B`. They will be exposed only when an institutional consumer and a
complete operation contract exist.

## Gate

```text
EPIC-IMP-012: PASS
M12 - Persistent Core API: PASS
EPIC-IMP-012B: BACKLOG
```

M12 concludes the infrastructure and the explicitly declared public surface.
Exposure of remaining exported use cases belongs to EPIC-IMP-012B.
