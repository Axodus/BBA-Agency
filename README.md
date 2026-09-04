# BBA Agency

BBA Agency is an AI-first platform concept for governed publishing preparation:
institutional knowledge, Missions, AI Workforce execution, Human Governance,
Institutional Assets, Channel Variants, Distribution Packages, and Audit
Records.

This dev workspace contains the active BBA application. The institutional
website is maintained independently in the static branch and is not a workspace
package or runtime dependency here.

## Active delivery paths

| Area | Responsibility | Deployment boundary |
| --- | --- | --- |
| apps/web | BBA Publisher application UI | Vercel, built from repository root by vercel.json |
| apps/api | Private, transitional Publisher API runtime | Railway/container runtime |
| packages/publisher-prototype + transport/agency-runtime | Current Publisher domain implementation and HTTP composition | Used by apps/api |
| core + transport/http + contracts/openapi | Canonical BBA Platform API direction | Planned; no executable host is mounted |
| contracts/agency | Current private Publisher API contract | Used by the active API runtime |

packages/publisher-prototype is a future candidate for integration with the
Core. It is not currently a vertical implemented over the Core. Any such
integration needs its own adaptation contract, compatibility tests, and
migration plan for the ten private endpoints.

## Development

Use Node 24+ and pnpm 11:

~~~bash
corepack enable
pnpm install --frozen-lockfile
~~~

Start the web application:

~~~bash
pnpm web:dev
~~~

For local API development, copy .env.example to .env.local, provide local
values, then start the MongoDB replica set and API:

~~~bash
cp .env.example .env.local
pnpm api:infra:up
pnpm api:dev
~~~

Only api:dev loads .env.local, explicitly through Node's --env-file option.
Shell variables take precedence. Builds and container starts never load .env*;
Railway or another secret manager must inject container values. See
[apps/api/README.md](apps/api/README.md).

## Validation

~~~bash
pnpm workspace:check
pnpm contracts:check
pnpm api:check
pnpm --filter @bba/platform-core check
pnpm web:build
~~~

pnpm web:build includes the web bundle boundary check. It must not expose API
tokens, MongoDB credentials, or other private container values to the browser.

## Archive

The legacy deterministic demo, earlier src/ experiments, memory compose stack,
and root artifacts were removed from this active workspace on September 3,
2026. Their preserved source snapshot is
archive/dev-legacy-demo-src-2026-09-03.

## Scope and claims

The current API is private and transitional. The repository does not claim a
public production API, autonomous external publishing, active external
Connectors, real multi-tenancy, or a completed BBA Platform.

See [AGENTS.md](AGENTS.md) for repository instructions and [.rag/](.rag/) for
governed implementation documentation.
