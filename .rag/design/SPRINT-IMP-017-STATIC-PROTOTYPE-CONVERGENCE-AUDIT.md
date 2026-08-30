# SPRINT-IMP-017 Static–Prototype Convergence Audit

Status: `PASS`

Audit baseline: `dev` at `6bc6ef9`

Implementation branch: `feat/sprint-imp-017-agency-visual-convergence`

Visual authority: `static/` and the approved `bba.country` composition

Functional authority: `apps/web/src/static-publisher/`

## Scope and method

This audit compares the standalone static reference with the deterministic, navigable Publisher prototype. It inspects source, routes, fixtures, state transitions, unit tests, E2E journeys, responsive CSS, and the existing REQ-IMP-016 evidence. It does not claim a live comparison with `dev.bba.country`, which is access-controlled, or fresh browser evidence before dependencies and browser automation run successfully.

The target is structural convergence: the prototype keeps its validated Publisher behavior while adopting the Agency-first hierarchy, editorial composition, and human-governed product language of the static reference.

## Divergence matrix

| Dimension | Static reference | Prototype baseline | Classification | Required action |
| --- | --- | --- | --- | --- |
| Brand expression | Agency-first, editorial | Agency-first in the active static Publisher surface | `MINOR_VARIANCE` | Consolidate shared brand components and tokens. |
| Typography | Serif display with compact sans supporting text | Equivalent hierarchy, implemented directly in app CSS | `MINOR_VARIANCE` | Extract canonical typography tokens. |
| Color system | Paper, ink, blue, restrained semantic accents | Equivalent values, locally declared | `MINOR_VARIANCE` | Move values into one canonical foundation. |
| Navigation | Agency, services, projects, outcomes | Home, Publisher, Projects, AI Models | `STRUCTURAL_VARIANCE` | Use Services and Deliveries as primary product destinations; keep diagnostics secondary. |
| Page width | Wide editorial sections | Editorial pages and constrained reading areas | `MATCH` | Preserve and tokenize widths. |
| Spacing | Spacious editorial rhythm | Largely aligned but monolithic | `MINOR_VARIANCE` | Tokenize page and section rhythm. |
| Cards | Service/outcome-led | Service, Project, finding, and delivery compositions exist | `MATCH` | Reuse; avoid generic nested cards. |
| Buttons | Strong primary action plus restrained links | Multiple locally styled patterns | `MINOR_VARIANCE` | Consolidate focus, size, and hierarchy. |
| Status representation | Human-readable | Customer-facing visible stages plus secondary technical details | `MATCH` | Add explicit regression assertions. |
| Public Home | Approved Agency proposition | Agency proposition and five disciplines are present | `MINOR_VARIANCE` | Add final CTA/footer continuity and route-aware Services. |
| Authenticated Home | Agency engagement hierarchy | Single prototype Home combines entry and active Project access | `MISSING_IN_PROTOTYPE` | Recompose the Home with in-progress, awaiting-decision, and delivery groups without real auth. |
| Services | Five disciplines, Publisher one service | Five services shown; Publisher alone is available | `MINOR_VARIANCE` | Add Services catalog route and retain honest planned states. |
| Project list | Not defined in static | Editorial engagement rows | `MISSING_IN_STATIC` | Keep functional composition using Agency foundations. |
| Project wizard | Not defined in static | Seven-step editorial wizard | `MISSING_IN_STATIC` | Keep behavior; consolidate fields, stepper, mobile progress, and confirmation hierarchy. |
| Project Workspace | Not defined in static | Full Context–Delivery workspace | `MISSING_IN_STATIC` | Keep behavior; use Agency header, narrative stages, editorial documents, and secondary technical detail. |
| Editorial Core | Not defined in static | Editorial artifact with claims, evidence, approval, revision, rejection | `MISSING_IN_STATIC` | Preserve as the canonical human-checkpoint pattern. |
| Content | Static product copy only | Long-form Blog, LinkedIn, Instagram with traceability | `MISSING_IN_STATIC` | Preserve deliverable-first layout and keyboard behavior. |
| Review | Human control is conceptual | Finding categories, blocking logic, revision impact | `MISSING_IN_STATIC` | Preserve and strengthen semantic status labels. |
| Delivery | Outcome framing | Package poster, export, decisions, no-publication disclaimer | `MINOR_VARIANCE` | Add canonical Deliveries route and package summary. |
| AI settings | Not defined in static | Visual BYOK states, no credential persistence | `MISSING_IN_STATIC` | Keep secondary and product-oriented. |
| Diagnostics | Not a commercial surface | Explicitly secondary route and footer/mobile entry | `MATCH` | Ensure it never enters primary navigation. |
| Loading/error/empty | Minimal static behavior | Empty, recoverable failure, route error, loading patterns | `MINOR_VARIANCE` | Normalize shared state components and test them. |
| Mobile | Static breakpoints and composed hero | Intentional responsive layouts at 1000/700 px | `MINOR_VARIANCE` | Verify target viewports and keyboard/touch behavior. |
| Motion | Minimal/reduced motion | Loader and reduced-motion rule exist | `MINOR_VARIANCE` | Centralize motion tokens and verify reduced motion. |
| Technical concepts | Secondary | Diagnostics and drawers are secondary | `MATCH` | Add primary-navigation terminology gate. |

