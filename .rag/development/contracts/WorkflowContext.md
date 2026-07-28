# Workflow Context Contract

## Boundary

Workflow & Mission Orchestration coordinates institutional processes through
Shared Kernel primitives, Shared References and ports.

## Ports

- `MissionWorkflowPort` validates Mission references and eligibility.
- `WorkflowGovernancePort` authorizes transitions and cancellations.
- `WorkflowAssignmentPort` validates and notifies assignment references.
- `WorkflowAssetPort` validates Asset references.
- `WorkflowKnowledgePort` validates Knowledge and Policy references.
- `WorkflowDependencyGraphPort` validates DAG structure only.

No port returns or mutates Aggregates from other bounded contexts.

## Deferred concerns

BPMN, scheduler, queues, sagas, event bus, retry automation, Workflow engine,
Review, Publication, Connectors, database persistence, HTTP APIs,
authentication, authorization and frontend remain outside EPIC-IMP-007.
