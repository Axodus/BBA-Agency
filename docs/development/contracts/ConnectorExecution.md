# Connector Execution Contract

`ConnectorExecution` represents one technical attempt.

```text
CREATED → RUNNING → SUCCEEDED|FAILED|CANCELLED
CREATED → CANCELLED
```

The same Tenant + Connector + operation key + idempotency key can create only
one execution. Terminal executions are immutable. The Aggregate validates
transitions and evidence; the Application Layer calls transport and saves the
terminal observation.
