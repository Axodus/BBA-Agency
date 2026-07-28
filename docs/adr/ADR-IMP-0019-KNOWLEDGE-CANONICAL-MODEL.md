# ADR-IMP-0019 - Knowledge Canonical Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Knowledge & Policy must organize institutional meaning without replacing
Institutional Assets. Assets remain the canonical institutional output.
Knowledge interprets and links them through neutral references.

## Normative sources

- `REQ-IMP-006-001` through `REQ-IMP-006-012`
- `REQ-IMP-006-020` through `REQ-IMP-006-025`
- `ADR-IMP-0016 - Canonical Asset Model`

## Decision

Knowledge is an Aggregate in `modules/knowledge-policy`. It is Tenant-bound,
evidence-backed and lineage-aware. It references Assets only through
`AssetReference` and `AssetVersionReference`. It never stores canonical Asset
content, files, rendered documents, search indexes, embeddings or runtime
outputs.

`KnowledgeRevisionNumber` is a semantic public revision. It starts at `1`,
increments on semantic Knowledge mutations and is independent from Aggregate
`Version`, which remains the technical optimistic concurrency control.

## Consequences

Knowledge can be curated, archived, superseded and linked without owning Assets
or importing Institutional Assets. Retrieval, search and policy application are
deferred.

## Invariant impact

Tenant, Evidence, Lineage, Correlation, Causation and Version are preserved.
Knowledge references are neutral and cannot cross Tenant boundaries.

## Validation

Knowledge tests validate lifecycle, revision semantics, snapshots, relationship
ownership and absence of canonical Asset payload.

## Supersession

- Supersedes: -
- Superseded by: -
