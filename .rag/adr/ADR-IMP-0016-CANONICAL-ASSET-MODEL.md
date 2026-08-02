# ADR-IMP-0016 — Canonical Asset Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Institutional Assets are durable canonical domain objects. Treating an Asset as
a file, rendered document, channel payload or storage location would couple the
domain to Publication and Infrastructure.

## Normative sources

- `BBAPLT-GDE-018-ASSET-DOMAIN-OVERVIEW.md`
- `BBAPLT-GDE-019-ASSET-IDENTITY-AND-CLASSIFICATION.md`
- `BBAPLT-GDE-020-ASSET-CONTENT-AND-REPRESENTATION-MODEL.md`
- `BBAPLT-GDE-021-ASSET-OWNERSHIP-AND-AUTHORITY-MODEL.md`
- `BBA-ADR-0005-ASSET-FIRST-PUBLISHING-MODEL.md`

## Decision

`Asset` is the canonical Aggregate and belongs to exactly one Tenant and one
MissionReference. CanonicalContent captures institutional meaning and rejects
physical representation fields. Classification is semantic. Ownership,
Stewardship, Custody, Authorship and optional decision context are neutral
references; the module never imports Governance. The full canonical lifecycle
is represented, while EPIC-005 owns only create, produce, archive and supersede
transitions.

## Alternatives

- File/document aggregate: rejected because representation is not identity.
- Publication-owned Asset: rejected because approval and publication differ.

## Consequences

Canonical identity survives future representations and channels. Review,
Approval and Publication must add coordination without adding Asset states.

## Invariant impact

- Tenant: all references are intra-Tenant.
- Authority: human context is referenced, never implemented locally.
- Lineage/Evidence: every mutation and version preserves both.
- Mission: represented only by a neutral MissionReference.

## Validation

Domain, serialization and architecture tests validate the model and forbidden
dependencies.

## Supersession

- Supersedes: —
- Superseded by: —
