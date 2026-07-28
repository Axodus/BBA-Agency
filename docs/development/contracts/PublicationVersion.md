# PublicationVersion Contract

Status: ACCEPTED for EPIC-IMP-009.

`PublicationVersion` represents exactly one complete observed publication
attempt for all destinations declared in the package.

## Invariants

- Version number starts at 1 and is monotonic.
- One record per destination.
- Retries append a new version.
- Previous versions are immutable.
- `observationBatchKey` is unique per Publication.
- Manifest is a snapshot of package and authorization, not a live reference.
- `SUCCESS` requires all records to succeed.
- `FAILED` requires all records to fail.
- `PARTIAL` requires a mix of successes and failures.
