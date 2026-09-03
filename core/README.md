# BBA Platform Core

core is the transport-neutral, canonical BBA Platform application boundary. It
contains application contracts and domain modules for Missions, Human
Governance, AI Workforce, Institutional Assets, Knowledge Policy, Workflow,
Review, Publication, and Connector boundaries.

It is not an executable server and is not the Railway deployment. The planned
canonical API path is:

~~~text
core -> transport/http -> contracts/openapi
~~~

That path is intentionally not mounted in this workspace yet. The active
private Publisher runtime instead uses packages/publisher-prototype and
transport/agency-runtime through apps/api. publisher-prototype is a candidate
for future Core integration, not a Core vertical today.

## Commands

From repository root:

~~~bash
pnpm --dir core typecheck
pnpm --dir core test
pnpm --dir core lint
pnpm --dir core format:check
pnpm --dir core architecture
pnpm --dir core check
~~~

Core changes must keep application concerns transport-neutral. Do not couple
Core directly to the active Publisher runtime, database drivers, browser UI, or
external Connector implementations without an approved contract and migration.
