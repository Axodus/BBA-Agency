# ADR-IMP-0006 — Native node:test

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

M0 requires typecheck, tests, lint, and format check without adding a test
framework unnecessarily.

## Normative sources

- REQ: `REQ-IMP-000-019`, `REQ-IMP-000-020`, `REQ-IMP-000-021`
- `BBAPLT-GDE-080-QUALITY-AND-CONTRIBUTION-GATES.md`
- `BBAPLT-GDE-085-BACKEND-RUNTIME-QUALITY-CONTRACTS.md`

## Decision

The Core uses Node's built-in `node:test` runner. Tests are TypeScript source
compiled to ignored `.tmp/test` output and executed by Node. M0 uses small
deterministic native quality scripts for lint and format checks rather than
adding ESLint, Prettier, or another framework dependency.

The test taxonomy is unit, architecture, contract, integration, and recovery;
only smoke and architecture tests are in scope for M0.

## Consequences

The initial toolchain has few dependencies and clear failure output. Richer
coverage reporting or a specialized framework requires a future ADR if it
becomes necessary.

## Validation

`pnpm --dir core test`, `lint`, `format:check`, and `architecture` are the M0
commands; CI invokes the same commands.
