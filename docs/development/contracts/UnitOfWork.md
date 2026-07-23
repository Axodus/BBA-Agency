# Unit of Work Contract

Every provider-backed write has an explicit, immutable `TransactionContext`
with transaction, Tenant, actor, correlation and timestamp. A Unit of Work may
stage multiple Aggregates, validates all optimistic expectations, and swaps
snapshots, events, audit and eligible outbox records atomically.

Zero-event commits are valid. Rollback leaves no persistent effect and does not
clear domain events. Captured events are cleared only after confirmed commit.
