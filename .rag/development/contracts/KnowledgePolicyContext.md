# Knowledge & Policy Context Contract

## Public API

The module exports Knowledge, Policy, immutable policy versions, policy rules,
Knowledge relationships, commands, events, snapshots, application use cases,
repository ports, reference validation ports and deterministic in-memory
adapters.

## Context boundary

Knowledge & Policy is an independent bounded context. Knowledge references
Assets and Policy only by Shared References. Policy describes institutional
rules but never executes them. Cross-context validation occurs through
Application ports.

## Deferred concerns

Search, embeddings, vector databases, RAG, policy engines, automatic policy
evaluation, Workflow, Review, Publication, Connectors, persistence, ORM, HTTP
and frontend remain outside EPIC-IMP-006.
