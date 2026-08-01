# REQ-IMP-019-FE-001 — Evidence

## Content, integration, and build validation

```text
pnpm --dir static check:project-content
Project content validation passed: 5 files, schemaVersion 1.0.

pnpm --dir static check:project-pages
Project page integration check passed: 5 generated routes, informational boundary intact.

pnpm --dir static typecheck
tsc --noEmit

pnpm --dir static lint
Lint check passed.

pnpm --dir static format:check
Format check passed.

pnpm --dir static build
Product content validation passed: 5 files, schemaVersion 1.0.
Project content validation passed: 5 files, schemaVersion 1.0.
Project page integration check passed: 5 generated routes, informational boundary intact.
```

The integration check verifies the generated route inventory, the reusable
template, semantic ordered timeline, canonical-content consumption, fallback
handling, the absence of legacy Project pages, and prohibited operational
behavior in the Projects components.

## Browser and visual evidence

The repository contains a repeatable `pnpm --dir static capture:project-evidence`
command. It starts a local Vite server and uses the workspace-provided
Playwright package to capture the required 24 route and viewport screenshots,
fallbacks, checkpoints, revision, traceability, and limitations.

The first sandboxed attempt blocked local server binding with:

```text
Error: listen EPERM: operation not permitted 127.0.0.1:4174
```

The approved browser run completed afterwards and captured 24 primary route and
viewport screenshots, two unavailable-route screenshots, and dedicated human
checkpoint, revision, traceability, and limitations captures. It also verified
direct loading, one `h1`, one `main`, no horizontal overflow, no console errors,
and no failed asset requests at all required viewports. See `route-smoke/` and
`accessibility/` for the machine-readable results.
