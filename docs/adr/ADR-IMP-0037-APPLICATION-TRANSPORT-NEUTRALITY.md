# ADR-IMP-0037 — Application Transport Neutrality

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Application API Ports are typed by bounded context and operation. M12 exposes
only the explicitly declared Mission surface. Module application exports do not
become public API automatically. Additional bounded-context operations require
an intentional surface-expansion requirement.

Commands and Queries remain free of HTTP, controllers, framework types, status
codes, OpenAPI or transport serializers.

## Consequences

The same Application contracts can be consumed by future HTTP, CLI or worker
adapters. Query sessions remain read-only and Commands preserve domain ownership
of business rules. Deferred use cases are tracked by `EPIC-IMP-012B`; they do
not reduce M12 coverage.
