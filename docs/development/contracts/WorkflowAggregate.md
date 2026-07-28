# Workflow Aggregate Contract

## Public API

The Workflow module exports `Workflow`, `WorkflowMetadata`,
`StageDefinition`, `TaskDefinition`, commands, events, snapshots, ports,
application use cases and deterministic in-memory adapters.

## Responsibilities

`Workflow` is a coordination definition. It owns immutable Stage and Task
definitions, belongs to one Tenant and one Mission reference, and exposes
only create, activate and archive lifecycle behavior.

## Invariants

- `Workflow` starts in `PROPOSED`.
- `Workflow` is immutable after `ACTIVE`, except `ArchiveWorkflow`.
- `StageDefinition` and `TaskDefinition` contain no execution state.
- `TaskDefinition` never contains `WorkAssignmentReference`.
- Stage dependencies form a DAG.
- All references are Tenant-bound.
- Workflow never mutates Mission or another bounded context.

## Events

`WorkflowCreated`, `WorkflowActivated` and `WorkflowArchived` preserve Tenant,
Version, Evidence, Correlation, Causation and Lineage.
