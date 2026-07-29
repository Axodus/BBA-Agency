# ADR-IMP-0042 — Editorial Core as the Publisher Source of Truth

Status: `ACCEPTED`

## Context

Generating channel content independently can alter facts, positioning, and
intent.

## Decision

Create a versioned Editorial Core from Editorial Context and require Human
Governance approval before channel adaptation. Every factual content block
must reference an Editorial Claim and its evidence.

## Alternatives

- Independent channel prompts: rejected due to semantic drift.
- First generated article as the source: rejected because format and canonical
  message become conflated.

## Consequences

The extra checkpoint slows the happy path but prevents errors from cascading
to every channel and enables deterministic traceability tests.