## Route mapping

| Current route | Surface | Target pattern | Action |
| --- | --- | --- | --- |
| `/` | Agency Home | Public/authenticated Agency entry | Recompose incrementally; preserve Project entry points. |
| `/services/publisher` | Publisher overview | Service editorial page | Preserve; place behind canonical Services navigation. |
| `/services/publisher/new` | Editorial Context wizard | Agency Project creation | Preserve seven steps and state creation. |
| `/projects` | Project list | Agency engagements | Restyle/shared foundations; retain scenario switcher. |
| `/projects/:projectId/context` | Context and Editorial Core | Editorial review artifact | Preserve behavior and deep links. |
| `/projects/:projectId/strategy` | Publication Plan | Editorial sequence | Preserve. |
| `/projects/:projectId/content` | Channel outputs | Deliverable-first reader | Preserve Blog, LinkedIn, Instagram, copy, traceability, comparison. |
| `/projects/:projectId/review` | Consistency review | Human checkpoint | Preserve blocking, approval, rejection, revision impact. |
| `/projects/:projectId/delivery` | Final package | Agency delivery | Preserve export and no-publication disclaimer; expose from Deliveries. |
| `/settings/ai` | Visual BYOK | Product settings | Preserve all demonstration states; remain secondary. |
| `/platform-diagnostics` | Technical inventory | Secondary technical area | Preserve outside primary navigation. |
| `/services` | Missing catalog | Five Agency disciplines | Add. |
| `/deliveries` | Missing list | Recent Agency outcomes | Add, derived from delivery-ready fixtures. |

## Capability preservation contract

The current baseline contains the required Project creation, seven-step Editorial Context wizard, deterministic and visual BYOK modes, local reducer/state machine, typed fixtures, Editorial Core approval/change/reject actions, strategy, three channel variants, traceability, findings, blocking approval behavior, package approval/change/reject actions, version comparison, Delivery, JSON export, failure retry, desktop/mobile Playwright projects, and `en-US` default/fallback.

No convergence change may remove these capabilities. Backend, transport, runtime, fixture schema, and state-machine changes are outside this sprint unless a visible UI contract makes one strictly necessary.

## Design–functional conflicts

| ID | Conflict | Resolution |
| --- | --- | --- |
| `DFC-017-001` | The static reference has no authenticated dashboard or Project workspace. | Extend its editorial foundations; do not replace the functional workspace with static markup. |
| `DFC-017-002` | Static navigation is commercial while the prototype requires Projects, Deliveries, and settings. | Keep product routes in the shared shell; make technical diagnostics secondary. |
| `DFC-017-003` | Static assets live under a separate Next application. | Derive tokens and composition; do not duplicate raw assets unless a reusable runtime asset is required. |
| `DFC-017-004` | Static Home has no stateful human-review actions. | Reuse its hierarchy for dedicated editorial approval artifacts with explicit actions. |
| `DFC-017-005` | The app is a deterministic prototype, not a live authenticated application. | Use an authenticated-style composition without claiming real authentication, AI execution, or publication. |

