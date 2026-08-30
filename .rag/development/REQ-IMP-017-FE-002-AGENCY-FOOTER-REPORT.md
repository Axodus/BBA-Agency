# REQ-IMP-017-FE-002 — Agency Footer Implementation Report

## Summary

Implemented the canonical **BBA Agency Footer** across `static/` (Next.js) and `apps/web` (React/Vite prototype) as specified by REQ-IMP-017-FE-002 under EPIC-IMP-016 / SPRINT-IMP-017.

## What was implemented

### Shared configuration

`config/footer.ts` (repo root) and `apps/web/src/config/footer.ts` centralize all external URLs and the version label. Components import from this config; no URLs are hardcoded in markup.

### Prototype — `apps/web`

`AgencyFooter` in `apps/web/src/design-system/components/AgencyShell.tsx` was expanded from a three-element stub into the full canonical component. It uses `NavLink` from react-router-dom for internal routes and standard `<a>` with `target="_blank" rel="noopener noreferrer"` for external links. It is already rendered by `AgencyShell` which wraps every route — so the footer appears on Home, Services, Projects, Deliveries, Publisher, Workspace, and all other pages automatically.

### Static site — `static/`

`static/app/components/AgencyFooter.tsx` is a new Next.js server component using `next/link` for internal navigation. It is rendered at the bottom of the landing page via `static/app/page.tsx`.

### CSS

Both `apps/web/src/styles.css` and `static/app/globals.css` were updated to carry the canonical `.agency-footer-*` class hierarchy. The old monolithic `footer {}` selector in globals.css was replaced. Responsive breakpoints collapse to single-column at ≤768px and two-column at ≤1024px.

## Sections implemented

| Section | Content |
|---|---|
| Brand | Wordmark + positioning statement |
| Explore | Home, Services, Projects, Deliveries, AI Models; Research and Campaigns disabled |
| Services | Publisher; Advertising, Scientific Writing, Governance, Research marked Coming Soon |
| Resources | Documentation, Product Narrative, Architecture, Changelog, Help Center |
| Company | About, Contact, Privacy, Terms, Cookies |
| Social | GitHub, LinkedIn, X, Telegram with inline SVG icons and aria-labels |
| Bottom bar | Copyright, tagline, configurable version string |

## Accessibility

- Semantic `<footer>` with `aria-label="BBA Agency site footer"`
- Each column wrapped in `<nav>` with descriptive `aria-label`
- Social icons use descriptive `aria-label`; SVGs are `aria-hidden`
- Disabled items use `aria-disabled="true"` on `<span>` (not `<a>`) so screen readers receive correct context
- Focus styles inherited from existing agency tokens

## Internationalization

All copy is English. `pnpm agency:check-language` passes.

## Validation status

| Gate | Result |
|---|---|
| `pnpm agency:check-language` | PASS |
| TypeScript (bba-web) | PASS — 0 errors |
| TypeScript (static) | PASS — 0 errors |
| `git diff --check` | PASS |
| Vitest | EROFS — environment limitation, not caused by this REQ |
| Browser / visual evidence | Not available in sandbox environment |

## Limitations

- Visual parity between `bba.country` and `dev.bba.country` must be confirmed in a live browser session.
- The `config/footer.ts` at repo root exists for reference; the prototype imports its own copy at `apps/web/src/config/footer.ts`. A shared workspace package could unify these in a future iteration.
- Community section (Discord, GitHub text link, X, LinkedIn, Telegram) is represented in the Social row; a separate Community nav column may be added if the REQ is extended.
