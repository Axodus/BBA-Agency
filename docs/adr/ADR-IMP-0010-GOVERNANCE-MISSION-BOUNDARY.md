# ADR-IMP-0010 — Governance/Mission Context Boundary

Status: ACCEPTED

Date: 2026-07-22

## Context

Human Governance authorizes institutional actions while Mission owns Mission
lifecycle. Direct Aggregate dependencies would create circular coupling and
allow Governance to bypass Mission commands.

## Normative documents

- `BBAPLT-GDE-041-HUMAN-GOVERNANCE-DOMAIN-OVERVIEW.md`
- `BBAPLT-GDE-043-AUTHORITY-MODEL.md`
- `BBAPLT-GDE-045-DECISION-AND-APPROVAL-MODEL.md`
- `BBAPLT-GDE-081-BACKEND-BOUNDARY-AND-RESPONSIBILITIES.md`
- `ADR-IMP-0009-MISSION-AGGREGATE-STABILITY.md`

## Decision

Governance never imports or knows the Mission Aggregate. `Decision` stores only
`MissionId`. Mission stores only neutral Authority, Decision and Approval
references from `shared/references/`. Coordination is performed by the
Application layer through `GovernanceAuthorizationPort` and `MissionCommandPort`.
The authorization port returns only `AUTHORIZED` or `REJECTED`.

Bounded contexts may depend on Shared Kernel primitives but may not import one
another laterally. `core/src/application/` is the sole coordination exception.

## Consequences

Positive: no circular dependencies, explicit command ownership, and a stable
boundary for AI Workforce, Workflow, Publication and Connector.

Negative: Application coordination requires neutral command contracts and
reference validation in more than one boundary.

## Invariants

Tenant, Authority, Lineage, Evidence and accountability remain explicit.
Governance cannot directly mutate Mission or grant institutional authority to
an Agent.

## Validation

`core/test/architecture/bounded-context-matrix.test.ts` rejects lateral imports.
`DecisionAuthorizationService` and `GovernedMissionCommandCoordinator` test the
public-port interaction.
