# Persistence Architecture Contract

M11 introduces replaceable provider-backed persistence without changing domain
Aggregates. Providers expose snapshots, append-only events, audit records and
an outbox through ports. No concrete database, ORM, queue or broker is selected.

Snapshots are derived from confirmed Aggregate state and are operationally
required for M11 rehydration. A snapshot plus later persisted events is the
accepted read shape; event replay is deferred until the domain exposes replay
contracts.
