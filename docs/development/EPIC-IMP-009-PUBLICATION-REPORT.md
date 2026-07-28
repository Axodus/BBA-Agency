# EPIC-IMP-009 - Publication Context Report

Date: `2026-07-22`
Milestone: `M9 - Publication Context Ready`
Status: `PASS`

## Summary

EPIC-IMP-009 implemented an isolated Publication module for institutional
publication preparation, Review eligibility evidence, Governance authorization
snapshots and externally observed publication attempts.

Publication does not approve content, run Review or Governance, mutate Assets,
run Workflow, call Connectors, or store canonical Asset content.

## REQs

All 55 REQs are `DONE`. Evidence is recorded in
`docs/development/traceability-matrix.md`.

## Key outcomes

- `ConnectorReference` is backed by the existing shared `ConnectorId`.
- `PublicationPackage` is immutable from creation.
- `PublicationVersion` represents one complete observed attempt across all
  package destinations.
- `observationBatchKey` prevents duplicate version creation per Publication.
- `PARTIAL` and `FAILED` remain `AUTHORIZED_FOR_CONNECTOR`.
- Only global `SUCCESS` promotes to `PUBLISHED`.
- `PublicationOutcomeRecorded` precedes `PublicationPublished` on success.

## Files created

- `core/src/modules/publication/`
- `core/test/modules/publication/publication.test.ts`
- `docs/adr/ADR-IMP-0028-PUBLICATION-CANONICAL-MODEL.md`
- `docs/adr/ADR-IMP-0029-IMMUTABLE-PUBLICATION-PACKAGES.md`
- `docs/adr/ADR-IMP-0030-PUBLICATION-OWNERSHIP.md`
- `docs/development/contracts/Publication*.md`

## Validation

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | TypeScript strict compile passed. |
| `pnpm --dir core test` | PASS | 21 node:test files passed. |
| `pnpm --dir core check` | PASS | Full Core validation passed. |
| `git diff --check` | PASS | No whitespace errors. |
| demo syntax/JSON checks | PASS | Demo files unchanged and checks passed. |
| browser smoke | NOT_APPLICABLE | `demo/` behavior was not changed. |
| CI remote | NOT_RUN | No push performed. |

## ADRs

- `ADR-IMP-0028 - Publication Canonical Model`: `ACCEPTED`
- `ADR-IMP-0029 - Immutable Publication Packages`: `ACCEPTED`
- `ADR-IMP-0030 - Publication Ownership`: `ACCEPTED`

## Boundaries

- Publication -> Mission: no direct import.
- Publication -> Governance: no direct import.
- Publication -> Review: no direct import.
- Publication -> Institutional Assets: no direct import.
- Publication -> Knowledge & Policy: no direct import.
- Publication -> Workflow: no direct import.
- Publication -> Connector: no direct import.

## Limitations

- No real Connector execution.
- No outbox, retry delivery guarantee or external API.
- No persistence beyond in-memory repository.
- No HTTP API or frontend.

## Decision

EPIC-IMP-009: `PASS`

M9 - Publication Context Ready: `PASS`

Approved next Epic: `EPIC-IMP-010 - Connector Framework`.
