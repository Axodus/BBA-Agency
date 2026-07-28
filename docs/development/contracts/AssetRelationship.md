# AssetRelationship Contract

An Asset owns its outgoing immutable relationships. `source DERIVES_FROM
target` means source was derived from target. `source SUPERSEDES target` means
source is the new successor and target is the previous Asset.

DERIVES_FROM and SUPERSEDES must be acyclic. REFERENCES and RELATES_TO may
cycle. Every relationship is intra-Tenant, non-reflexive, authorized by neutral
Authority/Decision references, and preserves rationale, Evidence and Lineage.

Global checks use AssetRelationshipGraphPort in Application. Supersession uses
AssetUnitOfWorkPort so both aggregate updates are a single logical in-memory
commit. Real transactional atomicity is deferred to EPIC-011.
