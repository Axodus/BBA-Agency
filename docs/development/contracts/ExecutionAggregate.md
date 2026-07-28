# Execution Aggregate Contract

## Responsibility

Record one auditable operational execution and its governed result or failure.

## Invariants

- ExecutionId and TenantId are immutable.
- Mission is represented only by `MissionReference`.
- Execution never imports or commands the Mission Aggregate.
- Every execution preserves Agent, WorkAssignment, Evidence, Version,
  Correlation, Causation and Lineage.
- Completed, failed and cancelled executions are immutable.

## States and commands

`PROPOSED → RUNNING → COMPLETED | FAILED | CANCELLED`.
Commands are `StartExecution`, `CompleteExecution`, `FailExecution` and
`CancelExecution`.

## Events and API

Events include `ExecutionStarted`, `ExecutionCompleted`, `ExecutionFailed` and
`ExecutionCancelled`. `ExecutionResult` contains structured output,
uncertainty, limitations, metrics and provenance.

## Dependencies and persistence

Only Shared Kernel, Shared References and neutral ports are permitted. The
`ExecutionRepository` persists deterministic snapshots and checks Version.
