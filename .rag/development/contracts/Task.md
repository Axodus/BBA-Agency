# Task Contract

## Definition

`TaskDefinition` belongs to `Workflow` and contains name, kind, neutral
references, optional due date and metadata. It never stores state and never
references `WorkAssignment`.

## Execution

`TaskExecution` belongs to `WorkflowExecution` and may record an optional
`WorkAssignmentReference` observed from an external context.

## State rules

- `READY` is emitted exclusively during Stage activation.
- `recordTaskState()` never produces `READY`.
- Observed states are `ASSIGNED`, `COMPLETED` and `CANCELLED`.
- Terminal failure is recorded by `RecordTaskFailure` and fails the execution.
- Tasks coordinate work; they never execute work.
