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

The sprint is not complete yet. Browser evidence exists but the final mobile overflow gate has not been rerun successfully after the last CSS correction because the local preview server requires privileged port binding in this environment.

## Implemented surfaces

| Surface | Current result | Evidence status |
| --- | --- | --- |
| Public / Agency Home | Agency proposition, five disciplines, engagements, pending decisions, recent deliveries, final CTA | Source and preliminary screenshots |
| Services | Canonical /services catalog with five disciplines and honest planned states | Source and preliminary screenshots |
| Publisher service page | Outcome-first service presentation preserved | Existing E2E and preliminary screenshots |
| Project list | Agency engagement list preserved | Existing E2E and preliminary screenshots |
| Project wizard | Seven-step creation flow preserved | Existing E2E and preliminary screenshots |
| Workspace Context / Editorial Core | Human checkpoint preserved | Existing E2E and preliminary screenshots |
| Strategy | Editorial sequence preserved; mobile wrapping correction added | Build-valid, final browser rerun pending |
| Content | Blog, LinkedIn, Instagram, copy, traceability, version comparison preserved | Existing E2E and preliminary screenshots |
| Review | Findings, blocking approval, revision impact, package approval preserved | Existing E2E and preliminary screenshots |
| Delivery | Export and no-publication disclaimer preserved | Existing E2E and preliminary screenshots |
| AI settings | Product setting with provider state, privacy, consent, expiration, removal | Build-valid, final browser rerun pending |
| Diagnostics | Secondary technical area preserved outside primary navigation | Source audit |

## Functional preservation

Desktop and mobile E2E passed before the final overflow hardening: desktop 3 passed; mobile 3 passed.

Covered paths: golden path from Project creation to Delivery; package revision with version comparison; recoverable failure and retry.

The state machine, fixtures, typed view models, and backend/transport boundaries were not intentionally changed.

## Visual evidence

The visual evidence harness apps/bba-web/e2e/visual-convergence.spec.ts captures Home, Services, Publisher, Projects, wizard confirmation, Editorial Core, Strategy, Content, Review, Delivery, AI settings, failure state, and version comparison at 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844.

It also asserts no horizontal overflow on every captured surface.

The first full capture run produced 52 screenshots under .rag/evidence/SPRINT-IMP-017/desktop/ and .rag/evidence/SPRINT-IMP-017/mobile/. During hardening, the new overflow assertion revealed Strategy overflow at 390 px and AI settings overflow at 390 px.

Source fixes have been applied for both: .strategy-sequence now wraps and becomes vertical under 700 px; .ai-settings and scenario controls now allow shrinking and word breaking.

Final screenshot acceptance remains pending until the local preview/browser runner can be restarted.

## Validation performed

Passed:

- node tools/check-agency-language.mjs
- timeout 120s node_modules/.bin/vite build
- desktop E2E: 3 passed
- mobile E2E: 3 passed
- visual capture before final overflow fixes: 4 passed, 52 screenshots produced
- python XML parse for static/public/assets/Axodus_logo.svg
- git grep conflict-marker scan after SVG repair

Blocked or incomplete:

- pnpm --filter @bba/bba-web test, pnpm --filter @bba/bba-web typecheck, and pnpm agency:check-language attempted dependency reconciliation and aborted with ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY.
- node apps/bba-web/tools/check-boundaries.mjs found a pre-existing forbidden browser dependency in src/tools/mcp-server.ts, outside the changed SPRINT-IMP-017 files.
- node apps/bba-web/tools/check-product-acceptance.mjs failed because it looked for /mnt/d/rede/github/contracts/openapi/v1/operation-inventory.json, which is absent in the current workspace layout.
- visual-convergence mobile rerun after final CSS correction could not be completed because vite preview port binding requires elevated execution in this environment, and the approval path is currently unavailable.

## Quantitative convergence matrix

| Surface | Target | Result |
| --- | --- | --- |
| Public Home | Visually aligned | IN_PROGRESS |
| Authenticated Home | Same design family | IN_PROGRESS |
| Services | Aligned | IN_PROGRESS |
| Publisher page | Aligned | IN_PROGRESS |
| Project list | Adapted to design system | IN_PROGRESS |
| Wizard | Aligned | IN_PROGRESS |
| Workspace | Aligned | IN_PROGRESS |
| Editorial Core | Aligned | IN_PROGRESS |
| Strategy | Aligned | IN_PROGRESS |
| Content | Aligned | IN_PROGRESS |
| Review | Aligned | IN_PROGRESS |
| Delivery | Aligned | IN_PROGRESS |
| AI settings | Aligned | IN_PROGRESS |
| Mobile | Aligned | IN_PROGRESS |

No PASS is assigned yet because completion requires fresh after screenshots and successful no-overflow checks after the latest corrections.

## Known gaps

1. Re-run visual-convergence.spec.ts after the latest CSS changes with a live preview server.
2. Capture or refresh final screenshots after the no-overflow assertion passes.
3. Run the full package checks after dependency reconciliation no longer requires interactive node_modules purging.
4. Resolve or explicitly isolate the pre-existing architecture and product-acceptance gate path issues.
5. Update this report from IN_PROGRESS to PASS/PASS_WITH_GAPS/FAIL only after evidence proves every acceptance criterion.

## Deployment status

No deployment was performed. No claim is made that dev.bba.country has been updated.
