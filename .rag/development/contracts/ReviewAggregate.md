# Review Aggregate Contract

## Public API

The Review module exports `Review`, commands, events, snapshots, ports,
application use cases and the deterministic in-memory repository.

## Responsibilities

`Review` owns one immutable ReviewRequest, its ReviewSessions, all Findings and
one optional ReviewConclusion. It evaluates institutional evidence but never
alters the reviewed object.

## Invariants

- Review belongs to exactly one Tenant and one MissionReference.
- Review owns exactly one stable ReviewRequest.
- ReviewScope is immutable from creation and contains at least one target.
- Only one ReviewSession may be ACTIVE.
- ReviewConclusion exists exactly when Review is COMPLETED or ARCHIVED.
- Completion requires at least one CLOSED session and no unresolved session.
- Archive requires COMPLETED state and explicit Governance authorization.
- No outcome changes another bounded context.

## Lifecycle

`PROPOSED -> IN_REVIEW -> COMPLETED -> ARCHIVED`.

## Events

Every mutation emits a Review event preserving Tenant, Version, Evidence,
Correlation, Causation and Lineage. Archive emits `ReviewArchived`.
