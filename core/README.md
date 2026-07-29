# BBA Platform Core

This directory is the isolated implementation boundary for the BBA Platform Core.

It is intentionally independent from:

- `demo/`, the deterministic browser reference implementation;
- `src/`, preserved legacy experiments.

The Core now contains the Shared Kernel, Tenant Context, and Mission Aggregate
foundations. It does not yet implement Human Governance, AI Workforce,
Institutional Assets, APIs, Connectors, production persistence, authentication,
authorization, or publication.

## Toolchain

- Node.js `24.14.1` baseline used for M0 validation;
- pnpm `11.1.2`;
- TypeScript `6.0.3`;
- native `node:test`;
- ESM with strict TypeScript settings.

## Commands

From the repository root:

```bash
pnpm --dir core typecheck
pnpm --dir core test
pnpm --dir core lint
pnpm --dir core format:check
pnpm --dir core architecture
pnpm --dir core check
```

Mission implementation is governed by EPIC-IMP-002 and the canonical Mission
State Model. Full Human Governance and authority resolution remain assigned to
EPIC-IMP-003.
