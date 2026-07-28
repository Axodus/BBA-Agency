# AssetVersion Contract

AssetVersion is an immutable Entity owned by one Asset. It captures canonical
content, number, predecessor, reason, human DecisionReference, Evidence,
Lineage, timestamp and immutable governanceState.

Every EPIC-005 version starts in `DRAFT`. No public command changes it to
REVIEWED, APPROVED, PUBLISHED or ARCHIVED. Those values preserve future
compatibility only. Creating a version appends it and changes only the owning
Asset's `currentVersionId`; no prior version is mutated or removed.

The public API is construction through Asset, read-only properties,
`toSnapshot` and `fromSnapshot`. It depends only on Shared Kernel primitives
and neutral references.
