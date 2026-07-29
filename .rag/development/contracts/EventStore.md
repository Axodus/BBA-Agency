# Event Store Contract

The Event Store is append-only and assigns per-Aggregate event sequences. A
commit receives one global monotonic transaction sequence; rollback does not
advance it. Events are immutable and include Tenant, Aggregate, transaction and
ordering metadata. M11 does not replay events without a domain replay API.
