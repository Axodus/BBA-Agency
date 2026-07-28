# ADR-IMP-0040 — Canonical HTTP Transport Contract

Status: ACCEPTED  
Date: 2026-07-28

## Decision

The official HTTP adapter is a separate Fastify workspace package. It consumes
only `@bba/platform-core/application`; the Core package export exposes API
Ports, public contexts, DTOs, committed results and the sanitized public error
type, but no bindings, transaction factories, repositories, Domain or
Persistence.

`contracts/openapi/v1/openapi.yaml` is the sole HTTP contract source. Fastify
route schemas, `operation-inventory.json`, contract tests, documentation and
the generated TypeScript SDK are derived from it. An executable operation is
identified by the tuple HTTP method, path and globally unique `operationId`.

OpenAPI 3.1 is restricted to a runtime-compatible JSON Schema subset. Every
public route declares request and response schemas. Response serialization is
closed so additional properties returned accidentally by a collaborator are
not exposed.

## Context and identity

Bearer authentication establishes the principal. `X-Tenant-Id` only requests
a tenant; `TransportAuthorizationPort` authorizes principal, tenant,
`operationId` and optional target. Actor identity comes from the principal.

Commands require `Idempotency-Key`. Resource identity remains client-generated
where M12 requires it; transaction identity and fingerprinting remain wholly
owned by M12. HTTP request IDs are operational and do not affect idempotency.

## Consequences

- 74 executable M12 methods map one-to-one to 74 HTTP operations.
- `assignAsset` remains blocked and absent from runtime surfaces.
- Query pagination, filtering and ordering remain deferred until Application
  Query Ports support them.
- `/health` is minimal; readiness and documentation exposure are opt-in.
- No transport route accesses Domain, repositories, Unit of Work or providers.
