# BBA API

`@bba/api` is the private, container-ready composition of the Agency Runtime.
It persists Publisher Projects and command idempotency records in MongoDB. It
is intentionally not a public API deployment: production startup requires an
explicit private-preview flag, and BYOK credential persistence is disabled.

## Local development

The repository runtime is Node 24 or later. Copy the repository-root
`.env.example` to a repository-root `.env.local`, fill in the required values,
then start the local MongoDB replica set and API:

```bash
cp .env.example .env.local
pnpm api:infra:up
pnpm api:dev
```

`api:infra:up` starts an API-specific MongoDB 7 replica set named `rs0` and
waits until it is ready. It is intentionally separate from
`docker-compose.memory.yml`, whose standalone MongoDB instance is unsuitable
for the API transaction boundary. Stop the local API database with
`pnpm api:infra:down`; its named volume remains unless you explicitly remove it
with Docker.

`api:dev` (and `pnpm --filter @bba/api dev`) explicitly loads only
`../../.env.local` through Node's `--env-file` option. It does not scan or load
other `.env.*` files. `.env.example` remains a committed reference only, while
`.env.local` is developer-local and ignored by Git.

Precedence is deterministic: values already injected into the shell environment
take precedence; `.env.local` fills values that are otherwise absent. `PORT`
defaults to `3000`; every variable below is required and startup reports
`API_CONFIGURATION_MISSING:<VARIABLE>` when one is absent.

```text
MONGODB_URI=mongodb://127.0.0.1:27017/bba-agency?replicaSet=rs0
BBA_API_PRIVATE_PREVIEW=true
BBA_API_DEV_ACCESS_TOKEN=replace-with-a-local-secret
BBA_API_TENANT_ID=tenant-local
BBA_API_SUBJECT=steward-local
BBA_API_ACTOR_REFERENCE=person:steward-local
BBA_API_ALLOWED_ORIGINS=http://localhost:5173
```

## Container deployment

`pnpm build` and `pnpm start` do not load `.env` files. The Docker context
excludes every `.env*` file, and production/container values must be injected
by the deployment platform or secret manager.

Required container variables:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/bba-agency?replicaSet=rs0
BBA_API_PRIVATE_PREVIEW=true
BBA_API_DEV_ACCESS_TOKEN=replace-with-a-local-secret
BBA_API_TENANT_ID=tenant-local
BBA_API_SUBJECT=steward-local
BBA_API_ACTOR_REFERENCE=person:steward-local
BBA_API_ALLOWED_ORIGINS=http://localhost:5173
```

The MongoDB deployment must support transactions (replica set or managed
equivalent). Do not expose this service publicly until a real authentication
adapter and an encrypted credential vault are implemented.

From the repository root, container-oriented builders may use:

```bash
pnpm build
pnpm start
```

Vercel does not use these generic commands; the root `vercel.json` explicitly
selects the separate `apps/web` build.
