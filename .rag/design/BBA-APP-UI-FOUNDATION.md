# BBA App UI Foundation

Status: implemented as the active frontend-only application surface with controlled local data.

## Purpose

This foundation defines the visual and structural contract for BBA application surfaces. It does not represent backend integration, authentication, a configured Connector, or external publication capability.

The reference implementation is available at the application root (`/`). The previous `/foundation/*` paths resolve to canonical app surfaces. Controlled local Publisher reference routes remain reachable inside the same persistent App Shell to preserve deterministic behavior and existing deep links; they are not a separate deployment strategy and do not add credential entry, Connector configuration, or external-publication flow.

## Design principles

1. AI executes; humans govern.
2. Canonical lineage remains visible wherever a derived object is reviewed.
3. State, failure, blocking reason, and pending Steward decisions are explicit.
4. Distribution Package means a prepared set of artifacts, not external publication.
5. Interfaces use local fixtures until an explicit adaptation contract exists.

## Visual tokens

The shared tokens live in `packages/ui/src/styles.css`; the composed application foundation lives in `apps/web/src/design-system/foundation/foundation.css`.

| Family | Contract |
| --- | --- |
| Color | Warm paper background, near-black ink, institutional blue accent, semantic state colors |
| Typography | Editorial serif for product hierarchy; neutral sans-serif for operations and metadata |
| Spacing | 4px base progression with denser metadata and roomier editorial sections |
| Radius | Mostly square institutional surfaces; small radii only for controls, tags, and focus affordances |
| Elevation | Borders define hierarchy; shadow is reserved for overlays and temporary navigation |
| Motion | Short state transitions; reduced-motion preference disables non-essential motion |

### Canonical theme behavior

The active BBA application theme is light-only: warm paper surfaces, near-black ink, institutional blue actions, and semantic state colors. The UI must not switch automatically from the operating-system color preference, and legacy browser theme preferences are discarded during bootstrap. Dark and system themes are not part of the current design contract; introducing either requires a separately reviewed token set, contrast audit, and reference comparison.

## Semantic states

| State | Meaning | Typical use |
| --- | --- | --- |
| `neutral` | No active transition | Not started, not constituted, or blocked by upstream lineage |
| `running` | Work is executing | AI Workforce contribution in progress |
| `awaiting` | Human decision required | Institutional Asset in Steward review |
| `approved` | Explicit governance approval | Approved object or completed controlled contribution |
| `rejected` | Explicit human rejection | Object returned or stopped by Steward |
| `failed` | Execution did not complete | Connector, loading, or operation failure |
| `attention` | Review recommended | Policy finding or approaching constraint |

Color is never the only signal: each status combines a marker and readable label.

## Shared UI SDK

`@bba/ui` exposes endpoint-independent primitives:

- Button variants: primary, secondary, ghost, and danger.
- Fields: Input, Textarea, Select, Checkbox, Field hint/error association.
- State and feedback: StatusBadge, Feedback, Alert, EmptyState, Skeleton, Spinner.
- Structure: Panel, Card, Table, Tabs, and the reusable Lineage rail.
- Overlays: Modal, Drawer, ConfirmationDialog with managed focus.
- Navigation: Link, NavLink, SkipLink.

Components receive display data and event callbacks. They do not import API clients, runtime configuration, or domain transport types. Semantic-state tokens are shared in `@bba/ui`; application surfaces do not define a competing color contract.

## App Shell contract

The persistent shell provides:

- primary navigation for Visão geral, Missões, Institutional Assets, Distribution Packages, Governança, and Instituição;
- system navigation for Conta, Configurações, and UI Kit;
- institution context;
- Steward identity placeholder without implementing authentication;
- responsive mobile navigation and a keyboard skip link;
- a consistent main content region for global feedback and route-level states.

## Active route adoption

The active app routes use one persistent App Shell and the shared `@bba/ui` tokens:

- `/` — overview with Mission focus, pending Steward decisions, lineage and semantic-state legend;
- `/missions/:missionId` — Mission Workspace with Human Governance, AI Workforce, controlled sources and Audit Record;
- `/institutional-assets`, `/distribution-packages`, `/governance` and `/institution` — controlled records, semantic state, empty, loading, failed and blocked patterns;
- `/account` — Steward profile and prepared permissions only;
- `/settings` — local interface, governance-readonly and notification preferences only;
- `/ui-kit` — the shared component and accessibility reference.

No canonical app route accepts access tokens, provider credentials, tenant configuration, private endpoints, Connector settings or publication instructions. Former credential and technical-diagnostics deep links redirect to the canonical Settings and Institution surfaces. The existing deterministic Publisher reference remains controlled local data with its stated limits and does not establish external-publication capability.

## Canonical patterns

Every Mission-derived surface can compose:

`Mission → Institutional Asset → Channel Variant → Distribution Package`

Required display fields are type, canonical ID, readable label, semantic state, and lock state when an upstream decision prevents derivation.

Audit Record entries require timestamp, actor, action, and object ID. They are chronological records, not decorative activity feeds.

## Mission Workspace

The Mission Workspace is the reference screen. It includes Mission identity and objective, Human Governance direction, AI Workforce contributions, related sources, pending Steward decisions, canonical lineage, Audit Record, controlled local states, and an explicit external-publication boundary.

The decision interaction updates only local demonstration state. A future integration must persist the decision through an approved contract and append a server-issued Audit Record without weakening visible failure handling.

## Accounting and settings

“Accounting” is treated as the user/account domain, not financial billing. The current foundation includes Steward profile and prepared permission visibility under Conta. Authentication, billing, invoices, entitlements, and payment processing are out of scope.

Configurações contains local interface, governance, and notification preferences. It must not expose secrets, database credentials, private endpoints, or Connector tokens to the browser bundle.

## Accessibility contract

- Keyboard-visible focus for all interactive elements.
- Skip link to the main region.
- Native labels and field descriptions/errors.
- Semantic tables, headings, lists, fieldsets, dialogs, and live feedback roles.
- No state communicated by color alone.
- Responsive reflow without hiding primary content.
- Reduced-motion support.
- Target WCAG AA contrast for text and controls.

## Extension points

Future surfaces should compose the shared primitives and canonical patterns, then inject typed view data through props. API adapters belong outside `packages/ui` and outside the foundation fixtures. `apps/web` must remain independent of `core` and `transport/http` until an executable Core HTTP host and an explicit frontend integration contract exist.

Connector configuration and publication flows require separate authorization and implementation. A successful Distribution Package state must never be rendered as published unless a configured Connector reports success and the corresponding Audit Record exists.
