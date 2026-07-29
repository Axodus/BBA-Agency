# Outbox Contract

Only events classified as publishable by an external technical projection
create an initial append-only `PENDING` Outbox revision. The payload reference
is a deterministic logical Event Store reference and never contains an
Aggregate, snapshot, raw payload, secret or credential. Dispatch and retry are
outside M11.
