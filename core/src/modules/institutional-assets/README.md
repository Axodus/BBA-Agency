# Institutional Assets public API

The module exports the canonical `Asset` aggregate, immutable `AssetVersion`, semantic classification and relationship value objects, application use cases, consumer-owned ports, and deterministic in-memory adapters.

Review, approval, publication, rendering, storage, workflow, and Connector behavior are intentionally absent. Other bounded contexts may consume neutral references but must not import this aggregate.
