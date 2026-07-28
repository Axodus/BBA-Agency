# Application API Contract

The M12 Application layer exposes an intentionally small, transport-neutral
public surface: the Mission, Governance and AI Workforce Command and Query
ports declared in `ApplicationApiPorts.ts`. Institutional Assets additionally
exposes the executable `createAsset`, `registerAsset`, `retireAsset`,
`getAsset` and `listAssets` surface. `assignAsset` remains blocked until an
approved application use case exists.

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

Knowledge / Policy, Workflow, Review, Publication and Connector are exposed
through bounded-context-specific typed ports. Connector `executeTransport`
remains a technical runtime exclusion from the public Application API.
