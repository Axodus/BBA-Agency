# ADR-IMP-0028 - Publication Canonical Model

Status: `ACCEPTED`
Date: `2026-07-22`
Owner: `BBA Platform Core`

## Context

Publication must separate preparation, Review eligibility, Governance
authorization, external outcome observation and the `PUBLISHED` state.
Approval is not publication, and Review eligibility is not Approval.

## Normative sources

- `REQ-BBA-CORE-EPIC-IMP-009`
- `ADR-IMP-0027 - Institutional Review Outcomes`
- `ADR-IMP-0010 - Governance/Mission Context Boundary`
- Development-layer rules for Publication and Connector evidence

## Decision

The local implementation module is `core/src/modules/publication/`. It is an
isolated implementation module for publication process state and does not
redefine the certified canonical bounded-context map.

Publication lifecycle is:

```text
DRAFT -> READY -> AUTHORIZED_FOR_CONNECTOR -> PUBLISHED -> ARCHIVED
```

`PARTIAL` and `FAILED` external observations keep the aggregate in
`AUTHORIZED_FOR_CONNECTOR`. Only a global `SUCCESS` observation promotes it to
`PUBLISHED`.

## Consequences

Publication can preserve publication evidence without owning Review,
Governance, Assets, Workflow, Knowledge or Connector. External publication is
not claimed unless a Connector-owned observation is recorded through a port.

## Validation

Publication tests cover lifecycle, invalid transitions, result derivation,
events and architecture isolation.

## Supersession

- Supersedes: -
- Superseded by: -
