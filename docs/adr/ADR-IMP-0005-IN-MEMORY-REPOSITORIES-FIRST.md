# ADR-IMP-0005 — In-Memory Repositories First

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The roadmap requires repositories before persistence selection and explicitly
defers the database decision to EPIC-IMP-011.

## Normative sources

- REQ: `REQ-IMP-000-018`
- `BBAPLT-GDE-083-BACKEND-PERSISTENCE-AND-DATA-ACCESS-CONTRACTS.md`

## Decision

Early domain aggregates use repository ports and deterministic in-memory
adapters. Contract tests precede a real persistence adapter. Optimistic version
semantics are reserved for the domain and repository contracts. Database,
ORM, migrations, transaction technology, and audit storage are deferred to
EPIC-IMP-011.

## Consequences

Development remains fast and deterministic, but in-memory behavior must never
be described as production persistence. A later adapter must pass the same
contract suite.
