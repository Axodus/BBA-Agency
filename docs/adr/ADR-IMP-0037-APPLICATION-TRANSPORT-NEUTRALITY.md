# ADR-IMP-0037 — Application Transport Neutrality

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Application API Ports are typed by bounded context and operation. They expose
Commands and Queries without HTTP, controllers, framework types, status codes,
OpenAPI or transport serializers.

## Consequences

The same Application contracts can be consumed by future HTTP, CLI or worker
adapters. Query sessions remain read-only and Commands preserve domain ownership
of business rules.
