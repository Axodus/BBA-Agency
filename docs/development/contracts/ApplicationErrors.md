# Application Error Contract

Public codes are `VALIDATION_FAILED`, `INVALID_TRANSACTION_IDENTITY`,
`IDEMPOTENCY_CONFLICT`, `NOT_FOUND`, `FORBIDDEN_CONTEXT`,
`CONCURRENCY_CONFLICT` and `APPLICATION_FAILURE`.

Public errors do not expose stack traces, Aggregates, complete Command content,
snapshots, provider internals or secrets. They preserve a safe original code,
correlation ID and sanitized diagnostic details.