## Static asset inventory

| Asset group | Location | Ownership/use | Decision |
| --- | --- | --- | --- |
| BBA/Axodus marks | `static/public/assets/` | Standalone visual reference | `Axodus_logo.svg` contained two identical SVG documents separated by committed conflict markers; retain one LF-normalized valid document. Preserve the remaining originals. |
| Process hero rasters | `bba-static-hero_1.png`, `bba-static-hero_2.png` | Static hero exploration | Preserve; not required by the functional prototype. |
| Process collage | `hero-process/*.webp` | `ProcessArtwork` composition | Preserve in static; prototype currently uses a CSS-native accessible diagram. |
| Neurons mark | `logo-neurons.png`, `neurons-logo.svg` | Capacity/brand reference | Keep secondary; do not introduce financial semantics. |
| Favicons | `static/public/favicon.svg`, `static/public/assets/favicon.*` | Static application metadata | Preserve; normalize only when application asset strategy is implemented. |

The audit found committed conflict markers in `static/public/assets/Axodus_logo.svg`. Both sides were logically identical, so the resolution retained one valid, LF-normalized SVG document. The mandatory repository scan remains a closing gate.

## Component inventory

| Existing implementation | Classification | Target responsibility |
| --- | --- | --- |
| `StaticAgencyShell` | `RECOMPOSE` | `AgencyShell`, header, primary/mobile navigation, footer, session area. |
| `AgencyHome` | `RECOMPOSE` | Editorial hero, disciplines, service outcomes, human control, active engagements. |
| `PublisherOverview` | `RESTYLE` | Canonical service page and outcome summary. |
| `ProjectListPage` | `RESTYLE` | Project/engagement cards and empty/loading states. |
| `EditorialContextWizard` | `RECOMPOSE` | Shared Stepper, FormSection, fields, confirmation. |
| `ProjectWorkspace` | `RECOMPOSE` | ProjectHeader, narrative stage, tabs, agent team, editorial/review/delivery patterns. |
| `StaticAiSettings` | `RESTYLE` | Product setting with explicit provider states and privacy boundaries. |
| `PlatformDiagnostics` | `REUSE_AS_IS` | Secondary technical surface using shared foundations. |
| `@bba/ui` foundations | `RESTYLE` | Accessible primitives; Agency variants must remain reusable. |
| Monolithic Agency CSS | `REPLACE` | Canonical tokens plus cohesive foundation/component/pattern styles. |
| Generic legacy shell/styles | `REMOVE` later | Retain only while non-Publisher legacy routes still require them. |
| Services catalog | `NEW_SHARED_COMPONENT` | Five disciplines and explicit availability. |
| Deliveries list | `NEW_SHARED_COMPONENT` | Completed packages with truthful distribution status. |

## Phase plan and exit evidence

1. Extract static-derived tokens and shared shell patterns.
2. Add canonical Services and Deliveries routes; align Home hierarchy.
3. Consolidate wizard and Project surfaces without changing reducers/fixtures.
4. Strengthen focus, dialog, status, responsive, and reduced-motion behavior.
5. Add unit/E2E coverage for shell, terminology, routes, checkpoints, and keyboard flow.
6. Capture stable before/after evidence at 1440×900, 1280×800, 768×1024, and 390×844.
7. Run language, boundaries, package tests, build, bundle, Playwright, conflict scan, and clean-tree checks.

The 017.1 exit criterion is satisfied when this audit, the architecture mapping, and the evidence manifest account for every listed surface. Visual PASS is assigned: the fresh screenshots, target-viewport checks, browser tests, and accessibility smoke all pass in the current workspace.
