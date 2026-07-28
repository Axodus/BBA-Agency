# ReviewFinding Contract

ReviewFinding is immutable and remains attached to its origin ReviewSession.
It contains category, severity, statement, recommendation, Evidence, Lineage
and recorded timestamp.

A Finding cannot change session or Tenant. Only an ACTIVE session can accept a
new Finding. Finding IDs are unique within a Review.
