# EPIC-IMP-016 — BBA Publisher Prototype Report

Status: `PASS_WITH_GAPS`

Normative status: local implementation evidence. Product Vision 2.0 remains
non-normative pending review in the Documentation repository.

## Demonstrable outcome

A customer can select the available Publisher service, create a Project from
Editorial Context, see the promised deliverables, execute a four-responsibility
Agent composition, approve the Editorial Core, produce channel variants for
Blog, LinkedIn, and Instagram, approve the final Editorial Package, and copy
the package for use.

The customer-facing flow uses Project, Project Workspace, Context, Strategy,
Content, Review, and Delivery. Platform concepts remain behind the experience.

## Implementation

| Layer | Evidence |
| --- | --- |
| Agency Product | `packages/publisher-prototype/src/product.ts` |
| Editorial contracts | `packages/publisher-prototype/src/types.ts`, `schemas.ts` |
| Runtime lifecycle | `PublisherProjectService` and deterministic/BYOK executors |
| Platform composition | required `PublisherPlatformCompositionPort` |
| Runtime HTTP | `transport/agency-runtime` |
| Browser client/hooks | `packages/sdk-react/src/agency/` |
| Agency Experience | `apps/web/src/features/publisher/` |
| Human Governance | two explicit, attributed and timestamped decisions |
| Security | authenticated tenant authorization and ephemeral write-only BYOK vault |

`Agency Product`, `Project`, `Editorial Core`, and `Editorial Package` are
composition/projection contracts. No new Platform Aggregate or bounded context
was introduced.

## Honest limitations

- Projects and BYOK credentials use process memory in this prototype.
- The Platform integration is a required port; production composition must
  provide the approved Application API adapter and cannot fall back silently.
- URLs are references and file entries are metadata; no remote fetch or upload
  occurs.
- The deterministic executor is the reproducible acceptance path.
- Live BYOK execution depends on a customer credential and is not exercised in
  CI.
- No Connector executes and no external publication is claimed.

## Validation record

- Agency Product: 6/6 tests passed.
- Agency Runtime HTTP: 5/5 tests passed.
- sdk-react: 17/17 tests passed; 74 canonical Platform bindings preserved.
- BBA Web: 5/5 unit/integration tests passed.
- Playwright: 11 passed; 3 deliberate viewport skips; Publisher journey PASS.
- Core: 168/168 tests passed; lint, format, and architecture PASS.
- OpenAPI: 74 operations (57 Commands, 17 Queries) PASS.
- Browser boundary and bundle baseline: PASS at 177,845 bytes gzip JavaScript
  and 2,422 bytes gzip CSS.
- `git diff --check`: PASS for the implementation changes.

## Gaps preventing PASS

1. The runtime requires `PublisherPlatformCompositionPort`, but this Epic does
   not ship a production composition backed by concrete M12 Application API
   instances. Integration and lifecycle tests use an explicit collaborator;
   there is no permissive fallback. A deployment must supply the approved
   adapter before the Runtime can be considered operational outside the
   controlled prototype.
2. Live OpenAI and Anthropic BYOK smoke tests were not run because no customer
   credential was supplied. The deterministic acceptance path is complete.
3. The repository worktree is not globally clean because a concurrent,
   unrelated edit remains in `static/public/assets/Axodus_logo.svg`. It was not
   modified, staged, or committed by this Epic.

The implemented vertical is demonstrable and tested, but these gaps make
`PASS_WITH_GAPS` the only truthful closure classification.
