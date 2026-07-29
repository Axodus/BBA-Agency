# ADR-IMP-0038 — Application Idempotency Fingerprinting

Status: ACCEPTED  
Date: 2026-07-23

## Decision

`transactionId` is derived from Tenant, bounded context, operation and
`idempotencyKey`. A separate canonical Command payload fingerprint uses
`application-command-canonical-v1` and SHA-256. It includes `reason` and
normalized operation data, but excludes correlation, causation, generated
timestamps and the idempotency key itself.

## Consequences

Repeated identical intent is idempotent. Reusing a key for different intent is
an `IDEMPOTENCY_CONFLICT`. Existing domain ID factories are not changed merely
for this API; generated IDs are created once and confirmed outcomes are reused.
