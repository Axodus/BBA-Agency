# ADR-IMP-0043 — Session Runtime Over Certified Platform Capabilities

Status: `ACCEPTED`

## Context

The Platform has canonical persistence and APIs, but no durable Agency Project
read model. Creating one in the Core would prematurely redefine the product.

## Decision

Keep the Publisher Project projection in a tenant/principal-scoped in-memory
store and materialize canonical records through the existing Application API.
Project remains a presentation/composition model; Mission, Workflow, Asset,
Review, Governance, and Publication retain ownership.

## Alternatives

- Durable Agency database: deferred until the prototype proves the projection.
- Browser-only state: rejected because it cannot protect secrets or coordinate
  Platform receipts safely.
- New Platform Aggregate: rejected as a semantic duplication.

## Consequences

Deep links work while the Runtime process lives. Cold start loses the Project
projection and requires a new Project. Durable hydration remains an open
decision.

