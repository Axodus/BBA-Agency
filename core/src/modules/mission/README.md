# Mission Module

Mission is the central Aggregate Root of the BBA Platform Core. The module owns
Mission identity, Tenant scope, intent, lifecycle, outcome, Evidence, Lineage,
Version, commands, events, snapshots, and repository contracts.

## Public API do módulo

- `domain/index.ts`: stable domain API;
- `application/index.ts`: application use cases;
- `ports/index.ts`: consumer-owned repository port;
- `infrastructure/index.ts`: in-memory reference adapter.

The module does not implement Human Governance, AI Workforce, Institutional
Assets, Knowledge, Workflow, Publication, Connector, HTTP, database, or ORM
behavior. Authority references carried by transitions are evidence inputs; full
authority resolution belongs to EPIC-IMP-003.
