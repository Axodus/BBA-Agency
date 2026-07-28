# BBA Agency Retrieval and Governance Corpus

`.rag/` is the versioned internal knowledge surface for implementation
planning, architectural decisions, contracts, traceability, and delivery
evidence. It is governed repository content, not a generated cache.

## Collections

- `development/`: implementation controls, public contract descriptions,
  reports, traceability, and local development evidence.
- `architecture/`: implementation architecture and EPIC-level architecture
  records.
- `adr/`: durable local Architecture Decision Records. These do not override
  the certified ADRs in the private Axodus Documentation corpus.
- `plans/`: historical plans and status snapshots for the legacy experimental
  implementation. These records are retrieval context, not current
  architectural authority or proof of production readiness.

## Boundaries

- The certified source of truth remains the governed private Documentation
  corpus identified by `development/source-index.md`.
- `demo/docs/` remains with the deterministic reference demo and is not part of
  this internal corpus.
- Product claims must distinguish implemented behavior, deterministic or
  simulated behavior, planned work, and blocked work.
- Moving a document into `.rag/` does not promote its authority or completion
  status.

