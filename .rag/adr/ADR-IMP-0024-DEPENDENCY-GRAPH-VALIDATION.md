# ADR-IMP-0024 - Dependency Graph Validation

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Stage dependencies must form a DAG, but Workflow must not become a scheduler
or automatically choose the next Stage.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-007`
- `ADR-IMP-0004 - Ports and Adapters`
- `ADR-IMP-0022 - Workflow Canonical Model`

## Decision

`WorkflowDependencyGraphPort` exposes only structural validation:
`wouldCreateDependencyCycle(...)`.

The port does not choose a Stage, order execution or execute work. The caller
explicitly supplies `nextStageId` to `AdvanceStage`. `StageDisposition` is a
closed contract with `COMPLETE` and `SKIP`.

The in-memory adapter is deterministic and validates graph cycles. Persistent
graph validation can replace it in EPIC-011 without changing the domain.

## Consequences

Dependency validation remains separate from execution policy. Workflow keeps
explicit transitions and does not introduce implicit automation.

## Validation

Workflow tests cover DAG acceptance, cycle rejection, explicit Stage selection
and closed `StageDisposition` behavior.

## Supersession

- Supersedes: -
- Superseded by: -
