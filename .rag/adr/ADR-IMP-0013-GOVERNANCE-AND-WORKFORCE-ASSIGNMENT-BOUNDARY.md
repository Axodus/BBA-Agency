# ADR-IMP-0013 — Governance Assignment and WorkAssignment boundary

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Governance `Assignment` delegates institutional authority to a human. AI
Workforce `WorkAssignment` assigns bounded operational work to an Agent. The
same word must not imply the same entity, identity, ownership or authority.

## Normative sources

- `BBAPLT-GDE-032-RESPONSIBILITY-AND-ASSIGNMENT-MODEL.md`
- `BBAPLT-GDE-036-COORDINATION-AND-DELEGATION.md`
- `BBAPLT-GDE-038-AI-WORKFORCE-RULES.md`
- `REQ-IMP-004-004`, `REQ-IMP-004-013`

## Decision

Governance uses `AssignmentId` and `AssignmentReference`. AI Workforce uses
`WorkAssignmentId` and `WorkAssignmentReference`. WorkAssignment is an Entity
owned by Agent for operational concurrency; it never delegates Authority and
is never shared with Governance.

## Consequences

- Assignment ownership and authorization remain human and institutional.
- Operational concurrency can be protected inside the Agent Aggregate.
- Cross-context coordination uses neutral references and Application ports.
- Future persistence must retain the two models separately.

## Invariant impact

- Tenant: every reference is Tenant-bound.
- Authority: only Governance references may authorize operational work.
- Accountability: WorkAssignment preserves Mission, Agent and evidence context.
- Lineage: operational history does not replace Governance history.

## Validation

`core/test/modules/ai-workforce/ai-workforce.test.ts` verifies distinct IDs,
ownership and incompatible assignment rejection. Architecture tests prohibit
lateral context imports.

## Supersession

- Supersedes: —
- Superseded by: —
