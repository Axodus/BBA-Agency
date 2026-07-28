# Publication Aggregate Contract

Status: ACCEPTED for EPIC-IMP-009.

`Publication` owns publication preparation state, authorization snapshots and
externally observed publication attempt history.

## Public API

- `Publication.create`
- `prepare`
- `authorize`
- `recordOutcome`
- `archive`
- `toSnapshot`
- `rehydrate`
- `serialize`

## Invariants

- Exactly one `PublicationPackage`.
- Lifecycle: `DRAFT -> READY -> AUTHORIZED_FOR_CONNECTOR -> PUBLISHED -> ARCHIVED`.
- Only global `SUCCESS` promotes to `PUBLISHED`.
- `PARTIAL` and `FAILED` remain `AUTHORIZED_FOR_CONNECTOR`.
- `currentVersionId` is the only mutable pointer to the current attempt.
- Aggregate `Version` is for optimistic concurrency only.
- Publication never stores canonical Asset content.
- Publication never mutates Review, Governance, Assets, Workflow or Connector.

## Dependencies

Allowed: Shared Kernel, Shared References and Publication ports.

Forbidden: direct imports to Mission, Governance, Review, Institutional Assets,
Knowledge, Workflow, Connector, infrastructure and frontend.
