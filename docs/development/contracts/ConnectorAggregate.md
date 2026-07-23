# Connector Aggregate Contract

Connector represents a Tenant-bound technical provider registration.

Lifecycle:

```text
REGISTERED → ACTIVE
ACTIVE → SUSPENDED → ACTIVE
REGISTERED|ACTIVE|SUSPENDED → RETIRED
```

Capabilities are immutable after registration. Only an `ACTIVE` Connector may
accept new executions. Suspension does not cancel executions already running.
Connector has no institutional authority and never imports another context.
