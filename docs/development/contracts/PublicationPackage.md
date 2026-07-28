# PublicationPackage Contract

Status: ACCEPTED for EPIC-IMP-009.

`PublicationPackage` is immutable from creation and contains only
Tenant-bound references.

## Invariants

- At least one item.
- At least one destination.
- Each item pairs exactly one `AssetReference` with exactly one matching
  `AssetVersionReference`.
- Destinations are unique by key.
- Items, destinations and optional Knowledge references belong to the
  Publication Tenant.
- No content, file, channel payload or Connector request is stored.
