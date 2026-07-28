# ADR-IMP-0025 - Review Canonical Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The Core needs an isolated implementation module for institutional assessment
without transferring Approval or institutional Authority away from Human
Governance. The certified architecture treats Review as a governance
capability rather than a separate canonical bounded context.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-008`
- `BBAPLT-GDE-037 - Quality Gates and Review Obligations`
- `BBAPLT-GDE-045 - Decision and Approval Model`
- `BBAPLT-ARCH-003 - Bounded Context Architecture`
- `ADR-IMP-0003 - Modular Monolith`
- `ADR-IMP-0004 - Ports and Adapters`

## Decision

`core/src/modules/review/` is an isolated domain implementation module. It
owns the Review process, requests, sessions, Findings and non-binding
conclusions. It does not become the canonical owner of Approval or Authority.

Review references Mission and review targets only through neutral Shared
References. Governance authorization is obtained through a port and recorded
as external authorization evidence. No Review outcome changes another
Aggregate or authorizes Publication.

`Review` owns exactly one immutable `ReviewRequest`. The request has a stable
identity distinct from `ReviewId`, cannot be replaced, and owns an immutable
`ReviewScope` from creation.

## Consequences

Review behavior can evolve behind a stable module boundary while Human
Governance retains canonical institutional Authority. Consumers must not
interpret a Review conclusion as Approval.

## Validation

Review tests validate request ownership, Tenant-bound scope, lifecycle,
non-binding outcomes and absence of automatic cross-context effects.
Architecture tests reject lateral imports.

## Supersession

- Supersedes: -
- Superseded by: -
