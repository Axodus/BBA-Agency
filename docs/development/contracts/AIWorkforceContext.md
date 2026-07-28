# AI Workforce Context Contract

## Public API

The module exports `Agent`, `Execution`, `WorkAssignment`, `Capability`,
`CapabilitySet`, policies, statuses, commands, events, snapshots, repository
ports, in-memory adapters and `AIWorkCoordinator`.

## Coordination

`AIWorkCoordinator` coordinates through `GovernanceWorkAuthorizationPort`.
The port receives neutral Tenant, Mission, Authority, Decision, Evidence and
Lineage references and returns `AUTHORIZED` or `REJECTED`. It does not expose
Decision or Approval internals to AI Workforce.

## Forbidden dependencies

AI Workforce domain and application code must not import Mission, Governance,
Assets, Knowledge, Workflow, Publication, Connector, Frontend or
Infrastructure. Only Shared Kernel, Shared References and neutral ports are
allowed.

## Deferred concerns

LLM providers, model routing, prompts, MCP, runtime execution, external
connectors, queues, persistence beyond in-memory adapters and HTTP APIs remain
outside EPIC-IMP-004.
