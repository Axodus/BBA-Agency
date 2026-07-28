# ADR-IMP-0029 - Immutable Publication Packages

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

A publication attempt must remain auditable after retries. If package contents
or authorization evidence were live references, older attempts could no longer
prove what was submitted.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-009`
- `ADR-IMP-0017 - Immutable Asset Versioning`
- `ADR-IMP-0028 - Publication Canonical Model`

## Decision

`PublicationPackage` is immutable from creation. It contains at least one
Tenant-bound item and one Tenant-bound destination. Each item pairs exactly one
`AssetReference` with exactly one matching `AssetVersionReference`.

Each `PublicationVersion` represents one complete observed attempt across every
declared destination. The manifest stores immutable snapshots of the package,
authorization and attempt number. Retries append a new `PublicationVersion`;
previous versions are never edited.

`PublicationVersionNumber` is separate from Aggregate `Version`.

## Consequences

Historical attempts remain verifiable. Package, manifest and record mutation
must happen by creating a new version, not by editing prior state.

## Validation

Tests cover package immutability, exact destination coverage, deterministic
snapshots, retry numbering and `currentVersionId`.

## Supersession

- Supersedes: -
- Superseded by: -
