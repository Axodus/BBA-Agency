# SPRINT-IMP-017 Design System and Component Mapping

Status: `PROPOSED_FOR_IMPLEMENTATION`

## Decision

The canonical Agency frontend will derive reusable foundations from `static/` and apply them to the route-aware, stateful Publisher application in `apps/bba-web`. Static markup is a visual specification, not an application implementation. The Publisher reducer, typed fixtures, UI view models, and backend-facing contracts remain unchanged.

## Foundation boundary

The frontend will use a single Agency foundation rooted under:

```text
apps/bba-web/src/design-system/
├── tokens/
├── components/
└── patterns/
```

CSS custom properties are the runtime token representation. TypeScript exports are added only where code requires semantic values. Foundations cover paper/ink/brand and semantic colors, typography, scale, spacing, content widths, breakpoints, focus, motion, borders, and elevation.

## Composition

```text
Static visual authority
  → Agency tokens and patterns
    → AgencyShell
      → Home / Services / Projects / Deliveries / AI Models
        → Publisher wizard and Project Workspace
          → Context / Strategy / Content / Review / Delivery
```

Primary navigation exposes customer destinations only. Diagnostics remains reachable through the footer/mobile technical entry and is explicitly labeled as secondary. Mission, Workflow, bounded contexts, commands, models, IDs, and receipts do not enter primary information architecture.

## Component mapping

| Canonical component/pattern | Baseline source | Implementation direction |
| --- | --- | --- |
| `AgencyShell` | `StaticAgencyShell` | Extract shell structure and session/CTA slots. |
| `AgencyHeader`, `PrimaryNavigation`, `MobileNavigation` | `StaticAgencyShell` + `@bba/ui/Drawer` | Preserve accessible Drawer; canonicalize destinations. |
| `AgencyFooter` | `StaticAgencyShell` | Retain truthful positioning and secondary diagnostics. |
| `PageContainer`, `SectionHeading`, `EditorialHero` | Agency CSS and static Home | Extract reusable layout classes/components. |
| `ServiceCard`, `DisciplineCard` | `AgencyHome`, `PublisherOverview` | Share availability and outcome-first presentation. |
| `ProjectCard`, `DeliveryCard` | `ProjectListPage`, Delivery section | Share engagement metadata and next action. |
| `ProjectHeader`, `ProjectStage`, `ProjectTimeline` | `ProjectWorkspace` | Recompose without changing project state. |
| `AgentTeam`, `AgentContribution` | Workspace agent section | Keep coordinated-team framing; demote technical names. |
| `EditorialDocument`, `ClaimCard`, `EvidenceReference` | Editorial Core/content | Extract document and lineage patterns. |
| `ReviewFinding`, `ApprovalPanel`, `RevisionImpact` | Review/Core sections | Keep blocking behavior and explicit Human Governance. |
| `VersionComparison`, `PackageSummary` | Workspace dialogs/Delivery | Improve dialog semantics and reusable delivery framing. |
| `FormSection`, `FormField`, `Stepper` | Wizard + `@bba/ui` | Preserve labels/errors; unify spacing and mobile progress. |
| `Button`, `IconButton`, `StatusBadge`, `Tabs` | `@bba/ui` and local styles | Add Agency presentation without losing accessible primitives. |
| `Drawer`, `Dialog`, `Toast` | `@bba/ui` plus local dialogs | Reuse Radix primitives; replace hand-rolled modal focus where practical. |
| `EmptyState`, `ErrorState`, `LoadingState` | Local state panels | Normalize wording and semantics. |

## Compatibility rules

- Existing routes remain valid; canonical catalog/list routes may be added.
- Deep links to every Workspace section remain valid.
- State transitions and available-action guards remain authoritative.
- Blocking findings continue to prevent package approval.
- BYOK remains visual-only and never persists or returns a key.
- Delivery means a prepared/exportable package; no external publication occurs.
- English remains the UI default and fallback. Deliverable content language remains independent.
- Technical data remains available through explicit secondary disclosure.

## Asset rule

Original assets remain under `static/public/assets`. The functional app will not copy assets merely to imitate the reference. If an asset becomes required, it must receive a single application-owned path, an accessible use, and an entry in the evidence manifest.

## Verification gates

Architecture acceptance requires route continuity, boundary checks, primary-navigation terminology tests, state-machine regression tests, language checks, responsive browser evidence, keyboard operation, reduced-motion behavior, a conflict-marker scan, successful build/bundle, and a clean worktree. Visual screenshots are evidence of presentation only; they do not replace functional gates.
