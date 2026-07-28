# ADR-IMP-0003 — Modular Monolith

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

The implementation must preserve bounded responsibilities and directional
dependencies while avoiding premature deployment and service distribution.

## Normative sources

- REQ: `REQ-IMP-000-016`
- `BBAPLT-ARCH-003-BOUNDED-CONTEXT-ARCHITECTURE.md`
- `BBAPLT-GDE-077-ENGINEERING-PRINCIPLES.md`

## Decision

The Core starts as a modular monolith. Future modules are organized by owned
responsibility and bounded context. The Shared Kernel remains minimal. No
microservice, network, or package distribution boundary is introduced by M0.

## Consequences

Local calls are simple and deterministic, while architecture tests and
directional dependency rules must prevent a generic service layer from
collapsing ownership boundaries.

## Validation

The M0 structure contains only bootstrap and architecture tooling. Future
module REQs must add contract and dependency tests.
