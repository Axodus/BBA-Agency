# UI Foundation Verification — 2026-09-06

## Scope

This verification covers the active BBA App UI Foundation on `dev`: the Design System / UI SDK, shared App Shell, and Mission Workspace. The active Web application is `apps/web`; the private Publisher runtime remains `apps/api` plus `transport/agency-runtime` and is not integrated with Core.

## Implemented

- `@bba/ui` owns reusable tokens and primitives for typography, color, spacing, borders, elevation, focus, reduced motion, forms, tables, dialogs, feedback, empty states, loading, and lineage.
- The shared semantic-state contract is `neutral`, `running`, `awaiting`, `approved`, `rejected`, `blocked`, `failed`, and `attention`. Labels and markers distinguish the states without relying only on color.
- `@bba/app-shell` composes the active App Shell: global navigation, active route treatment, responsive drawer navigation, skip link, focused main landmark after navigation, institutional context, and disabled controls for unavailable integrations.
- The Web application supplies the BBA navigation and context to `@bba/app-shell`; it no longer owns the App Shell composition.
- Mission Workspace presents the Mission, Steward, AI Workforce, Human Governance, Institutional Asset, visible lineage, and Audit Record. It supports a session-local governance decision, preserves the selected decision and note in browser session storage, updates the local Audit Record, and locks the demonstrated decision after recording.
- The workspace handles an unknown Mission route and malformed or unavailable session storage visibly. It does not claim a persisted server decision when local storage fails.
- Distribution is explicitly preparation. Channel Variants and Distribution Packages remain blocked in the local reference. No UI action claims external publication; publication requires a configured Connector and recorded success.

## Tested

| Validation | Result |
| --- | --- |
| `pnpm workspace:check` | Passed: active workspace boundary check |
| `pnpm contracts:check` | Passed: 74 canonical operations and 10 private Agency operations |
| `pnpm api:check` | Passed: API typecheck, tests, lint, format, and build |
| `pnpm --filter @bba/platform-core check` | Passed: 168 Core tests and architecture checks |
| `pnpm --filter @bba/sdk-react test` | Passed: 17 tests |
| `pnpm --filter @bba/ui check` | Passed: 2 tests, typecheck, lint, and format |
| `pnpm --filter @bba/app-shell check` | Passed: 2 tests, typecheck, lint, and format |
| `pnpm --filter @bba/web test` | Passed: 25 tests |
| `pnpm web:build` | Passed: CSS, TypeScript, Vite, and private-value bundle inspection; JS 141097 bytes gzip, CSS 13263 bytes gzip |
| `pnpm --filter @bba/web test:browser` | Passed: 24 Playwright tests |
| Frontend boundaries and Agency language | Passed |

## Demonstrated with local data

- Playwright captures 44 screenshots at 1440x900, 1280x800, 768x1024, and 390x844 in `.rag/evidence/BBA-APP-UI-FOUNDATION/latest/`.
- Evidence covers `/`, `/missions`, `/missions/msn-024`, `/institutional-assets`, `/distribution-packages`, `/governance`, `/institution`, `/account`, `/settings`, `/ui-kit`, and the governance dialog.
- Browser coverage confirms keyboard navigation, arrow-key tabs, dialog focus restoration, local-decision restoration, controlled storage failures, no horizontal overflow, absence of page errors and console errors, and contrast of the shared semantic-state labels.
- Manual visual review covered desktop, tablet, mobile, and the mobile governance dialog. The narrow Mission table remains scrollable horizontally and is keyboard-focusable.

## Limitations and planned integration

- All Foundation data is local reference data. The session-local governance decision is not a server Audit Record and does not survive browser-session clearing.
- Authentication, authorization, institution switching, notification delivery, Audit Record export, record creation, persistent preferences, and external Connectors are not implemented.
- The private Publisher runtime remains independent of Core. The Publisher-to-Core adaptation contract, compatibility tests, and migration plan for the ten private endpoints remain planned.

## Gate outcome

No P0 or P1 finding remains in the verified Design System / UI SDK, App Shell, or Mission Workspace scope. P2 follow-up: replace the narrow-table horizontal scroll with a responsive semantic card representation if the Mission contract expands beyond its current four columns. The screenshot files are generated evidence and remain untracked until the review process decides whether binary artifacts belong in Git.
