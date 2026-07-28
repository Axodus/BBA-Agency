# WorkAssignment Entity Contract

## Responsibility

Bind an Agent to bounded operational work in a Mission, including required
Capabilities, policy, evidence, governance references and completion criteria.

## Distinction

`WorkAssignmentId` and `WorkAssignmentReference` are exclusive to AI
Workforce. Governance delegation uses `AssignmentId` and
`AssignmentReference`; the entities and rules are never shared.

## States and rules

Execution states include `UNASSIGNED`, `ASSIGNED`, `ACTIVE`, `BLOCKED`,
`AWAITING_REVIEW`, `COMPLETED`, `REJECTED`, `REFUSED`, `CANCELLED` and
`FAILED`. An Agent cannot hold incompatible assigned/active WorkAssignments
simultaneously.

## Ownership and dependencies

WorkAssignment is an Entity owned by Agent. It uses only neutral Mission,
Tenant, Authority and Decision references and does not import any bounded
context Aggregate.
