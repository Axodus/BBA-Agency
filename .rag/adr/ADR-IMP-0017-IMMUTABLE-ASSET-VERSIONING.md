# ADR-IMP-0017 — Immutable Asset Versioning

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Asset history must preserve exactly what content, evidence, lineage and human
decision existed at each version.

## Normative sources

- `BBAPLT-GDE-023-ASSET-VERSIONING-MODEL.md`
- `BBAPLT-GDE-026-ASSET-PROVENANCE-AND-LINEAGE.md`
- `REQ-IMP-005-013` through `REQ-IMP-005-018`

## Decision

`AssetVersion` is an immutable Entity owned exclusively by Asset. Content,
snapshot data, decision, evidence, lineage, predecessor and governanceState do
not change after construction. In EPIC-005 every new version is `DRAFT`; no
local command transitions it to reviewed, approved, published or archived.
`Asset.currentVersionId` is the sole mutable pointer to the current version.
Versions are append-only and never removed.

## Alternatives

- Mutable version rows: rejected because audit history could be rewritten.
- Status flags on multiple versions: rejected as an ambiguous current source.

## Consequences

Snapshots and reconstruction are deterministic. Future Governance and
Publication integration must create explicit contracts rather than mutate a
version from this context.

## Invariant impact

Tenant, decision, Evidence and Lineage are captured per immutable version.
Optimistic aggregate Version checks protect pointer changes.

## Validation

Tests compare old snapshots after new version creation, verify one current
pointer and round-trip complete Aggregate snapshots.

## Supersession

- Supersedes: —
- Superseded by: —
