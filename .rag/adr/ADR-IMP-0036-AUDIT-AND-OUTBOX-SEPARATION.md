# ADR-IMP-0036 — Audit and Outbox Separation

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Audit records describe confirmed mutations and always use `COMMITTED`. Outbox
messages are created only for events selected by a technical projection and
carry opaque Event Store references. Audit is not domain state and Outbox is
not an audit trail.

## Consequences

Rollback leaves neither record. Dispatch, retry and delivery guarantees remain
outside M11. The separation prevents integration concerns from contaminating
Aggregate behavior.
