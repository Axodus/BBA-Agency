# Application API Contract

The M12 Application layer exposes one intentionally small, transport-neutral
public surface: the Mission Command and Query ports declared in
`ApplicationApiPorts.ts`.

Commands receive an explicit `ApplicationCommandContext` and a mutable command
containing `reason` and `idempotencyKey`. Every successful first execution and
idempotent replay returns the same provider-neutral
`CommittedOperationResultDto`. Detailed state is retrieved through Queries,
which receive an independent `QueryContext`.

DTOs are plain records. They do not expose Aggregates, Entities, snapshots,
providers, stores, HTTP types or transport serializers.

Exports from bounded-context `application/index.ts` files are available
capabilities, not automatic public API obligations. Expansion of the public
surface belongs to `EPIC-IMP-012B`.
