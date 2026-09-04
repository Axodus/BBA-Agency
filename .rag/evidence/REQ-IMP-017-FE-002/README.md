# REQ-IMP-017-FE-002 — Evidence

## Validation gates

| Gate | Result |
|---|---|
| `pnpm agency:check-language` | PASS — canonical English, en-US |
| `tsc --noEmit` (bba-web) | PASS — 0 errors |
| `tsc --noEmit` (static) | PASS — 0 errors (EROFS on .tsbuildinfo is environment-only) |
| `git diff --check` | PASS — no whitespace issues |
| vitest (bba-web) | EROFS environment limitation — not caused by this REQ |

## Files changed

| File | Change |
|---|---|
| `config/footer.ts` | New — canonical shared URL configuration |
| `apps/web/src/config/footer.ts` | New — prototype-local copy of URL config |
| `apps/web/src/design-system/components/AgencyShell.tsx` | Updated — full canonical `AgencyFooter` replaces stub |
| `apps/web/src/styles.css` | Updated — `.agency-footer-*` canonical layout styles |
| `static/app/components/AgencyFooter.tsx` | New — Next.js server component replica |
| `static/app/components/globals.css` | Updated — `.agency-footer-*` canonical layout styles |
| `static/app/page.tsx` | Updated — renders `<AgencyFooter />` |

## Browser validation

Browser automation unavailable in sandbox environment. Static HTTP smoke test not executable.
Structural and TypeScript validation confirmed. Visual evidence pending local browser run.
