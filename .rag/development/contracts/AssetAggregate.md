# Asset Aggregate Contract

## Responsibility

Represent the Tenant- and Mission-bound canonical Institutional Asset. Asset
owns all AssetVersions and outgoing AssetRelationships. It is not a file,
rendering, channel payload, publication or storage record.

## Invariants

- AssetId, TenantId and MissionReference never change.
- At least one immutable AssetVersion exists and exactly one ID is current.
- Versions and relationships remain intra-Tenant and append-only.
- The canonical lifecycle is PROPOSED, PRODUCED, UNDER_REVIEW, APPROVED,
  PUBLISHED, ARCHIVED, SUPERSEDED and REJECTED.
- EPIC-005 owns only PROPOSED creation, PROPOSED to PRODUCED, PUBLISHED to
  ARCHIVED, and PUBLISHED to SUPERSEDED.
- Review, approval and publication never receive local commands here.

## Public API

`Asset.create`, `Asset.rehydrate`, `produce`, `createVersion`,
`addRelationship`, `archive`, `supersede`, snapshot accessors and immutable
state readers.

## Events

AssetCreated, AssetProduced, AssetVersionCreated, AssetRelationshipCreated,
AssetArchived and AssetSuperseded preserve Tenant, Version, Evidence,
Correlation, Causation and Lineage.

## Dependencies

Only Shared Kernel and Shared References are permitted. Mission, Governance,
AI Workforce, Review, Workflow, Publication, Connector and Infrastructure
imports are forbidden in domain/application code.

## Persistence

AssetRepository owns the contract. The in-memory adapter uses snapshots and
optimistic Version checks. Persistent storage is deferred to EPIC-011.
