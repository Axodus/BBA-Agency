# BBA Platform Core

This directory is the isolated implementation boundary for the BBA Platform Core.

It is intentionally independent from:

- `demo/`, the deterministic browser reference implementation;
- `src/`, preserved legacy experiments.

The Core currently contains bootstrap metadata and architecture checks only. It
does not yet implement Mission, Tenant, Governance, Workforce, Assets, APIs,
Connectors, persistence, authentication, or publication.

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

The first domain implementation must be authorized by EPIC-IMP-001 after the
M0 gate is marked PASS.
