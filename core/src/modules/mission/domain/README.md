# Mission Domain

## Public API do módulo

The domain barrel exports the Mission Aggregate, canonical status and lifecycle,
metadata, intent, outcome, commands, events, snapshot, and rehydration contracts.
Construction and state mutation occur only through `Mission` public methods.

Snapshot parsing helpers are public compatibility boundaries. Event ID creation,
transition maps, reconstruction helpers, and mutable aggregate fields are
internal.
