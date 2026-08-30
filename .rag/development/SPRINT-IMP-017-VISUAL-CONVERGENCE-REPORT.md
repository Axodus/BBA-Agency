# SPRINT-IMP-017 Visual Convergence Report

Status: PASS

Branch: feat/sprint-imp-017-agency-visual-convergence

## Summary

The BBA Publisher prototype has moved from a divergent prototype shell toward the approved BBA Agency visual direction represented by static/ and bba.country.

Completed so far:

- 339fc98 documents the static/prototype divergence audit, component mapping, asset inventory, and evidence structure.
- c713d8c introduces Agency-derived frontend foundations, a shared Agency shell, canonical Services and Deliveries routes, and an authenticated-style Home with engagements, pending decisions, and recent deliveries.
- 47d4c5b aligns AI Models / visual BYOK settings with privacy, consent, expiration, removal, and deterministic configuration states.
- static/public/assets/Axodus_logo.svg was repaired from a committed conflict-marker state into one valid SVG document.

The sprint is complete. Browser evidence for visual convergence passes across the required viewports, including the no-horizontal-overflow gate. The workspace-wide gates now pass with the local binaries already present in this checkout, and the accessibility smoke verifies keyboard reachability on desktop and mobile.

## Implemented surfaces

| Surface | Current result | Evidence status |
| --- | --- | --- |
| Public / Agency Home | Agency proposition, five disciplines, engagements, pending decisions, recent deliveries, final CTA | PASS |
| Services | Canonical /services catalog with five disciplines and honest planned states | PASS |
| Publisher service page | Outcome-first service presentation preserved | PASS |
| Project list | Agency engagement list preserved | PASS |
| Project wizard | Seven-step creation flow preserved | PASS |
| Workspace Context / Editorial Core | Human checkpoint preserved | PASS |
| Strategy | Editorial sequence preserved; mobile wrapping correction added | PASS |
| Content | Blog, LinkedIn, Instagram, copy, traceability, version comparison preserved | PASS |
| Review | Findings, blocking approval, revision impact, package approval preserved | PASS |
| Delivery | Export and no-publication disclaimer preserved | PASS |
| AI settings | Product setting with provider state, privacy, consent, expiration, removal | PASS |
| Diagnostics | Secondary technical area preserved outside primary navigation | PASS |

## Functional preservation

Desktop and mobile E2E passed after the final overflow hardening: 6 passed across desktop and mobile.
The accessibility smoke also passed across desktop and mobile, proving the primary actions and wizard controls are keyboard reachable.

Covered paths: golden path from Project creation to Delivery; package revision with version comparison; recoverable failure and retry.

The state machine, fixtures, typed view models, and backend/transport boundaries were not intentionally changed.

## Visual evidence

The visual evidence harness apps/web/e2e/visual-convergence.spec.ts captures Home, Services, Publisher, Projects, wizard confirmation, Editorial Core, Strategy, Content, Review, Delivery, AI settings, failure state, and version comparison at 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844.

It also asserts no horizontal overflow on every captured surface.

The final capture run produced and validated 52 screenshots under .rag/evidence/SPRINT-IMP-017/desktop/ and .rag/evidence/SPRINT-IMP-017/mobile/. During hardening, the new overflow assertion revealed Strategy overflow at 390 px and AI settings overflow at 390 px.

Source fixes have been applied and verified for both: .strategy-sequence now wraps and becomes vertical under 700 px; .ai-settings and scenario controls now allow shrinking and word breaking.

Final visual screenshot acceptance: PASS for 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844.

## Validation performed

Passed:

- node tools/check-agency-language.mjs
- ./node_modules/.bin/tsc --noEmit -p clients/typescript/tsconfig.json
- ./apps/web/node_modules/.bin/tsc --noEmit -p apps/web/tsconfig.json
- node apps/web/tools/check-boundaries.mjs
- node apps/web/tools/check-product-acceptance.mjs
- ./apps/web/node_modules/.bin/vite build
- node apps/web/tools/check-bundle.mjs
- ./node_modules/.bin/vitest run test/mission-contracts.test.ts test/static-publisher.test.tsx test/dev-session.test.tsx --configLoader runner
- ./node_modules/.bin/playwright test e2e/static-publisher.spec.ts e2e/visual-convergence.spec.ts
- ./node_modules/.bin/playwright test e2e/accessibility.spec.ts
- python XML parse for static/public/assets/Axodus_logo.svg
- git grep conflict-marker scan after SVG repair

## Quantitative convergence matrix

| Surface | Target | Result |
| --- | --- | --- |
| Public Home | Visually aligned | PASS_VISUAL |
| Authenticated Home | Same design family | PASS_VISUAL |
| Services | Aligned | PASS_VISUAL |
| Publisher page | Aligned | PASS_VISUAL |
| Project list | Adapted to design system | PASS_VISUAL |
| Wizard | Aligned | PASS_VISUAL |
| Workspace | Aligned | PASS_VISUAL |
| Editorial Core | Aligned | PASS_VISUAL |
| Strategy | Aligned | PASS_VISUAL |
| Content | Aligned | PASS_VISUAL |
| Review | Aligned | PASS_VISUAL |
| Delivery | Aligned | PASS_VISUAL |
| AI settings | Aligned | PASS_VISUAL |
| Mobile | Aligned | PASS_VISUAL |

These PASS_VISUAL results now sit alongside current language, typecheck, build, bundle, unit, browser, and accessibility checks, so the sprint can be treated as complete.

## Deployment status

No deployment was performed. No claim is made that dev.bba.country has been updated.
