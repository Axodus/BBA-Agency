# EPIC-IMP-013 — Transport Adapters

Status: PASS  
Date: 2026-07-28  
Dependency: EPIC-IMP-012B executable Application API surface

## Delivered surface

The official HTTP transport is isolated from Core internals and exposes the
current executable Application API through `/api/v1`.

| Artifact | Contract |
| --- | --- |
| Canonical HTTP contract | `contracts/openapi/v1/openapi.yaml` |
| Derived traceability inventory | `contracts/openapi/v1/operation-inventory.json` |
| Runtime adapter | `@bba/http-transport` |
| Public Core dependency | `@bba/platform-core/application` |
| Generated client | `@bba/api-client` |

```text
Application methods:        74
OpenAPI operations:         74
Fastify bindings:           74
Callable SDK operations:    74
Blocked operations exposed: 0
```

`assignAsset` remains blocked by the absence of an approved use case.
`executeTransport` remains outside the Application API because it belongs to a
future Connector runtime.

## Contract and runtime

The OpenAPI document is the only HTTP contract source. It carries the bounded
context, Application method and command/query classification for every
operation. The adapter loads those operations, derives Fastify validation and
response schemas, and resolves exactly one composed API Port method.

Commands require `Idempotency-Key` and return the public committed result.
Queries ignore that header and return only M12 projections. Replay is not
distinguished by HTTP because the M12 contract deliberately returns the same
confirmed result for initial execution and replay.

Authentication and authorization are mandatory ports. Bearer authentication
establishes the actor; tenant access is authorized separately against the
OpenAPI `operationId`. Correlation and causation are propagated to M12 while
request and trace identifiers remain transport concerns.

## Operational policy

- `/health` reports process liveness only.
- `/ready` is opt-in for infrastructure-controlled exposure.
- `/openapi/v1.json` and `/docs` are opt-in and disabled by default.
- Operational responses never disclose provider, database, dependency or
  tenant details.

## Deferred behavior

Pagination, ordering and filtering are not implemented in HTTP because the
three current list Query Ports return complete tenant collections. Adding that
semantics requires a future Application API contract expansion.

## Validation

The completion report must record these literal gates:

```bash
pnpm --dir core check
pnpm --dir transport/http check
pnpm --dir clients/typescript check
pnpm contracts:check
git diff --check
```

`demo/`, legacy `src/`, Domain, Use Cases and Persistence are outside this
EPIC. Changes under `core/src` are limited to the additive package facade.

All five gates passed on 2026-07-28. The Core suite completed 33/33 tests; the
transport suite completed its six integration/architecture tests; the client
drift check confirmed 74 callable operations.

```text
EPIC-IMP-013 — Transport Adapters: PASS
```
