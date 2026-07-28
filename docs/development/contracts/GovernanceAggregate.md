# Governance Aggregate Contract

Status: ACCEPTED for EPIC-IMP-003.

## Responsibility

Human Governance represents institutional authority, bounded delegation and
accountable human decisions. It does not authenticate actors or grant itself
technical permissions.

## Aggregates and ownership

- `Authority` owns `Assignment[]`.
- An Assignment belongs to exactly one Authority and one Tenant.
- `Decision` owns its `Approval` entity.
- `Decision` references `MissionId`, never a Mission object.

## Invariants

- Authority is human and Tenant-bound.
- Assignment periods cannot overlap incompatibly.
- Suspension is a protective condition, not lifecycle state.
- Decision and Approval preserve Evidence, Lineage, Version and audit metadata.
- Finalized Decision is read-only in every field.
- Governance never mutates Mission directly.

## Public API

The module exports the Aggregates, value objects, commands, events, repository
ports, in-memory adapters and `DecisionAuthorizationService`. Internal snapshot
helpers and mutation functions are not exported as application contracts.

## Dependencies

Allowed: Shared Kernel and public Application authorization contracts.

Forbidden: Mission, AI Workforce, Assets, Knowledge, Workflow, Publication,
Connector, HTTP, frontend, database, ORM and authentication infrastructure.
