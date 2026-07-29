# Audit Store Contract

Each confirmed Aggregate mutation creates an immutable `AuditRecord` with
`COMMITTED` result, TransactionContext, Aggregate version, operation and
evidence references. Rollbacks do not leave canonical audit records. Audit is
observability and accountability evidence; it never reconstructs domain state.
