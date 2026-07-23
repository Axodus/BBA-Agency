# EPIC-IMP-012 — Application API Report

Date: 2026-07-23  
Milestone: `M12 - Persistent Core API`  
Status: `PARTIAL`

## Summary

Added transport-neutral Application contracts for Commands and Queries across
Mission, Governance, AI Workforce, Institutional Assets, Knowledge/Policy,
Workflow, Review, Publication and Connector. Added explicit command/query
contexts, stable errors, SHA-256 canonical fingerprints, transaction identity
derivation, command runner, query runner and restricted repository sessions.
Existing module use cases and Aggregates remain unchanged.

Connector exposes only existing register/lifecycle/execution operations and
read queries; no new integration behavior was introduced.

## Validation

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | Strict TypeScript compilation. |
| `pnpm --dir core test` | PASS | Existing suite plus Application API tests. |
| `pnpm --dir core lint` | PASS | Quality lint. |
| `pnpm --dir core format:check` | PASS | Deterministic format. |
| `pnpm --dir core architecture` | PASS | No forbidden repository boundary imports. |
| `pnpm --dir core check` | PASS | Aggregate Core validation. |
| `git diff --check` | PASS | No whitespace errors. |
| demo checks | PASS | Demo unchanged. |

## Boundaries

- Commands require explicit Tenant, actor, correlation and idempotency context.
- Queries use a separate read-only session.
- Handlers do not receive provider, stores, commit or rollback controls.
- Public errors do not expose stack traces, Aggregates, full Commands,
  snapshots, provider internals or secrets.
- `demo/` preserved: yes.
- `src/` preserved: yes.

## Limitations

- No HTTP, controllers, OpenAPI, authentication, authorization transport,
  database, Outbox dispatcher or distributed retry was added.
- Domain-specific external adapters remain responsible for wiring each
  context's existing use cases into the typed ports.

## Decision

`EPIC-IMP-012: PARTIAL`  
`M12 - Persistent Core API: NOT_READY`

The typed ports, pipeline and persistence bridge are implemented. Context-specific
handler wiring and DTO mappers for every existing module use case remain required
before M12 can be marked PASS. EPIC-IMP-013 must not start until that wiring and
its integration tests are complete.
