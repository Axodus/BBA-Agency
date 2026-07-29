# ADR-IMP-0001 — Core Isolation

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The repository contains a deterministic reference demo and legacy campaign
experiments. Neither is the certified implementation base for the BBA
Platform Core.

## Normative sources

- REQ: `REQ-IMP-000-002`, `REQ-IMP-000-003`, `REQ-IMP-000-005`
- `BBA-ADR-0001-DOCUMENTATION-AS-SOURCE-OF-TRUTH.md`
- `BBAPLT-GDE-081-BACKEND-BOUNDARY-AND-RESPONSIBILITIES.md`

## Decision

The new Core lives in `core/`. Executable Core code must not import or alias
`demo/` or `src/`. The demo and legacy source remain preserved. Migration or
sharing requires a future REQ with explicit contracts and evidence.

## Alternatives considered

- `src/core/`: rejected because it would place the Core beside legacy modules.
- `packages/core/`: deferred because a multi-package distribution boundary is
  unnecessary for this bootstrap.
- Reusing demo modules: rejected because the demo is a bounded reference
  implementation, not a domain implementation.

## Consequences

The boundary is easy to inspect and test, but some code may be duplicated
until a governed shared contract is approved. The boundary test is a local
architecture control and must evolve with alias configuration.

## Invariant impact

Tenant, Authority, Asset identity, Lineage, and Evidence remain unimplemented
in M0 but are not constrained by legacy assumptions.

## Validation

`core/tools/check-core-boundaries.mjs` and
`core/test/architecture/core-isolation.test.ts` provide executable evidence.
