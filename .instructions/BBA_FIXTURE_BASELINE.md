# BBA-Agency Fixture Baseline

Baseline date: 2026-06-06

## Fixture Path

Primary fixture:

```text
.instructions/fixtures/bba-agency.mock-data.json
```

The fixture is stored under `.instructions/fixtures` because BBA-REQ-01 did not identify a safe repo-native fixture path and runtime source paths must not be changed in BBA-REQ-02.

## Fixture Schema Summary

Top-level keys:

| Key | Purpose |
| --- | --- |
| `metadata` | Declares mock/local purpose, safety boundaries, and source request. |
| `nucleus` | BBA-domain aggregate shaped to align with `BbaNucleusSchema`. |
| `mockScenarios` | Scenario registry for required L3 fixture coverage. |
| `permissionClaims` | Local permission and claim boundary examples. |
| `validationExpectations` | Expected BBA-REQ-03 validation handling. |

The file intentionally includes a documentation-governance wrapper. Schema-level validation should target the `nucleus` object because that sub-object is shaped like `BbaNucleusSchema`.

The `nucleus` object maps to:

- `services`
- `campaigns`
- `clientPartners`
- `proposals`
- `workflows`
- `brandAssets`
- `institutionalChannels`
- `deliverables`

## Records Included

| Record Type | Count | Notes |
| --- | ---: | --- |
| Services | 2 | Mock service options for governance communication and creative production. |
| Campaigns | 5 | Planning, under-review, approved-local label, paused, and completed local scenarios. |
| Client partners | 2 | One complete internal mock client and one incomplete-profile mock client. |
| Proposals | 4 | Draft, under-review, approved, and blocked approval states. |
| Workflows | 4 | Intake, validation, approval, and monitoring examples. |
| Brand assets | 2 | Draft/review local creative assets. |
| Institutional channels | 2 | Planned/review-gated local channels. |
| Deliverables | 4 | Planned, review-ready, approved, and blocked deliverable states. |
| Permission claims | 5 | Allowed, simulated, and forbidden action examples. |

## Scenarios Represented

| Scenario | Fixture Evidence | Status |
| --- | --- | --- |
| Draft campaign | `mock-campaign-draft-001`, `mock-proposal-draft-001` | PRESENT |
| Pending approval | `mock-campaign-review-001`, `mock-proposal-review-001` | PRESENT |
| Approved mock campaign | `mock-campaign-approved-local-001`, `mock-proposal-approved-local-001`, `mock-deliverable-report-001` | PRESENT |
| Rejected mock campaign | `mock-proposal-blocked-001`, `mock-deliverable-blocked-001` | PRESENT |
| Paused mock campaign | `mock-campaign-paused-001` | PRESENT |
| Mock client with incomplete profile | `mock-client-incomplete-001` | PRESENT |
| Mock package/service option | `mock-service-governance-comms-001`, `mock-service-creative-kit-001` | PRESENT |
| Mock permission denied scenario | `mock-permission-denied-ads-execution-001` | PRESENT |

## Expected Consumers

- BBA-REQ-03 validation planning.
- Documentation-only L3 evidence reports.
- Future schema validation scripts, if explicitly scoped.
- Human review of mock/local boundaries.

No runtime code consumes this fixture in BBA-REQ-02.

## Validation Expectations

BBA-REQ-03 should:

1. Validate JSON syntax with `python -m json.tool`.
2. Confirm all fixture records are synthetic.
3. Validate the `nucleus` aggregate against `BbaNucleusSchema` if a safe local command is created or available.
4. Confirm wrapper metadata, scenarios, and permission claims remain documentation-only governance evidence.
5. Run only approved local validation commands.
6. Keep production/external execution disabled.

## Known Gaps

- No runtime fixture loader exists.
- `src/contracts/bba.schemas.ts` is not currently wired into the active `CONTRACT_MAP`.
- This fixture is documentation-governance evidence, not product runtime data.
- Billing, invoice, payment, and ad execution examples are placeholders or denied claims only.

## Forbidden Production Use

The fixture must not be used for:

- real client onboarding;
- billing;
- invoicing;
- CRM dispatch;
- ad platform execution;
- external automation;
- public performance claims;
- production readiness claims.
