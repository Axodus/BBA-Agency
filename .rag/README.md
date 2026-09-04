# BBA Agency Retrieval and Governance Corpus

`.rag/` is the versioned internal knowledge surface for implementation
planning, architectural decisions, contracts, traceability, and delivery
evidence. It is governed repository content, not a generated cache.

## Collections

- `development/`: implementation controls, public contract descriptions,
  reports, traceability, and local development evidence.
- `architecture/`: implementation architecture and EPIC-level architecture
  records.
- `product/`: local, non-normative product narratives that translate the
  governed Product Vision into implementation-facing customer journeys.
- `adr/`: durable local Architecture Decision Records. These do not override
  the certified ADRs in the private Axodus Documentation corpus.
- plans/: historical plans and status snapshots. These records are retrieval
  context, not current architectural authority or proof of production
  readiness.

## Boundaries

- The certified source of truth remains the governed private Documentation
  corpus identified by `development/source-index.md`.
- Historical records may refer to the archived deterministic demo and src/
  experiments. Their preserved snapshot is
  archive/dev-legacy-demo-src-2026-09-03; they are not active workspace areas.
- Product claims must distinguish implemented behavior, deterministic or
  simulated behavior, planned work, and blocked work.
- Moving a document into `.rag/` does not promote its authority or completion
  status.
