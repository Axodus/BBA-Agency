# BBA App UI Foundation — Design QA

Date: 2026-09-04

## Scope

The active `apps/web` application uses the BBA App UI Foundation at `/`. The review covers the persistent App Shell, Mission Workspace, Institutional Assets, Distribution Packages, Governance, Institution, Account, Settings, UI Kit, semantic states, empty/loading/blocked/failed states, tables, forms, dialogs, keyboard navigation, and responsive layouts.

## Canonical direction

- Warm paper surfaces, near-black editorial hierarchy and institutional blue accent are sourced from `@bba/ui` tokens.
- The active theme is light-only. Operating-system color preference and legacy browser theme storage cannot replace the approved palette; dark and system themes require a separately reviewed token and contrast contract.
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
| Shared UI component tests | Blocked by environment | A regression test covers clearing legacy dark preference and retaining the light theme. Current TypeScript/Vitest workers stalled in the mounted workspace without reporting a code failure. |
| Web focused tests | Blocked by environment | Vitest started but stalled before reporting cases; no assertion failure was emitted. |
| Desktop and mobile Playwright | Blocked by sandbox | Playwright could not start the preview server because binding `127.0.0.1:4173` returned `EPERM`. No fresh screenshots were claimed. |
| `pnpm web:build` | Blocked by mounted filesystem | CSS structure passed, then the TypeScript stage stalled without reporting a compiler error. The process was terminated and is not claimed as passed. |
| `pnpm workspace:check` | Passed | Active workspace boundary check passed. |
| `pnpm contracts:check` | Passed | Canonical OpenAPI passed with 74 operations; Agency contract passed with 10 operations. |
| Lint | Passed | Focused lint check passed for the changed UI, App Shell, and web source paths. |
| Canonical-theme static scan | Passed | No system/dark bootstrap, selector option, or dark token override remains in the active UI paths. |

Final result: blocked by local filesystem validation. Do not mark as passed until `pnpm web:build` completes and fresh desktop/mobile screenshots are compared with the approved light reference.
