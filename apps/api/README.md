# BBA Publisher API

@bba/api is the container-ready Railway runtime for the private, transitional
Publisher API. It composes packages/publisher-prototype with
transport/agency-runtime, persists Publisher Projects and idempotency records
in MongoDB, and exposes the contract in contracts/agency/v1/openapi.yaml.

It is not the canonical BBA Platform API. The planned canonical direction is
core plus transport/http plus contracts/openapi; no executable Core HTTP host
is mounted or deployed today.

## Local development

The repository requires Node 24+. Copy the repository-root .env.example to
.env.local and provide local, non-production values:

~~~bash
cp .env.example .env.local
pnpm api:infra:up
pnpm api:dev
~~~

api:infra:up starts MongoDB 7 as replica set rs0, which is required because the
runtime uses transactions. Stop it with pnpm api:infra:down. Its named volume
is retained unless explicitly removed with Docker.

api:dev explicitly loads only ../../.env.local with Node --env-file. Existing
shell variables take precedence; .env.local supplies only absent values. No
other .env.* file is discovered or loaded.

Required API variables:

~~~text
MONGODB_URI=mongodb://127.0.0.1:27017/bba-agency?replicaSet=rs0
BBA_API_PRIVATE_PREVIEW=true
BBA_API_DEV_ACCESS_TOKEN=replace-with-a-local-secret
BBA_API_TENANT_ID=tenant-local
BBA_API_SUBJECT=steward-local
BBA_API_ACTOR_REFERENCE=person:steward-local
BBA_API_ALLOWED_ORIGINS=http://localhost:5173
~~~

PORT is optional and defaults to 3000. Startup fails explicitly with
API_PUBLIC_ACTIVATION_BLOCKED when the private preview is not enabled,
API_CONFIGURATION_MISSING:<VARIABLE> when a required variable is absent, or
API_CONFIGURATION_INVALID:PORT for an invalid port.

## Container deployment

pnpm build and pnpm start do not load .env files. .dockerignore excludes all
.env* files. Production/container values must come from Railway or another
secret manager, never from a copied environment file.

The MongoDB deployment must support transactions through a replica set or
managed equivalent. Do not expose this service publicly until a real
authentication adapter and encrypted credential vault are implemented.

From repository root:

~~~bash
pnpm build
pnpm start
~~~

Vercel is separate: its root vercel.json builds apps/web and does not deploy
this API.
