# EPIC-IMP-014 — Frontend Platform Foundation

## Decision

The BBA web foundation is a Vite and React single-page application under `apps/bba-web`. Reusable browser concerns are separated into `@bba/ui`, `@bba/app-shell`, and `@bba/sdk-react`.

Only `@bba/sdk-react` may import `@bba/api-client`. Browser pages never call HTTP directly and never import Core, Transport, generated client types, handlers, or repositories. Its public hooks expose stable view models and errors owned by the React integration package.

## Runtime boundary

Authentication and workspace adapters resolve asynchronously. EPIC-014 provides only an explicit development session kept in memory. Login, refresh tokens, persisted sessions, tenant switching, profiles, and remote preferences remain EPIC-IMP-016.

The browser may persist only the non-sensitive theme preference. Access tokens, tenants, sessions, command payloads, and Query cache are not persisted. Correlation identifiers are generated per request.

## Development

```bash
pnpm install
pnpm --dir clients/typescript build
pnpm --filter @bba/bba-web dev
```

The development setup screen accepts API URL, bearer token, tenant, subject, and actor reference. Values disappear on reload. `VITE_BBA_API_BASE_URL` may provide only the non-secret API origin.

## Validation

```bash
pnpm frontend:check
pnpm contracts:check
pnpm --dir core check
git diff --check
```

The frontend gate covers package boundaries, unit tests, preview deep links, desktop/mobile browser smoke tests, and gzip bundle budgets.
