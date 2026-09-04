# ADR-IMP-0004 — Application Deployment Boundary

Status: `ACCEPTED`
Date: `2026-08-30`
Owner: `BBA Agency`

## Decision

The repository remains a monorepo with independent application entrypoints:

- `apps/web` is the React/Vite browser UI and is deployed by Vercel from the
  repository root using the root `vercel.json`.
- `apps/api` is the private, container-ready Agency Runtime composition.
- the `static` branch remains an independent institutional Vite surface with
  its own root deployment configuration.

`apps/api` persists Publisher Projects and command idempotency in MongoDB
transactions. It is not activated publicly. A real authentication adapter and
an encrypted provider-credential vault are prerequisites for public runtime
activation.

## Consequences

The browser consumes application-facing SDK contracts and does not import Core
or HTTP transport modules. The deterministic Publisher prototype remains
fixture-based until a separate runtime-integration requirement explicitly
changes that behavior.
