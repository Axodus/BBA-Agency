# ADR-IMP-0021 - Knowledge Reference Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Knowledge must link institutional references without importing Institutional
Assets, Governance, Mission, Workflow, Review, Publication or Connector
modules.

## Normative sources

- `REQ-IMP-006-020` through `REQ-IMP-006-030`
- `REQ-IMP-006-054`
- `ADR-IMP-0004 - Ports and Adapters`

## Decision

`KnowledgeRelationship` belongs to the source Knowledge Aggregate. Its source
must match the Aggregate owner. Its target can be `AssetReference`,
`AssetVersionReference` or `PolicyReference`. Duplicates are detected by
`type + target`. All participants must belong to the same Tenant.

Relationship direction is literal:

- `source SUPPORTS target`
- `source EXPLAINS target`
- `source SUMMARIZES target`
- `source IMPLEMENTS target`

`IMPLEMENTS` means institutional alignment or documentary materialization, not
technical execution of a Policy.

`KnowledgeReferenceValidationPort` validates only structural existence for
Asset and AssetVersion references. It does not load content, evaluate
authorization, mutate Assets or import Institutional Assets.

## Consequences

Cross-context coordination stays in Application through ports. Persistent
validation may replace the in-memory adapter in EPIC-011 without changing the
domain.

## Validation

Architecture tests prohibit lateral imports. Module tests verify relationship
ownership, duplicate rejection, Tenant boundaries and structural validation.

## Supersession

- Supersedes: -
- Superseded by: -
