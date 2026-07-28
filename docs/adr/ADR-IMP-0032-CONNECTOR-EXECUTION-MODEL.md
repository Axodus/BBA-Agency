# ADR-IMP-0032 — Connector Execution Model

Status: ACCEPTED
Date: 2026-07-23

## Decision

`ConnectorOperationKey` is a local immutable value object; no operation
Aggregate is introduced. A ConnectorExecution is one idempotent technical
attempt. The Application Layer saves `CREATED`, saves `RUNNING`, invokes the
transport port, normalizes the result, saves the terminal state and only then
delivers an observation.

The same Connector, operation key and idempotency key cannot create multiple
executions in one Tenant. Suspension blocks new executions but does not cancel
running executions.
