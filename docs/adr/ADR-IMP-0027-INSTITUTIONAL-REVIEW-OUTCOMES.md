# ADR-IMP-0027 - Institutional Review Outcomes

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Review must distinguish assessment and recommendation from Governance
Decision, Approval and Publication authorization. Labels such as `APPROVED`
would permit consumers to infer authority that Review does not own.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-008`
- `BBAPLT-GDE-037 - Quality Gates and Review Obligations`
- `BBAPLT-GDE-045 - Decision and Approval Model`
- `BBAPLT-GDE-049 - Governance Rules`
- `ADR-IMP-0010 - Governance/Mission Context Boundary`

## Decision

The immutable final record is named `ReviewConclusion`, not
`ReviewDecision`. Its outcomes are:

- `ACCEPTANCE_RECOMMENDED`;
- `REVISION_REQUESTED`;
- `REJECTION_RECOMMENDED`;
- `DEFERRED`;
- `ESCALATION_RECOMMENDED`;
- `REFUSED`;
- `ADDITIONAL_EVIDENCE_REQUIRED`;
- `INCONCLUSIVE`.

Completion requires external Governance authorization represented by neutral
Decision and Authority references. This authorization permits finalization of
the Review record; it is not Approval of the reviewed object.

Publication receives only `notifyReviewOutcomeAvailable` after persistence.
The notification does not authorize distribution or publication.

## Consequences

Review consumers receive explicit recommendations without ambiguity about
Authority. Approval and Publication remain separately evidenced decisions and
actions.

Notification failure after save is visible but does not roll back the stored
Review. Retry, outbox and guaranteed delivery remain deferred.

## Validation

Tests cover every outcome, Governance rejection, archive authorization, and
failure before save, during save and after save.

## Supersession

- Supersedes: -
- Superseded by: -
