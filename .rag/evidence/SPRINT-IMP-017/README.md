# SPRINT-IMP-017 Evidence Manifest

Status: `IN_PROGRESS`

This directory records reproducible evidence for visual convergence. Evidence is separated from product claims: screenshots prove rendered composition at a viewport, while tests and reports prove behavior and contract preservation.

## Baseline (`before`)

The authenticated external deployment was not publicly accessible during sprint definition. The repository already contains the last validated prototype evidence under `../REQ-IMP-016-FE-001/`:

| Surface | Existing baseline |
| --- | --- |
| Agency Home desktop | `../REQ-IMP-016-FE-001/01-agency-home-desktop.png` |
| Wizard desktop | `../REQ-IMP-016-FE-001/02-context-wizard-desktop.png` |
| Editorial Core desktop | `../REQ-IMP-016-FE-001/03-editorial-core-review-desktop.png` |
| Channel content desktop | `../REQ-IMP-016-FE-001/04-channel-content-desktop.png` |
| Review desktop | `../REQ-IMP-016-FE-001/05-consistency-review-desktop.png` |
| Delivery desktop | `../REQ-IMP-016-FE-001/06-delivery-desktop.png` |
| Agency Home mobile | `../REQ-IMP-016-FE-001/07-agency-home-mobile.png` |
| Golden-path recording | `../REQ-IMP-016-FE-001/publisher-golden-path.webm` |

These files are referenced rather than copied to avoid duplicating governed binary evidence. Fresh `before` captures must be placed in `before/` if a clean pre-change runtime can be reproduced.

## Current screenshot evidence

An automated capture run produced 52 screenshots across 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844. The final run passed with the no-horizontal-overflow assertion enabled for every captured surface.

Visual acceptance for the captured surfaces is complete. Full sprint acceptance still requires the functional and workspace-wide gates listed in the development report.

## Required final `after` evidence

Capture public Home, authenticated-style Home, Services, Publisher, Projects, wizard confirmation, Workspace Context/Core, Content, Review, Delivery, AI settings, and an error state at:

- 1440×900 desktop;
- 1280×800 laptop;
- 768×1024 tablet;
- 390×844 mobile.

Stable screenshots belong in `desktop/`, `mobile/`, or `after/`; computed comparisons belong in `visual-diffs/`. Dynamic timestamps and fixture-dependent values must be normalized by the E2E harness.

## Current audit evidence

- Source audit: `../../design/SPRINT-IMP-017-STATIC-PROTOTYPE-CONVERGENCE-AUDIT.md`
- Architecture mapping: `../../architecture/SPRINT-IMP-017-DESIGN-SYSTEM-AND-COMPONENT-MAPPING.md`
- Baseline functional tests: desktop and mobile E2E passed after final overflow fixes for golden, revision, and failure paths; full pnpm check remains pending dependency reconciliation.
- Fresh browser screenshots: final 52-file set exists and passed the no-overflow visual harness.
- Accessibility evidence: pending.
- Language and architecture gates: pending.
- Build and bundle: pending.

No PASS is assigned until the final report links every acceptance criterion to current evidence.
