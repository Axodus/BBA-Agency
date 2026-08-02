# Knowledge Aggregate Contract

## Responsibility

Knowledge organizes institutional meaning around neutral references. It does
not own Assets and does not store canonical Asset payload.

## Invariants

- Tenant-bound.
- Starts in `PROPOSED`.
- `KnowledgeRevisionNumber` starts at `1` and increments on semantic mutation.
- `KnowledgeRevisionNumber` is not Aggregate `Version`.
- Relationships are owned by the source Knowledge.
- Asset and Policy references are neutral and intra-Tenant.
- Every mutation preserves reason, Evidence, Correlation, Causation and
  Lineage.

## Public API

Public exports are defined in `core/src/modules/knowledge-policy/domain` and
the module root namespace `KnowledgePolicy`.

## Forbidden dependencies

Knowledge must not import Mission, Governance, AI Workforce, Institutional
Assets, Workflow, Review, Publication, Connector, infrastructure or frontend.
