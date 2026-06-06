# BBA-Agency Mock/Local Model

Model date: 2026-06-06

## Purpose

Define the BBA-Agency mock/local operating model required for L2 to L3 recovery without production execution.

## Local-Only Workflow

1. Load synthetic fixture data from `.instructions/fixtures/bba-agency.mock-data.json`.
2. Treat all clients, services, campaigns, proposals, workflows, channels, and deliverables as mock records.
3. Validate fixture shape against documented BBA schema expectations.
4. Run only approved local validation commands from `BBA_REQ_03_VALIDATION_HANDOFF.md`.
5. Record validation output in a report.
6. Keep all production, billing, external automation, CRM, payment, and campaign execution disabled.

## Mock Entities

| Entity | Source | Purpose | Production Use |
| --- | --- | --- | --- |
| Mock client | Fixture `nucleus.clientPartners` | Represents a synthetic BBA client or partner profile. | FORBIDDEN |
| Mock campaign | Fixture `nucleus.campaigns` | Represents planning, review, active, paused, and completed campaign states. | FORBIDDEN |
| Mock service package | Fixture `nucleus.services` | Represents available BBA service options without real pricing or commitments. | FORBIDDEN |
| Mock proposal | Fixture `nucleus.proposals` | Represents draft, review, approved, and blocked approval states. | FORBIDDEN |
| Mock approval state | Fixture `nucleus.proposals`, `nucleus.workflows`, `mockScenarios` | Models governance/treasury/claim review boundaries. | FORBIDDEN |
| Mock invoice placeholder | Fixture `mockScenarios` | Documents that billing is disabled and only placeholder billing states may exist. | FORBIDDEN |
| Mock task/order | Fixture `nucleus.workflows` and `nucleus.deliverables` | Represents local task and deliverable tracking. | FORBIDDEN |
| Mock performance snapshot | Fixture `mockScenarios` and campaign `metrics` | Represents synthetic non-performance-guarantee metrics. | FORBIDDEN |
| Mock permission/claim | Fixture `permissionClaims` | Represents allowed, simulated, and denied actions. | FORBIDDEN |

## Mock Actors

| Actor | Local Permission | Notes |
| --- | --- | --- |
| Mock coordinator | Read and classify mock records; approve local validation handoff. | No production authority. |
| Mock strategist | Draft local strategy and campaign concepts. | No external dispatch. |
| Mock creative agent | Draft synthetic creative deliverables. | No public release. |
| Mock performance reviewer | Read synthetic performance snapshots. | No ads execution. |
| Mock governance reviewer | Flag governance or treasury review requirements. | No DAO approval claim. |

## Local Read-Only Surfaces

- `.instructions` recovery and governance files.
- `.instructions/fixtures/bba-agency.mock-data.json`.
- `src/contracts/bba.schemas.ts`.
- `src/contracts/schemas.ts`.
- `src/types/bba.ts`.
- `src/config/permissions.ts`.
- `src/utils/mock-agent.ts`.

## Simulated Operations

- campaign intake;
- proposal draft/review/approval state modeling;
- creative package planning;
- non-production deliverable tracking;
- permission-denied scenario documentation;
- local-only schema/contract validation planning;
- synthetic metric snapshot review.

## Forbidden Real Operations

- real client management;
- real client records;
- real billing;
- real invoices or payment collection;
- external automation;
- production campaign dispatch;
- CRM dispatch;
- ad platform execution;
- payment flows;
- production API calls;
- secrets or credentials;
- production readiness claims.

## Lifecycle States

| Lifecycle | Fixture Representation | Notes |
| --- | --- | --- |
| Draft | proposal `draft`, deliverable `planned` | Local-only preparation. |
| Pending approval | proposal `under-review`, workflow `approval` | Requires review before any external claim. |
| Approved mock | proposal `approved`, deliverable `approved` | Mock approval only, not publication or execution approval. |
| Rejected mock | proposal `blocked`, workflow blocker | Represents safe denial path. |
| Paused mock | campaign `paused` | Represents halted local concept. |
| Completed mock | campaign `completed` | Synthetic historical scenario only. |

## Expected Fixture Coverage

- draft campaign scenario;
- pending approval scenario;
- approved mock campaign/proposal scenario;
- rejected or blocked scenario;
- paused campaign scenario;
- incomplete mock client profile;
- mock package/service option;
- mock permission denied scenario;
- synthetic performance snapshot;
- claim boundary examples.

## L3 Evidence Criteria

BBA-Agency can move toward L3 candidate only when:

- this model exists;
- the fixture baseline exists and uses fake data only;
- fixture-to-schema mapping is documented;
- permission and claim boundaries are documented;
- BBA-REQ-03 handoff is created;
- safe local validation executes or blockers are documented;
- no production execution is enabled.
