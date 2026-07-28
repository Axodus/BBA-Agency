# ADR-IMP-0012 — Global Authority Conflict Resolution

Status: `DEFERRED`

Date: 2026-07-22

Owner: BBA Platform Core

Target Epic: `EPIC-IMP-011 — Persistence and Auditability`

## Context

Human Governance must eventually resolve conflicts that span multiple
Authorities within one Tenant. Local Aggregate state and repositories in-memory
cannot provide a complete global view or durable concurrency semantics.

## Normative sources

- `BBAPLT-GDE-043-AUTHORITY-MODEL.md`
- `BBAPLT-GDE-046-DELEGATION-MODEL.md`
- `BBAPLT-GDE-049-GOVERNANCE-RULES.md`
- `BBAPLT-GDE-051-GOVERNANCE-CONSTRAINTS.md`
- `EPIC-IMP-003 — Human Governance`
- `EPIC-IMP-011 — Persistence and Auditability`

## Decision

Defer complete global Authority conflict resolution to EPIC-IMP-011. It must
use Tenant-scoped persistent queries, durable concurrency controls and an
auditable conflict-resolution policy. It must not be approximated as a
repository-global operation over the current in-memory adapters.

The current Governance implementation continues to reject incompatible
Assignment periods within the owning Authority Aggregate. That local rule does
not claim to solve global cross-Authority conflicts.

## Alternatives considered

- In-memory global scan: rejected because it is not durable or production-safe.
- Sharing Assignment entities between Authorities: rejected because it breaks
  Aggregate ownership and consistency.
- Silent last-write-wins behavior: rejected because it would violate
  accountability, evidence and optimistic concurrency expectations.

## Consequences

### Positive

The gap is explicitly controlled and scheduled with the persistence boundary.
No temporary in-memory behavior is mistaken for the final institutional policy.

### Negative

Cross-Authority conflict detection remains limited until persistence and the
policy are implemented.

### Risks

EPIC-IMP-011 must define precedence, conflict evidence, Tenant scope,
concurrency behavior and escalation outcomes before production persistence is
considered complete.

## Invariant impact

- Tenant: conflicts are always scoped to one Tenant.
- Authority: no Authority gains authority through conflict resolution.
- Accountability: conflicts require an explicit accountable human outcome.
- Stewardship: unresolved conflicts must remain visible and escalatable.
- Lineage: conflict findings and resolution must be traceable.
- Evidence: source Assignments, policies and decisions must be preserved.

## Validation

The current limitation is recorded in the M3 report and this ADR. No global
resolution implementation is introduced in EPIC-IMP-003.

## Supersession

- Supersedes:
- Superseded by:
