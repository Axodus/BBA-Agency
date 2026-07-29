# EPIC-IMP-016 — BBA Publisher Prototype Report

Status: `IMPLEMENTED_PENDING_FINAL_GATE`

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
| Agency Experience | `apps/bba-web/src/features/publisher/` |
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

Final commands and results are recorded when the closure gate completes. A
PASS cannot be inferred from this interim status.
