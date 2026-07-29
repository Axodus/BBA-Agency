# ADR-IMP-0008 — Canonical Mission Lifecycle Realization

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

EPIC-IMP-002 requests a Mission lifecycle using the labels Draft, Planned,
Active, Paused, Completed, Cancelled, and Archived. The certified Domain State
Model defines a different, normative set of semantic states and states that no
other transition is valid.

## Normative sources

- `BBA-ADR-0002 — Mission as Core Domain Entity`;
- `BBAPLT-GDE-011 — Mission Domain Overview`;
- `BBAPLT-GDE-012 — Mission Lifecycle`;
- `BBAPLT-GDE-013 — Mission State Model`;
- `BBAPLT-GDE-014 — Mission Rules`;
- `BBAPLT-GDE-015 — Mission Policies`;
- `BBAPLT-GDE-016 — Mission Constraints`;
- `BBAPLT-GDE-082 — Backend Domain Realization`;
- `REQ-BBA-CORE-EPIC-IMP-002`.

## Decision

The implementation uses the canonical Mission states verbatim:

`PROPOSED`, `AUTHORIZED`, `PREPARED`, `IN_PROGRESS`, `UNDER_REVIEW`,
`OUTCOME_DECISION`, `PAUSED`, `DEFERRED`, `REJECTED`, `STOPPED`, and
`CLOSED_WITH_LEARNING`.

REQ labels are mapped without becoming alternate states:

| REQ label | Canonical realization |
| --- | --- |
| Draft | `PROPOSED` |
| Planned | `PREPARED`, after `AUTHORIZED` |
| Active | `IN_PROGRESS` |
| Paused | `PAUSED` |
| Completed | `CLOSED_WITH_LEARNING` |
| Cancelled | `STOPPED` |
| Archived | retention marker on a terminal Mission; not a Mission state |

`ActivateMission`, `CompleteMission`, and other requested commands remain
public operations, but they may run only from the canonical predecessor state.
Canonical authorization, preparation, review, outcome, defer, reject, stop,
and reopen transitions are also exposed by the Aggregate.

Each consequential transition carries actor, authority, reason, time, and
Evidence references. EPIC-IMP-002 records these references but does not decide
whether institutional Authority is valid; authority resolution remains owned
by EPIC-IMP-003.

## Alternatives considered

- Implement the REQ labels as Mission states: rejected because it would
  redefine the certified Domain State Model.
- Collapse authorization and preparation into activation: rejected because it
  would bypass explicit semantic transitions and human gates.
- Defer all lifecycle code until Human Governance: rejected because Mission
  must protect its own state transitions before Governance integrations exist.

## Consequences

### Positive

- Domain terminology remains traceable to the Source of Truth.
- Application commands cannot bypass authorization, preparation, review, or
  outcome decisions.
- Archive semantics do not erase or replace the terminal Mission outcome.

### Negative

- Consumers must perform additional canonical transitions before activation or
  completion.
- The REQ state labels require a documented translation when read literally.

### Risks

- Authority references are structurally required but not institutionally
  resolved until EPIC-IMP-003.
- Reopening an archived Mission is refused; a future Governance decision may
  require a linked new Mission or an explicit ADR update.

## Invariant impact

- Tenant: Mission retains exactly one immutable TenantId.
- Authority: transitions require an authority reference but do not self-grant it.
- Accountability: actor, reason, Evidence, and outcome remain attributable.
- Stewardship: Mission intent requires a Steward reference.
- Asset identity: not implemented or changed.
- Lineage: Mission creation and subsequent references remain preserved.
- Evidence: creation and every consequential transition require Evidence.

## Validation

- lifecycle and invalid-transition tests;
- command and event tests;
- Mission contract and architecture tests;
- `pnpm --dir core check`.

## Supersession

- Supersedes: none.
- Superseded by: none.
