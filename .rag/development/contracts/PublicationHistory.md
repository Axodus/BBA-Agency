# Publication History Contract

Status: ACCEPTED for EPIC-IMP-009.

Publication history is append-only and derived from immutable
`PublicationVersion[]` and domain events.

## Rules

- `PublicationOutcomeRecorded` is emitted for every complete observed attempt.
- `PublicationPublished` is emitted only after a global `SUCCESS`.
- For `SUCCESS`, event order is deterministic:

```text
PublicationOutcomeRecorded
PublicationPublished
```

- `PublicationRecord` never changes another bounded context.
- `PublicationRecord` includes external observation evidence but no canonical
  Asset content.
