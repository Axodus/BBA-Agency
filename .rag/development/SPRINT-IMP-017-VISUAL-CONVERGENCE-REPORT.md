# SPRINT-IMP-017 Visual Convergence Report

Status: IN_PROGRESS

Branch: feat/sprint-imp-017-agency-visual-convergence

## Summary

The BBA Publisher prototype has moved from a divergent prototype shell toward the approved BBA Agency visual direction represented by static/ and bba.country.

Completed so far:

- 339fc98 documents the static/prototype divergence audit, component mapping, asset inventory, and evidence structure.
- c713d8c introduces Agency-derived frontend foundations, a shared Agency shell, canonical Services and Deliveries routes, and an authenticated-style Home with engagements, pending decisions, and recent deliveries.
- 47d4c5b aligns AI Models / visual BYOK settings with privacy, consent, expiration, removal, and deterministic configuration states.
- static/public/assets/Axodus_logo.svg was repaired from a committed conflict-marker state into one valid SVG document.

The sprint is not complete yet. Browser evidence for visual convergence now passes across the required viewports, including the no-horizontal-overflow gate. Full sprint closure remains pending because several workspace-wide gates are still blocked by dependency/layout issues described below.

## Implemented surfaces

| Surface | Current result | Evidence status |
| --- | --- | --- |
| Public / Agency Home | Agency proposition, five disciplines, engagements, pending decisions, recent deliveries, final CTA | Source and preliminary screenshots |
| Services | Canonical /services catalog with five disciplines and honest planned states | Source and preliminary screenshots |
| Publisher service page | Outcome-first service presentation preserved | Existing E2E and preliminary screenshots |
| Project list | Agency engagement list preserved | Existing E2E and preliminary screenshots |
| Project wizard | Seven-step creation flow preserved | Existing E2E and preliminary screenshots |
| Workspace Context / Editorial Core | Human checkpoint preserved | Existing E2E and preliminary screenshots |
| Strategy | Editorial sequence preserved; mobile wrapping correction added | Visual no-overflow PASS |
| Content | Blog, LinkedIn, Instagram, copy, traceability, version comparison preserved | Existing E2E and preliminary screenshots |
| Review | Findings, blocking approval, revision impact, package approval preserved | Existing E2E and preliminary screenshots |
| Delivery | Export and no-publication disclaimer preserved | Existing E2E and preliminary screenshots |
| AI settings | Product setting with provider state, privacy, consent, expiration, removal | Visual no-overflow PASS |
| Diagnostics | Secondary technical area preserved outside primary navigation | Source audit |

## Functional preservation

Desktop and mobile E2E passed after the final overflow hardening: 6 passed across desktop and mobile.

Covered paths: golden path from Project creation to Delivery; package revision with version comparison; recoverable failure and retry.

The state machine, fixtures, typed view models, and backend/transport boundaries were not intentionally changed.

## Visual evidence

The visual evidence harness apps/bba-web/e2e/visual-convergence.spec.ts captures Home, Services, Publisher, Projects, wizard confirmation, Editorial Core, Strategy, Content, Review, Delivery, AI settings, failure state, and version comparison at 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844.

It also asserts no horizontal overflow on every captured surface.

The final capture run produced and validated 52 screenshots under .rag/evidence/SPRINT-IMP-017/desktop/ and .rag/evidence/SPRINT-IMP-017/mobile/. During hardening, the new overflow assertion revealed Strategy overflow at 390 px and AI settings overflow at 390 px.

Source fixes have been applied and verified for both: .strategy-sequence now wraps and becomes vertical under 700 px; .ai-settings and scenario controls now allow shrinking and word breaking.

Final visual screenshot acceptance: PASS for 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844.

## Validation performed

Passed:

- node tools/check-agency-language.mjs
- timeout 120s node_modules/.bin/vite build
- desktop and mobile E2E after final overflow fixes: 6 passed
- visual convergence harness after final overflow fixes: 4 passed, 52 screenshots produced and validated
- python XML parse for static/public/assets/Axodus_logo.svg
- git grep conflict-marker scan after SVG repair

Blocked or incomplete:

- pnpm --filter @bba/bba-web test, pnpm --filter @bba/bba-web typecheck, and pnpm agency:check-language attempted dependency reconciliation and aborted with ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY.
- node apps/bba-web/tools/check-boundaries.mjs found a pre-existing forbidden browser dependency in src/tools/mcp-server.ts, outside the changed SPRINT-IMP-017 files.
- node apps/bba-web/tools/check-product-acceptance.mjs failed because it looked for /mnt/d/rede/github/contracts/openapi/v1/operation-inventory.json, which is absent in the current workspace layout.
- direct app typecheck attempts through local tsc did not produce reliable tool output in this filesystem session; no typecheck PASS is claimed from those attempts.
- Vitest with pnpm and the default bundled config loader failed on EROFS while trying to write apps/bba-web/node_modules/.vite-temp/*.mjs.
- Vitest with --configLoader runner avoided the EROFS write but failed to start a worker pool, reporting: [vitest-pool-runner]: Timeout waiting for worker to respond.

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

These PASS_VISUAL results do not close the sprint by themselves. Full PASS still requires all functional, architecture, language, build, bundle, and workspace checks to be current and green.

## Known gaps

1. Run the full package checks after dependency reconciliation no longer requires interactive node_modules purging or EROFS access to node_modules.
2. Obtain reliable typecheck and unit-test output from the local runner.
3. Update this report from IN_PROGRESS to PASS/PASS_WITH_GAPS/FAIL only after evidence proves every acceptance criterion.

## Deployment status

No deployment was performed. No claim is made that dev.bba.country has been updated.
