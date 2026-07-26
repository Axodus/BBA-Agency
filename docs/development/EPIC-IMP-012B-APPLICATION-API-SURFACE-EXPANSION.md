# EPIC-IMP-012B — Application API Surface Expansion

Status: INCREMENTAL — B.2 AI WORKFORCE PASS
Origin: M12 corrective scope decision  
Dependency: EPIC-IMP-012 = PASS

## Objective

Expand the transport-neutral Application API incrementally, bounded context by
bounded context, only when an institutional consumer requires an operation.

## Backlog input

`core/tools/inventory-application-exports.mjs` reports application use cases
available in the modules. An exported use case is a capability, not an
automatic public API contract.

For every selected operation, a future requirement must define:

- the public Command or Query DTO;
- the API Port method;
- required collaborators;
- transaction and idempotency behavior;
- committed resource references;
- read model;
- tests and traceability.

No operation is approved merely because it is exported by a module.

## Initial candidates

- Human Governance;
- AI Workforce;
- Institutional Assets;
- Knowledge and Policy;
- Workflow;
- Review;
- Publication;
- Connector.

The ordering and exact methods remain subject to institutional demand and a
separate Definition of Ready review.

## B.1 — Governance Application API

Status: PASS
Date: 2026-07-23

This increment exposes only the Governance operations explicitly declared by
the public Application API. It does not expand the inventory into an automatic
public-surface gate and does not alter Domain, Governance Aggregates, existing
use-case semantics, M11 persistence, `demo/`, or legacy `src/`.

| API Port | Operation | Kind | Existing use case / read capability | Status |
| --- | --- | --- | --- | --- |
| GovernanceCommandApiPort | `createAuthority` | Command | `CreateAuthority` | EXECUTABLE |
| GovernanceCommandApiPort | `assignAuthority` | Command | `AssignAuthority` | EXECUTABLE |
| GovernanceCommandApiPort | `createDecision` | Command | `CreateDecision` | EXECUTABLE |
| GovernanceCommandApiPort | `approveDecision` | Command | `ApproveDecision` | EXECUTABLE |
| GovernanceCommandApiPort | `rejectDecision` | Command | `RejectDecision` | EXECUTABLE |
| GovernanceCommandApiPort | `finalizeDecision` | Command | `FinalizeDecision` | EXECUTABLE |
| GovernanceQueryApiPort | `getAuthority` | Query | `AuthorityRepository.findById` | EXECUTABLE |
| GovernanceQueryApiPort | `getDecision` | Query | `DecisionRepository.findById` | EXECUTABLE |

Commands use the approved M12 transaction pipeline and return the uniform
`CommittedOperationResultDto`. Replay consults the M11 transaction outcome,
validates the canonical fingerprint, and returns the same resource-reference
result without executing the handler again. Queries use only
`ReadRepositorySession` and return read projections without snapshots, events,
Evidence, Lineage, or provider records.

The M12 session composition is extended additively with typed Authority and
Decision repository views. Both use the existing provider-backed M11 adapters
and the same Unit of Work; no new persistence mechanism, collaborator fallback,
or permissive adapter was introduced.

## Coverage

| Bounded Context | Commands | Queries | Coverage |
| --- | ---: | ---: | --- |
| Mission | 4 / 4 | 1 / 1 | 100% |
| Governance | 6 / 6 | 2 / 2 | 100% |
| AI Workforce | 4 / 4 | 2 / 2 | 100% |
| Institutional Assets | Not Started | Not Started | Not Started |
| Knowledge/Policy | Not Started | Not Started | Not Started |
| Workflow | Not Started | Not Started | Not Started |
| Review | Not Started | Not Started | Not Started |
| Publication | Not Started | Not Started | Not Started |
| Connector | Not Started | Not Started | Not Started |

## Evidence

`core/test/application/governance-application-api.test.ts` proves binding for
every declared Governance method, the use-case path, a single successful
commit, rollback on stale optimistic concurrency, validation before Unit of
Work opening, idempotent replay without a second audit record, and read-only
queries. Core validation is recorded in the B.1 completion evidence.

| Command | Result |
| --- | --- |
| `pnpm --dir core check` | PASS |
| `git diff --check` | PASS |
| deterministic demo syntax and JSON checks | PASS |
| local commits | BLOCKED — `.git/index.lock` is on a read-only filesystem |

```text
EPIC-IMP-012B.1 — Governance: PASS

Mission: 100%
Governance: 100%

AI Workforce: Not Started
Institutional Assets: Not Started
Knowledge/Policy: Not Started
Workflow: Not Started
Review: Not Started
Publication: Not Started
Connector: Not Started

```

## B.2 — AI Workforce Application API

Status: PASS
Date: 2026-07-23

This increment exposes only the four AI Workforce Commands and two Queries
declared for this sprint. Commands use the existing M12 transaction pipeline
and the generic confirmed replay path; no AI-specific replay resolver
reconstructs Agent or Execution details. Queries use only the typed
`ReadRepositorySession` views.

`GovernanceWorkAuthorizationPort` is a mandatory composition dependency with no
permissive fallback. `assignAgent` preserves the existing coordinator
authorization semantics inside the Unit of Work. `startExecution` uses one
Unit of Work for the Agent mutation and Execution creation, followed by one
commit and one audit/outbox sequence.

| API Port | Operation | Kind | Existing use case / read capability | Status |
| --- | --- | --- | --- | --- |
| AIWorkforceCommandApiPort | `provisionAgent` | Command | `provisionAgent` | EXECUTABLE |
| AIWorkforceCommandApiPort | `assignAgent` | Command | `AIWorkCoordinator.assign` | EXECUTABLE |
| AIWorkforceCommandApiPort | `startExecution` | Command | `AIWorkCoordinator.start` | EXECUTABLE |
| AIWorkforceCommandApiPort | `completeExecution` | Command | `completeExecution` | EXECUTABLE |
| AIWorkforceQueryApiPort | `getAgent` | Query | `AgentRepository.findById` | EXECUTABLE |
| AIWorkforceQueryApiPort | `getExecution` | Query | `ExecutionRepository.findById` | EXECUTABLE |

Evidence is recorded in `core/test/application/ai-workforce-application-api.test.ts`.
The test covers bindings, DTO mapping and validation, authorization rejection,
single transaction behavior, atomic Agent/Execution start, generic replay,
read-only projections and context propagation. Domain, M11, `demo/` and
legacy `src/` remain unchanged.
