# ADR-IMP-0039 — Application Transaction Sessions

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Handlers receive only validated context, normalized Commands and a restricted
transactional repository session. Commit, rollback, provider, stores and
transaction objects remain owned by the pipeline runner.

Queries use a separate read-only session with no save or staging capability.

## Consequences

Handlers can coordinate repositories and existing module use cases without
altering Aggregates. The transaction boundary remains testable and transport
independent.
