# ADR-IMP-0034 — Canonical Persistence Architecture

Status: ACCEPTED  
Date: 2026-07-23

## Decision

Use provider-backed Ports and Adapters with explicit `TransactionContext` and
multi-Aggregate Unit of Work. Domain models and repository contracts remain
independent of database, ORM and broker technology.

## Consequences

Commit, rollback, Tenant isolation and optimistic expectations are centralized.
Concrete database selection and migrations remain deferred. A provider-backed
write cannot occur without actor, Tenant, correlation and transaction identity.
