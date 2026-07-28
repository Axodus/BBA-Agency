# Architecture Baseline

Baseline: `M0 — Repository Ready`
Version: `1.0`
Status: `IMMUTABLE_BASELINE`
Established: `2026-07-22`

## Meaning

M0 establishes the repository and implementation boundaries for the BBA
Platform Core. It does not claim that any domain aggregate or production
capability is implemented.

The baseline includes:

- isolated `core/` workspace;
- preserved `demo/` reference implementation;
- preserved `src/` legacy experiments;
- TypeScript + Node.js + ESM + pnpm + native `node:test`;
- modular monolith and Ports and Adapters direction;
- in-memory repositories before persistence selection;
- Development source index, traceability, ADR and quality gates;
- automated Core boundary validation.

## Change policy

Any structural change to these decisions, dependency direction, module
boundary, runtime, persistence strategy, test foundation, or Core/demo/legacy
relationship requires an accepted local ADR before implementation. Domain
meaning remains subordinate to the certified Documentation corpus and cannot
be changed by a local ADR.

The baseline is an internal architecture marker, not a Git tag, release, or
production-readiness statement.
