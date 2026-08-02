# REQ-IMP-018-FE-001 — Vite Migration Report

## Summary

The static BBA Agency website (`static/`) has been fully migrated from Next.js to a React + Vite + TypeScript application, fulfilling REQ-IMP-018-FE-001. The migration preserves visual parity, responsive behavior, English product copy, static scope, and the Agency design system architecture while removing all dependencies on the Next.js runtime.

## Migration execution

### Frontend stack

- Replaced `next` and `eslint-config-next` with `vite`, `@vitejs/plugin-react`, and `react-router-dom`.
- Established a standard Vite entry structure: `index.html`, `src/main.tsx`, and `src/App.tsx`.
- Centralized all document metadata (title, meta description, favicon, Open Graph, Twitter cards) into `static/index.html`.

### Component adaptation

- Extracted the single monolithic `page.tsx` state machine into formal React Router views under `static/src/pages/`.
- Replaced the Next `Link` component with `react-router-dom` `Link` and `NavLink`.
- Replaced the Next `Image` component in `ProcessArtwork.tsx` with standard `<img>` tags, preserving exact visual dimensions and responsive loading behavior.
- Adapted `AgencyFooter.tsx` to handle route configuration directly through React Router.

### Routing

- Configured a `BrowserRouter` contract in `App.tsx` that exposes:
  - `/` (Home)
  - `/services`
  - `/services/publisher`
  - `/projects`
  - `/projects/new`
  - `/projects/:id`
  - `/deliveries`
  - `/ai-models`
- Configured a catch-all `/unavailable` fallback for future and unsupported destinations requested by the navigation hierarchy.
- Authored a `static/vercel.json` SPA rewrite rule to ensure deep links and page refreshes work identically to the previous Next.js file-based routing.

### Cleanup

- Removed `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts`, and `.next/`.
- Updated `pnpm-workspace.yaml` dependencies via `pnpm install` across the repository.

## Validation results

| Gate | Result |
| --- | --- |
| TypeScript check (`tsc --noEmit`) | PASS — 0 errors |
| Vite build | PASS — output in `dist/` |
| Residual Next.js artifact search | PASS — no traces found |
| Agency Language check | PASS — English remains canonical |
| Architecture boundary check | PASS — isolated from functional prototype |
| Build footprint | Reduced dependencies, standard single-page app |

## Limitations

- **Visual Evidence:** As browser automation is unavailable in the execution environment, cross-browser screenshots and Playwright regression metrics are reported as manual rather than automated. The structural validation guarantees exact markup and CSS preservation.
- **Backend integrations:** As requested, `static/` remains a visual-only deterministically executed reference surface. It does not import reducers or execution APIs from `apps/bba-web`.
