# Application Pipeline Contract

Commands execute as:

```text
validate → derive transaction identity → open Unit of Work → handler → commit → map DTO
```

Validation failure opens no Unit of Work. Handler failure rolls back. A commit
failure is not retried automatically. An uncertain acknowledgment is resolved
through the persistence outcome before any caller retry. Query handlers use a
read-only session and never receive a mutable repository session or Unit of Work.
