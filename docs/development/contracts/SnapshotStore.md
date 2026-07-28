# Snapshot Store Contract

Snapshots are deep-copied, checksummed and versioned. They are derived, not the
canonical history, but are operationally required for M11 rehydration. The
provider rejects identity, checksum, Tenant or event-sequence mismatches.
Rehydrated Aggregates are new mutable domain instances with no shared mutable
references to stores or persisted snapshots.
