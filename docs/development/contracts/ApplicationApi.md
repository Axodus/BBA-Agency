# Application API Contract

The Application layer exposes typed, transport-neutral Command and Query ports
for the nine implemented bounded contexts. Commands receive an explicit
`ApplicationCommandContext` and a mutable command containing `reason` and
`idempotencyKey`. Queries receive an independent `QueryContext`.

DTOs are plain records. They do not expose Aggregates, Entities, snapshots,
providers, stores, HTTP types or transport serializers.
