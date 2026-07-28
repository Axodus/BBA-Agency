# Institutional Assets Context Contract

## Public API

The module exports Asset, AssetVersion, CanonicalContent, AssetMetadata,
AssetClassification, AssetAuthorityContext, AssetRelationship, commands,
events, snapshots, application use cases, AssetRepository,
AssetRelationshipGraphPort, AssetUnitOfWorkPort and deterministic in-memory
adapters.

## Context boundary

Institutional Assets represents canonical governed meaning. It references a
Mission and human authority context only through Shared References. It never
imports another bounded context. Cross-Aggregate graph and supersession
coordination occur in Application through consumer-owned ports.

## Deferred concerns

Review, approvals, publication, representations, files, formats, channels,
Connectors, search, persistence, ORM, HTTP and frontend remain outside
EPIC-IMP-005.
