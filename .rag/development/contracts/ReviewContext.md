# Review Module Contract

## Boundary

Review is an isolated implementation module for institutional assessment.
Human Governance remains the canonical owner of Authority, Decision and
Approval under the certified architecture.

## Ports

- `ReviewMissionPort` validates Mission reference and eligibility.
- `ReviewReferenceValidationPort` validates review targets structurally.
- `ReviewGovernancePort` authorizes completion and archive.
- `ReviewWorkflowPort` notifies Review start and completion.
- `ReviewPublicationPort` notifies that an outcome is available.

No port returns or mutates an Aggregate from another module. Notifications run
only after save. A post-save notification failure remains visible and does not
undo the persisted mutation.

## Deferred concerns

Approval application, Publication, retries, outbox, guaranteed delivery,
database persistence, distributed voting, signatures, HTTP and frontend are
outside EPIC-IMP-008.
