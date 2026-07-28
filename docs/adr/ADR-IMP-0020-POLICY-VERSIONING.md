# ADR-IMP-0020 - Policy Versioning

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Policies describe institutional rules. They must be auditable and versioned
without becoming a rules engine or workflow executor.

## Normative sources

- `REQ-IMP-006-013` through `REQ-IMP-006-019`
- `REQ-IMP-006-042` through `REQ-IMP-006-047`

## Decision

Policy is an Aggregate. `CreatePolicy` atomically creates the Policy in
`PROPOSED`, creates the first immutable `PolicyVersion`, sets
`currentVersionId` and assigns version number `1`.

`CreatePolicyVersion` requires the predecessor to equal the current version,
creates the next sequential immutable `PolicyVersion`, leaves all prior
versions unchanged and moves only `currentVersionId`.

`PolicyRule` and `PolicyRuleSet` are immutable institutional descriptions.
They do not contain executable expressions, workflow logic, publication logic,
runtime configuration or provider-specific terms.

## Consequences

Policy history is append-only. Activation, archive and supersession transitions
are reserved for future REQs even though the canonical statuses are declared.

## Invariant impact

Every Policy has exactly one current version. `PolicyVersionId` is unique in a
Tenant for the in-memory repository contract.

## Validation

Tests cover atomic initial version creation, predecessor validation,
immutability, unique current version and repository concurrency.

## Supersession

- Supersedes: -
- Superseded by: -
