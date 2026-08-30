# BBA API

`@bba/api` is the private, container-ready composition of the Agency Runtime.
It persists Publisher Projects and command idempotency records in MongoDB. It
is intentionally not a public API deployment: production startup requires an
explicit private-preview flag, and BYOK credential persistence is disabled.

Required local variables:

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
