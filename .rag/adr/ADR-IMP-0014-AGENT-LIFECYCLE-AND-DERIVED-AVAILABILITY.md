# ADR-IMP-0014 — Agent lifecycle and derived availability

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Canonical documentation separates Agent lifecycle from Assignment execution.
The implementation REQ also requires operational labels such as `BUSY` and
`PAUSED`.

## Normative sources

- `BBAPLT-GDE-034-AGENT-LIFECYCLE.md`
- `BBAPLT-GDE-035-AGENT-STATE-MODEL.md`
- `BBAPLT-GDE-032-RESPONSIBILITY-AND-ASSIGNMENT-MODEL.md`
- `REQ-IMP-004-008`, `REQ-IMP-004-010`, `REQ-IMP-004-011`

## Decision

Agent stores lifecycle `PROPOSED`, `ACTIVE`, `SUSPENDED` or `RETIRED`.
Availability is projected as `AVAILABLE`, `BUSY` or `PAUSED`. `PROVISIONED`
and `RETIRED` remain REQ-compatible public status projections. `BUSY` is
derived from incompatible assigned/active WorkAssignments and is never the
snapshot source of truth. `PAUSED` is an explicit operational transition.
`ActivateAgent` completes the canonical provision-to-active transition.

## Consequences

Snapshots remain deterministic and cannot become stale because of a persisted
derived `BUSY` flag. Agent lifecycle is not runtime health or model process
state. WorkAssignment execution states remain independent.

## Invariant impact

- Tenant: lifecycle and assignments remain Tenant-scoped.
- Authority: lifecycle transitions require audit input; no Agent gains Authority.
- Accountability: every explicit transition carries reason and evidence.
- Lineage: lifecycle events preserve correlation, causation and lineage.

## Validation

Agent lifecycle, projections, busy derivation and snapshot rehydration are
covered by `core/test/modules/ai-workforce/ai-workforce.test.ts`.

## Supersession

- Supersedes: —
- Superseded by: —
