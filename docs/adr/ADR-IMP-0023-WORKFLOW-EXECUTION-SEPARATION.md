# ADR-IMP-0023 - Workflow Execution Separation

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Workflow definitions must remain stable while executions record operational
progress. Stage and Task state cannot be stored inside the definition.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-007`
- `BBAPLT-ARCH-015 - Coordination Model`
- `ADR-IMP-0022 - Workflow Canonical Model`

## Decision

`WorkflowExecution` is the only executable instance. It references exactly one
`WorkflowReference`, one `MissionReference` and a frozen snapshot of the active
Workflow definition version.

`WorkflowExecution` owns `StageExecution[]` and `TaskExecution[]`. Each
`StageExecution` references exactly one `StageDefinition`. Each
`TaskExecution` references exactly one `TaskDefinition`.

`READY` is produced only when a Stage is activated. `recordTaskState()` accepts
only `ASSIGNED`, `COMPLETED` and `CANCELLED`. `TaskReady` is emitted
exclusively during Stage activation. Terminal failure enters through
`RecordTaskFailure` or `FailWorkflowExecution`.

`WorkflowExecution` never mutates `Workflow`. Later changes to a Workflow
definition do not affect executions already started.

## Consequences

Execution progress remains auditable and independent from definition
maintenance. Recovery semantics can be added later without changing Workflow
ownership boundaries.

## Validation

Workflow tests validate definition freezing, Stage/Task execution references,
TaskReady origin, task observation and failed execution behavior.

## Supersession

- Supersedes: -
- Superseded by: -
