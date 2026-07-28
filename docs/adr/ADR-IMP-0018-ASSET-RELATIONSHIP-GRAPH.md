# ADR-IMP-0018 — Asset Relationship Graph

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Asset relationships have different semantics. Derivation and supersession
cycles invalidate provenance, while references and general relations can
legitimately be reciprocal.

## Normative sources

- `BBAPLT-GDE-026-ASSET-PROVENANCE-AND-LINEAGE.md`
- `BBAPLT-GDE-027-ASSET-DERIVATION-AND-RELATIONSHIP-MODEL.md`
- `REQ-IMP-005-025` through `REQ-IMP-005-030`

## Decision

The canonical relationship types are `DERIVES_FROM`, `REFERENCES`,
`SUPERSEDES` and `RELATES_TO`. Only DERIVES_FROM and SUPERSEDES are acyclic.
The source is the derived/new Asset and the target is its source/previous
Asset. Global cycle checks belong to `AssetRelationshipGraphPort` in the
Application Layer. EPIC-005 provides an in-memory graph adapter.
`SupersedeAsset(previous, successor)` atomically records
`successor SUPERSEDES previous` and transitions the previous Asset through an
`AssetUnitOfWorkPort`; database transactionality is deferred to EPIC-011.

## Alternatives

- Force a DAG for every relation: rejected because semantic references cycle.
- Validate the global graph inside Asset: rejected because an Aggregate cannot
  load all Tenant Assets.

## Consequences

Local ownership remains in the source Asset. Persistent graph queries and real
transactional atomicity are required when repositories move to EPIC-011.

## Invariant impact

Relationships are intra-Tenant, evidence-backed, lineage-aware and authorized
by neutral references.

## Validation

Tests reject derivation and supersession cycles, permit reciprocal references,
verify direction and simulate atomic commit failure.

## Supersession

- Supersedes: —
- Superseded by: —
