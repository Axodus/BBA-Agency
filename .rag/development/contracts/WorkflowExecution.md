# WorkflowExecution Contract

## Public API

`WorkflowExecution` supports start, advance stage, pause, resume, record task
state, record task failure, complete, cancel and fail operations.

## Responsibilities

`WorkflowExecution` is the only runtime instance of a Workflow. It references
one immutable Workflow definition version and one Mission reference.

## Invariants

- `WorkflowExecution` never mutates `Workflow`.
- Later Workflow definition changes do not affect executions already started.
- Exactly one Stage can be active while running.
- `StageExecution` references exactly one `StageDefinition`.
- `TaskExecution` references exactly one `TaskDefinition`.
- `READY` is produced only by Stage activation.
- `recordTaskState()` accepts only `ASSIGNED`, `COMPLETED` and `CANCELLED`.
- `WorkflowExecution` failure is explicit through failure commands.
- `COMPLETED` requires all Stages to be `COMPLETED` or `SKIPPED`.

## Events

Execution events preserve Tenant, Version, Evidence, Correlation, Causation
and Lineage.
