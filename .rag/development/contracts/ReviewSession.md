# ReviewSession Contract

ReviewSession is an Entity owned by one Review. Its lifecycle is
`PLANNED -> ACTIVE -> CLOSED`, with `CANCELLED` from PLANNED or ACTIVE.

`PlanSession` creates PLANNED state and `OpenSession` activates an existing
session. A Review may have only one ACTIVE session. Findings can be recorded
only while the session is ACTIVE.

CLOSED sessions may contribute to ReviewConclusion. CANCELLED sessions and
their Findings remain auditable but are excluded from consolidation.
