# ADR-IMP-0044 — Hybrid Publisher Runtime and Ephemeral BYOK

Status: `ACCEPTED`

## Context

The prototype needs reproducible acceptance and optional real model execution
without exposing customer credentials in the browser or coupling product rules
to a provider.

## Decision

Provide deterministic executors as the mandatory path and optional OpenAI or
Anthropic adapters behind one Agent execution port. BYOK keys are accepted only
by the Runtime HTTP service, scoped by tenant/principal, never returned, and
expire after 60 minutes. There is no automatic provider fallback.

## Alternatives

- LLM-only acceptance: rejected because external availability makes the build
  non-deterministic.
- Browser provider calls: rejected because they expose secrets.
- Persistent vault: deferred with Identity/Access and production operations.

## Consequences

Live execution requires an available Runtime and explicit consent. Cold start
or expiry requires key reconfiguration. Provider adapters validate all outputs
against product-owned schemas before persistence.

