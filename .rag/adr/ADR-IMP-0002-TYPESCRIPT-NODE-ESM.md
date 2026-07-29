# ADR-IMP-0002 — TypeScript, Node.js and ESM

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The existing root package is CommonJS and targets legacy `src/`. The new Core
needs an explicit runtime boundary without forcing a repository-wide migration.

## Normative sources

- REQ: `REQ-IMP-000-015`, `REQ-IMP-000-020`, `REQ-IMP-000-021`
- `BBAPLT-GDE-096-RUNTIME-AND-ENVIRONMENT-BOUNDARIES.md`
- `BBAPLT-GDE-098-BUILD-AND-DELIVERY-BOUNDARIES.md`

## Decision

The Core uses TypeScript `6.0.3`, Node.js `24.14.1` as the M0 validation
baseline, ESM via `"type": "module"`, strict compiler settings, and pnpm
`11.1.2`. The Core owns its `tsconfig.json`; root CommonJS configuration is
preserved.

Source maps are enabled for the test compilation output. No production build
artifact is required in M0; the test compilation writes only to ignored
`core/.tmp/`.

## Alternatives considered

- CommonJS: rejected for the new Core because it would couple the boundary to
  the legacy root module system.
- Runtime-agnostic contracts: rejected for M0 because executable CI requires a
  reproducible runtime.

## Consequences

Explicit `.js` import specifiers are required in TypeScript source. The root
package remains independently compatible, but cross-package tooling must
respect separate module boundaries.

## Validation

`pnpm --dir core typecheck` and `pnpm --dir core test` validate the baseline.
