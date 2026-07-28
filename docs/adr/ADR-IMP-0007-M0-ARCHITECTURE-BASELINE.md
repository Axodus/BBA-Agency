# ADR-IMP-0007 — M0 Architecture Baseline

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

M0 completed the repository foundation and established boundaries that future
domain implementation must not alter implicitly.

## Normative sources

- `docs/development/M0-REPOSITORY-READY-REPORT.md`
- `docs/development/architecture-baseline.md`
- `BBAPLT-GDE-079-IMPLEMENTATION-TRACEABILITY-AND-ADR-PRACTICE.md`
- `BBAPLT-GDE-080-QUALITY-AND-CONTRIBUTION-GATES.md`

## Decision

Record `M0 — Repository Ready`, version `1.0`, as an internal immutable
architecture baseline. Structural changes after M0 require an accepted ADR or
approved Change Control before code changes are made.

## Consequences

Future REQs can rely on stable repository, runtime, dependency-direction, and
validation assumptions. This does not freeze domain evolution, and it does not
create a Git tag, release, or production claim.

## Validation

M0 evidence is recorded in the repository-ready report. The baseline document
and this ADR are the audit handles for subsequent structural changes.
