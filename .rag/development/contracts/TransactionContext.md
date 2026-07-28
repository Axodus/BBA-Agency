# Transaction Context Contract

`TransactionContext` is immutable and mandatory for provider-backed writes.
There are no implicit actors, Tenant values or system defaults. Reusing a
committed transaction ID with identical staged content is idempotent; differing
content is a persistence conflict. `getTransactionOutcome` resolves uncertain
acknowledgment without silently repeating a commit.
