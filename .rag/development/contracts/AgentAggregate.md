# Agent Aggregate Contract

## Responsibility

Represent a functional, Tenant-bound operational Agent and protect its
lifecycle, capabilities and WorkAssignment concurrency.

## Invariants

- AgentId and TenantId are immutable.
- Agent has no Authority and cannot approve or publish.
- Capability is a Value Object; CapabilitySet is immutable.
- WorkAssignment is operational and distinct from Governance Assignment.
- `BUSY` is derived; it is not persisted as source of truth.

## States and commands

Lifecycle: `PROPOSED → ACTIVE → SUSPENDED → ACTIVE`, with `RETIRED` terminal.
Public commands are `ProvisionAgent`, `ActivateAgent`, `PauseAgent`,
`ResumeAgent`, `RetireAgent` and `AssignAgent`.

## Events and API

Events include `AgentProvisioned`, `AgentActivated`, `AgentPaused`,
`AgentResumed`, `AgentRetired` and `AgentAssigned`. Public API is exported by
`modules/ai-workforce/domain` and `modules/ai-workforce/index`.

## Dependencies and persistence

Only Shared Kernel, Shared References and neutral ports are permitted. The
Agent snapshot contains WorkAssignments and is persisted through
`AgentRepository` with optimistic Version checks.
