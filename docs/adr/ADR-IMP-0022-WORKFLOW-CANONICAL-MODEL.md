# ADR-IMP-0022 - Workflow Canonical Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Workflow must coordinate institutional work without owning Mission,
Governance, AI Workforce, Institutional Assets, Knowledge, Review,
Publication or Connector state.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-007`
- `BBAPLT-ARCH-015 - Coordination Model`
- `ADR-IMP-0003 - Modular Monolith`
- `ADR-IMP-0004 - Ports and Adapters`

## Decision

Workflow is implemented as a bounded context for coordination only.
`Workflow` is a definition aggregate and contains immutable
`StageDefinition` and `TaskDefinition` values. Definitions contain no runtime
state.

`TaskDefinition` never references `WorkAssignment`. Assignment observations
belong to `TaskExecution` and enter the module only through application use
cases.

Workflow references other contexts only through Shared References and ports.
No Workflow domain object imports another bounded context.

## Consequences

Workflow can coordinate Missions and related work without acquiring ownership
or authority from other contexts. Future Workflow behavior must preserve the
definition/execution split and cannot add direct imports to business contexts.

## Validation

`workflow.test.ts` validates immutable definitions, lifecycle and neutral
references. `bounded-context-matrix.test.ts` validates absence of lateral
imports.

## Supersession

- Supersedes: -
- Superseded by: -
