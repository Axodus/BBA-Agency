# Publication Context Contract

Status: ACCEPTED for EPIC-IMP-009.

Publication prepares and records institutional publication outcomes. It is an
implementation module and does not override certified canonical context
ownership.

## Ports

- `PublicationMissionPort`: validates Mission reference and eligibility.
- `PublicationReviewPort`: validates Review eligibility only.
- `PublicationGovernancePort`: authorizes publication or archive.
- `PublicationReferenceValidationPort`: validates Asset, AssetVersion and
  Knowledge references.
- `PublicationConnectorEvidencePort`: validates external observation evidence.

No port returns or mutates external Aggregates.

## Out of Scope

Connector execution, uploads, external APIs, queues, outbox, HTTP, frontend,
storage, file generation and real publication delivery.
