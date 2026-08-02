# ADR-IMP-0041 — Agency Product Composition Outside the Core

Status: `ACCEPTED`

## Context

BBA Publisher needs a versioned customer-facing composition without turning a
commercial product into a Platform Aggregate or bounded context.

## Decision

Define `bba.publisher.multiplatform-publication@1.0.0` in a pure Publisher
prototype package. The definition references Customer Outcome, stages, Agents,
channels, deliverables, review obligations, and Platform capabilities. It owns
no institutional state or authority.

## Alternatives

- New Core Aggregate: rejected because it duplicates Product semantics in the
  Domain.
- UI-only configuration: rejected because it is not versioned or testable.
- Generic product engine: deferred because one vertical does not justify it.

## Consequences

The Runtime must map references explicitly to Platform APIs. Future products
may reuse the pattern only after their own governed definition.

