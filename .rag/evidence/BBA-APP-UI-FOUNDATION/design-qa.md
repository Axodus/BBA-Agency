# BBA App UI Foundation — Design QA

Date: 2026-09-03

## Scope

The active `apps/web` application uses the BBA App UI Foundation at `/`. The review covers the persistent App Shell, Mission Workspace, Institutional Assets, Distribution Packages, Governance, Institution, Account, Settings, UI Kit, semantic states, empty/loading/blocked/failed states, tables, forms, dialogs, keyboard navigation, and responsive layouts.

## Canonical direction

- Warm paper surfaces, near-black editorial hierarchy and institutional blue accent are sourced from `@bba/ui` tokens.
- Operational metadata uses compact sans-serif type; product hierarchy uses the editorial serif.
- Borders define hierarchy; shadows are reserved for overlays; controls and panels retain mostly square geometry.
- The visible lineage is `Mission → Institutional Asset → Channel Variant → Distribution Package`.
- Human Governance, Steward decisions, AI Workforce contributions and Audit Record entries remain separate patterns.
- Distribution Packages are explicitly preparation states. The UI does not claim external publication.

## Evidence plan

Playwright writes current desktop and mobile screenshots to `latest/desktop/` and `latest/mobile/` for the overview, Mission Workspace, each core surface, account/settings/UI Kit, and the governance dialog. The existing selected reference and initial Mission Workspace captures remain the visual direction reference.

## Validation

| Check | Result | Notes |
| --- | --- | --- |
| Shared UI component tests | Blocked by environment | `@bba/ui` typecheck passed. Vitest could not start a worker in the mounted workspace (`Timeout waiting for worker to respond`). |
| Web focused tests | Blocked by environment | Vitest started but stalled before reporting cases; no assertion failure was emitted. |
| Desktop and mobile Playwright | Blocked by sandbox | Playwright could not start the preview server because binding `127.0.0.1:4173` returned `EPERM`. No fresh screenshots were claimed. |
| `pnpm web:build` | Blocked by pnpm environment | Pnpm stopped before scripts with `ERR_SQLITE_ERROR: unable to open database file`. Direct Vite production build passed to `/tmp/bba-web-dist`: 4,655 modules, JS 140,068 bytes gzip, CSS 13,305 bytes gzip. |
| `pnpm workspace:check` | Passed via direct validator | `node tools/check-active-workspace.mjs` passed. The pnpm wrapper was blocked before script execution by the same SQLite error. |
| `pnpm contracts:check` | Passed via direct validators | Canonical OpenAPI passed with 74 operations; Agency contract passed with 10 operations. The pnpm wrapper was blocked before script execution. |
| Browser boundary and private-value scan | Passed | Frontend boundary check, product acceptance invariant, and production bundle scan passed. |

Final result: blocked by local filesystem validation. Do not mark as passed until the required commands complete and fresh screenshots are reviewed.
