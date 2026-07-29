# Stage Contract

## Definition

`StageDefinition` belongs to `Workflow` and contains:

- `StageId`
- name
- dependency Stage IDs
- Task IDs
- metadata

It contains no execution state.

## Execution

`StageExecution` belongs to `WorkflowExecution` and contains:

- `StageId`
- status

Valid statuses are `PENDING`, `ACTIVE`, `COMPLETED` and `SKIPPED`.

## Transition rules

`AdvanceStage(executionId, nextStageId, disposition, audit)` is explicit.
There is no automatic next-stage selection. `StageDisposition` is limited to
`COMPLETE` and `SKIP`.
