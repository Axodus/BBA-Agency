# Active Development Workspace Boundaries

Effective date: September 3, 2026

## Responsibilities

| Area | Responsibility | Runtime state |
| --- | --- | --- |
| apps/web | BBA Publisher application UI | Active Vercel deployment surface |
| apps/api | Private, transitional Publisher API runtime | Active Railway/container surface |
| packages/publisher-prototype | Current Publisher domain implementation | Used by the active API; not a Core vertical |
| transport/agency-runtime | HTTP runtime composition for the Publisher API | Used by apps/api |
| contracts/agency | Contract for the private Publisher API | Active |
| core | Canonical BBA Platform application boundary | Planned API path; no server mounted |
| transport/http | Canonical HTTP adapter for Core | Planned API path; no host mounted |
| contracts/openapi | Canonical Platform HTTP contract | Planned API path |
| .rag/development | Current implementation controls and evidence | Active governed documentation |
| .rag/adr | Durable local implementation decisions | Active governed documentation |

## Deployment boundary

Vercel keeps repository root as Root Directory and builds apps/web through
vercel.json. Railway/container builders run the root build and start commands,
which resolve to apps/api. No change to Railway or Vercel configuration is
implied by this document.

## Dependency policy

| Dependency | Status |
| --- | --- |
| apps/web -> private API secrets or MongoDB credentials | PROHIBITED |
| apps/api -> core HTTP host | Not implemented |
| core -> apps/api, apps/web, Publisher runtime, database driver, or external Connector | PROHIBITED without approved adaptation |
| transport/http -> contracts/openapi | Intended canonical direction |
| transport/agency-runtime -> contracts/agency | Active direction |
| publisher-prototype -> core | Deferred; requires a separate adaptation initiative |

## Archived surfaces

The legacy deterministic demo, prior src/ experiments, memory compose stack,
and root artifacts were removed from the active workspace on September 3, 2026.
They remain recoverable from archive/dev-legacy-demo-src-2026-09-03. Historical
records in .rag/plans may still refer to those surfaces; that is context, not a
current implementation dependency.

## Non-regression rule

The active workspace must pass pnpm workspace:check. New work must not recreate
archived root surfaces or root scripts that target them. A later
publisher-prototype to Core integration must be planned and validated
independently; it is outside this workspace cleanup.
