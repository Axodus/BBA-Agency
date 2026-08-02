# SPRINT-IMP-017 Evidence Manifest

Status: `PASS`

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

An automated capture run produced 52 screenshots across 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844. The current run passes with the no-horizontal-overflow assertion enabled for every captured surface.

Visual acceptance for the captured surfaces is complete. The current workspace also passes the language gate, package typechecks, product acceptance, boundaries, build, bundle, Vitest unit tests, Playwright browser tests, and the accessibility smoke.

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
- Baseline functional tests: desktop and mobile E2E passed for golden, revision, and failure paths.
- Fresh browser screenshots: final 52-file set exists and passed the no-overflow visual harness.
- Accessibility evidence: keyboard-accessible home and wizard smoke passed on desktop and mobile.
- Language and architecture gates: current and green.
- Build and bundle: current and green.

PASS is assigned because the final report and audit now link every acceptance criterion to current evidence.
