# ADR-IMP-0035 — Event Store and Snapshot Strategy

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Persist immutable append-only Domain Events and deep-frozen checksummed
snapshots. The Event Store is canonical history; the snapshot is derived but
operationally required for M11 rehydration. A stream without a snapshot is an
integrity failure, while absence of both means not found.

## Consequences

M11 does not invent technical events or replay events without domain replay
contracts. Aggregate and snapshot versions are distinct from event sequence and
global transaction sequence.
