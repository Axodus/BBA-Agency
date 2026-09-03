# ADR-IMP-0045 — Active Development Workspace Application Boundary

Status: ACCEPTED

Date: September 3, 2026

## Context

The dev branch contained active application code together with a legacy
deterministic demo, earlier campaign-oriented src/ experiments, a memory stack,
and root artifacts. The institutional static website has its own static branch.
Keeping all of these surfaces in one active workspace obscured build,
deployment, and ownership boundaries.

## Decision

The active dev workspace contains only the BBA application surfaces:

- apps/web is the Vercel UI;
- apps/api is the Railway/container runtime for the private, transitional
  Publisher API;
- packages/publisher-prototype and transport/agency-runtime form the active
  Publisher runtime;
- core, transport/http, and contracts/openapi remain the canonical Platform API
  direction without an executable host.

The deterministic demo, src/ experiments, memory compose stack, package-lock,
and root artifacts are removed from the active workspace and preserved by
archive/dev-legacy-demo-src-2026-09-03.

## Consequences

Vercel retains repository root as its Root Directory and builds apps/web.
Railway retains its API build/start path. This decision makes no external
configuration change.

publisher-prototype is not represented as a Core vertical. A future integration
requires an adaptation contract, compatibility tests, and a migration plan for
the ten private Publisher endpoints. It is deliberately outside this cleanup.

The root workspace check prevents archived surfaces and root scripts from being
reintroduced accidentally.
