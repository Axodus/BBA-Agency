# ADR-IMP-0009 — Mission Aggregate Stability

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Mission is the central Aggregate Root and its lifecycle is defined by the
certified Domain State Model. Future implementation Epics will add Governance,
Workflow, Assets, Publication, and other contexts around Mission. Without an
explicit stability boundary, those contexts could silently add states or turn
technical coordination into new domain meaning.

## Normative sources

- `BBA-ADR-0002 — Mission as Core Domain Entity`;
- `BBAPLT-GDE-012 — Mission Lifecycle`;
- `BBAPLT-GDE-013 — Mission State Model`;
- `BBAPLT-GDE-014 — Mission Rules`;
- `BBAPLT-GDE-015 — Mission Policies`;
- `BBAPLT-GDE-016 — Mission Constraints`;
- `BBAPLT-GDE-052` through `BBAPLT-GDE-063` — Workflow Domain;
- `BBAPLT-GDE-081` and `BBAPLT-GDE-082` — Backend boundaries and Domain realization;
- `BBAPLT-ARCH-020 — Information Lifecycle`;
- `ADR-IMP-0008 — Canonical Mission Lifecycle`;
- `EPIC-IMP-003` and later implementation REQs.

## Decision

The Mission Aggregate lifecycle is a stable Domain contract.

1. The canonical lifecycle and state set may be changed only after the
   normative Domain documentation is changed, reviewed, and accepted through
   the governed Documentation process.
2. No future implementation Epic, module, adapter, use case, workflow, or
   connector may add a Mission state directly in code.
3. A lifecycle change requires, at minimum, an updated canonical State Model,
   impact analysis for rules and policies, a local ADR, a traceability update,
   transition tests, snapshot compatibility handling, and an explicit gate
   decision.
4. Human Governance may authorize or refuse transitions that already exist;
   it may not create new Mission states through a decision, approval,
   escalation, or delegation.
5. Workflow may orchestrate existing Mission commands and observe their
   events; it may not define, bypass, infer, or mutate Mission transitions.
6. Publication may consume Mission states and context as inputs; it may not
   change Mission lifecycle meaning or transition a Mission as a side effect.
7. Mission remains the owner of its lifecycle invariants, transition guards,
   Version, Evidence, Lineage, and Domain Events.

The existing canonical states remain the only valid state values:

```text
PROPOSED
AUTHORIZED
PREPARED
IN_PROGRESS
UNDER_REVIEW
OUTCOME_DECISION
PAUSED
DEFERRED
REJECTED
STOPPED
CLOSED_WITH_LEARNING
```

## Alternatives considered

- Allow each bounded context to extend Mission with local states: rejected
  because it would fragment the canonical lifecycle and weaken Aggregate
  ownership.
- Let Governance create exceptional states: rejected because Authority may
  decide an existing transition but cannot redefine Domain semantics.
- Let Workflow own operational Mission states: rejected because technical
  process status must not become Mission meaning.
- Treat Publication status as Mission status: rejected because Publication is
  a separate lifecycle concern and cannot imply Mission completion.

## Consequences

### Positive

- Future Epics have a clear extension boundary.
- Mission state semantics remain centralized and reviewable.
- Governance, Workflow, and Publication integrations remain consumers of the
  Aggregate contract.
- New domain meaning cannot enter through an implementation shortcut.

### Negative

- A legitimate lifecycle evolution requires coordinated documentation,
  compatibility, and implementation work.
- Workflow and Governance must express new behavior using existing commands or
  request a formal lifecycle change.

### Risks

- A future implementation could still introduce an unreviewed local status;
  architecture tests and contract review must detect that drift.
- Snapshot and event consumers require compatibility work when a normative
  lifecycle change is approved.

## Invariant impact

- Tenant: no change; Mission remains Tenant-scoped and immutable in Tenant.
- Authority: Governance controls existing transitions but cannot create states.
- Accountability: lifecycle ownership remains inside Mission.
- Stewardship: new transition meaning requires Domain review, not orchestration.
- Asset identity: unaffected; Assets consume Mission context.
- Lineage: lifecycle evolution must preserve prior state and event lineage.
- Evidence: lifecycle changes require documented impact and test evidence.

## Validation

- Mission lifecycle and architecture tests;
- Mission Aggregate contract;
- traceability matrix;
- ADR index review;
- `pnpm --dir core check`.

## Supersession

- Supersedes: none.
- Superseded by: none.
