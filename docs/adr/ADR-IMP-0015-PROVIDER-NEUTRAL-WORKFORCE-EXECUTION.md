# ADR-IMP-0015 — Provider-neutral Workforce execution

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

AI Workforce must describe functional operational capacity without coupling
the domain to a model provider, prompt format, runtime or connector.

## Normative sources

- `BBAPLT-GDE-029-AI-WORKFORCE-DOMAIN-OVERVIEW.md`
- `BBAPLT-GDE-030-AGENT-IDENTITY-AND-CLASSIFICATION.md`
- `BBAPLT-GDE-031-CAPABILITY-MODEL.md`
- `BBAPLT-GDE-082-BACKEND-DOMAIN-REALIZATION.md`
- `REQ-IMP-004-002`, `REQ-IMP-004-005`, `REQ-IMP-004-025`

## Decision

Agent contains functional identity, purpose, capabilities, limitations,
quality criteria and definition version only. Capability is a Value Object;
CapabilitySet is immutable. Execution contains structured result, uncertainty,
limitations, provenance and neutral references. Mission is represented only by
MissionReference. Execution never imports or commands the Mission Aggregate.
Provider/runtime adapters are deferred to later infrastructure boundaries.

## Consequences

- Provider changes do not change Agent or Execution domain contracts.
- Tests remain deterministic and can use fake coordination ports.
- Connector and runtime integration remain explicit future work.

## Invariant impact

- Tenant: all execution references are Tenant-bound.
- Authority: Agent cannot approve, publish or authorize itself.
- Accountability: results preserve evidence, uncertainty and limitations.
- Lineage: execution events retain causal and provenance context.

## Validation

Domain tests verify provider-neutral fields and neutral Mission references;
architecture tests reject Mission, Governance, Connector and Infrastructure
imports from AI Workforce domain and application code.

## Supersession

- Supersedes: —
- Superseded by: —
