# ADR-IMP-0004 — Ports and Adapters

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The certified architecture requires domain meaning to remain independent from
runtime, persistence, Agent providers, and external Connectors.

## Normative sources

- REQ: `REQ-IMP-000-017`
- `BBA-ADR-0004-DOMAIN-BEFORE-ARCHITECTURE.md`
- `BBAPLT-GDE-081-BACKEND-BOUNDARY-AND-RESPONSIBILITIES.md`
- `BBAPLT-GDE-082-BACKEND-DOMAIN-REALIZATION.md`

## Decision

Domain and application responsibilities sit inside the Core. Ports belong to
the consuming responsibility. Adapters implement those ports at the boundary.
Infrastructure may translate and execute, but may not redefine domain rules,
Authority, ownership, Lineage, or publication meaning.

## Consequences

Repositories, Agent runtimes, and Connectors can be replaced behind contracts.
The initial Core deliberately has no adapter beyond bootstrap tooling.

## Validation

Architecture boundaries are enforced in M0; domain contract tests begin with
EPIC-IMP-001 and later REQs.
