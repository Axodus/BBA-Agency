# ADR-IMP-0031 — Connector Technical Boundary

Status: ACCEPTED
Date: 2026-07-23

## Context

External systems must remain outside the institutional Core domain.

## Decision

Connector is a technical bounded context. It uses neutral ports, references
and DTOs only. It cannot import or mutate Mission, Governance, Workflow,
Review, Publication, Assets, Knowledge or AI Workforce.

## Consequences

The domain remains provider-neutral and external SDKs are deferred to future
adapters. Connector evidence is technical evidence, not institutional
authorization or publication approval.
