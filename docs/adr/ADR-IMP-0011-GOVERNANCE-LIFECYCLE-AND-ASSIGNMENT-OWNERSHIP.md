# ADR-IMP-0011 — Governance Lifecycle and Assignment Ownership

Status: ACCEPTED

Date: 2026-07-22

## Context

Governance needs lifecycle protection, temporal delegation and suspension
without turning every protective condition into a new institutional state.

## Normative documents

- `BBAPLT-GDE-046-DELEGATION-MODEL.md`
- `BBAPLT-GDE-048-GOVERNANCE-LIFECYCLE.md`
- `BBAPLT-GDE-049-GOVERNANCE-RULES.md`
- `BBAPLT-GDE-051-GOVERNANCE-CONSTRAINTS.md`

## Decision

Authority uses the canonical states `Proposed`, `Active`, `UnderReview`,
`Updated` and `Retired`. Suspension is a time-bounded protective condition,
never a permanent lifecycle state. `DeactivateAuthority` maps to `Retired`.

`Authority` exclusively owns `Assignment[]`. An Assignment belongs to one
Authority and one Tenant. The Aggregate rejects incompatible overlapping active
periods; revocation and expiration are explicit transitions of the owned Entity.

## Consequences

Positive: Aggregate consistency is local, delegation ownership is unambiguous,
and future disciplinary policies do not inflate the canonical lifecycle.

Negative: cross-Authority conflict queries, if later required, belong to an
Application/repository policy and cannot be solved by sharing Assignment state.

## Validation

Governance domain tests cover lifecycle, suspension, ownership, overlap,
revocation and expiration. The Authority contract documents the public API.
