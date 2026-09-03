# BBA Agency Agent Instructions

## Product language

BBA Agency is an AI-first platform concept for institutional knowledge,
Missions, AI Workforce execution, Human Governance, Institutional Assets,
Channel Variants, Distribution Packages, Connectors, and Audit Records. Use
these domain terms precisely. AI executes; humans govern. Do not claim external
publication unless a configured Connector succeeds.

## Active workspace boundaries

- apps/web/ is the BBA Publisher UI deployed through Vercel from repository
  root. Keep browser code free of tokens, database credentials, and private API
  implementation details.
- apps/api/ is the container-ready Railway runtime for the private,
  transitional Publisher API. Container secrets come only from the platform or
  secret manager; .env.local is local-development-only.
- packages/publisher-prototype/ and transport/agency-runtime/ implement the
  current Publisher runtime used by apps/api.
- core/, transport/http/, and contracts/openapi/ describe the canonical BBA
  Platform API direction. No executable Core HTTP host is currently composed or
  deployed.
- contracts/agency/ is the active private Publisher API contract.
- .rag/ is governed implementation documentation. Keep implemented,
  deterministic, planned, and blocked states distinct.

The old deterministic demo and legacy src/ experiments are preserved only in
the archive/dev-legacy-demo-src-2026-09-03 branch. Do not reintroduce or import
them without an approved migration.

packages/publisher-prototype is a candidate for later integration with Core,
not an existing Core vertical. That initiative requires an explicit adaptation
contract, compatibility tests, and a migration plan for the ten private
Publisher endpoints.

## Engineering rules

- Preserve explicit state transitions, lineage, auditability, and visible
  failures.
- Keep API configuration validation strict; do not weaken private-preview
  controls to make a deployment start.
- Do not load .env* in builds or containers and do not copy them into Docker
  images.
- Do not add infrastructure, authentication, databases, queues, or Connectors
  beyond approved scope.
- Avoid unsupported claims: no public production readiness, live autonomous
  agents, real multi-tenancy, or active external Connectors.

## Verification

Run the smallest relevant validation plus:

~~~bash
pnpm workspace:check
pnpm contracts:check
~~~

For API changes run pnpm api:check; for Core changes run
pnpm --filter @bba/platform-core check; for web changes run pnpm web:build
(which checks the emitted bundle for private values).

Use focused commits. Do not push or alter Railway/Vercel settings unless the
user explicitly asks.
