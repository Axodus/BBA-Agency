# ADR-IMP-0030 - Publication Ownership

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Publication must not approve, review, govern or integrate externally. Those
responsibilities belong to Review, Human Governance and the future Connector
Framework.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-009`
- `ADR-IMP-0027 - Institutional Review Outcomes`
- `ADR-IMP-0004 - Ports and Adapters`

## Decision

Publication owns only publication preparation state, authorization evidence
snapshots and externally observed publication attempt history.

Publication may use `ConnectorId` and `ConnectorReference` as neutral shared
identity/reference primitives. This does not implement a Connector.

All cross-context interaction occurs through ports:

- `PublicationMissionPort`;
- `PublicationReviewPort`;
- `PublicationGovernancePort`;
- `PublicationReferenceValidationPort`;
- `PublicationConnectorEvidencePort`.

No port returns or mutates Aggregates from another module.

## Consequences

Publication remains isolated while preserving enough evidence for future
Connector integration. Connector execution, outbox, retry delivery guarantees
and external APIs remain out of scope.

## Validation

Architecture tests prohibit direct imports to Mission, Governance, Review,
Assets, Knowledge, Workflow, Connector and infrastructure from Publication
domain/application code.

## Supersession

- Supersedes: -
- Superseded by: -
