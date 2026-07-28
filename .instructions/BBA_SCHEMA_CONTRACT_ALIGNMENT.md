# BBA-Agency Schema And Contract Alignment

Alignment date: 2026-06-06

## Existing Zod Schemas Detected

| File | Schema Surface | Fixture Alignment |
| --- | --- | --- |
| `src/contracts/bba.schemas.ts` | `BbaServiceSchema`, `BbaCampaignSchema`, `BbaClientPartnerSchema`, `BbaProposalSchema`, `BbaWorkflowSchema`, `BbaBrandAssetSchema`, `BbaInstitutionalChannelSchema`, `BbaDeliverableSchema`, `BbaNucleusSchema` | Fixture `nucleus` is shaped to this aggregate. |
| `src/contracts/schemas.ts` | Active agent output `CONTRACT_MAP` and `validateAgentOutput` helper | Fixture does not directly map to active agent output contracts. |
| `src/config/env.ts` | Environment schema with mock default | BBA-REQ-03 should force mock env. |

## TypeScript Contracts Detected

| File | Contract Surface | Fixture Alignment |
| --- | --- | --- |
| `src/types/bba.ts` | BBA service, campaign, client partner, proposal, workflow, brand asset, channel, and deliverable interfaces | Fixture records use matching field names where possible. |
| `src/types/agent.interface.ts` | Agent interface | Used as context for local mock agent workflow only. |
| `src/types/index.ts` | Campaign pipeline and agent output types | Not directly targeted by the BBA fixture baseline. |
| `src/config/permissions.ts` | Tool permissions and access levels | Fixture `permissionClaims` mirrors allowed/simulated/forbidden boundaries. |

## Fixture-To-Schema Mapping

| Fixture Path | Schema / Type | Status |
| --- | --- | --- |
| `metadata` | Documentation-governance wrapper | DOCUMENTED_ONLY |
| `nucleus.services[]` | `BbaServiceSchema`, `BbaService` | COVERED |
| `nucleus.campaigns[]` | `BbaCampaignSchema`, `BbaCampaign` | COVERED |
| `nucleus.clientPartners[]` | `BbaClientPartnerSchema`, `BbaClientPartner` | COVERED |
| `nucleus.proposals[]` | `BbaProposalSchema`, `BbaProposal` | COVERED |
| `nucleus.workflows[]` | `BbaWorkflowSchema`, `BbaWorkflow` | COVERED |
| `nucleus.brandAssets[]` | `BbaBrandAssetSchema`, `BbaBrandAsset` | COVERED |
| `nucleus.institutionalChannels[]` | `BbaInstitutionalChannelSchema`, `BbaInstitutionalChannel` | COVERED |
| `nucleus.deliverables[]` | `BbaDeliverableSchema`, `BbaDeliverable` | COVERED |
| `permissionClaims[]` | `src/config/permissions.ts` concepts | DOCUMENTED_ONLY |
| `mockScenarios[]` | L3 recovery scenario coverage | DOCUMENTED_ONLY |

Schema-level validation should extract and validate the `nucleus` object, not the entire fixture wrapper.

## Active Agent Pipeline Alignment

The BBA fixture baseline is a domain/nucleus fixture, while active agent pipeline validation is separate.

| Pipeline Evidence | Source | Alignment |
| --- | --- | --- |
| Mock client brief | `src/types/index.ts` `Brief` | Referenced by local workflow; not embedded as runtime input in BBA-REQ-02. |
| Mock audience profile | `src/types/index.ts` `ICPProfile` and `src/contracts/schemas.ts` output schemas | Candidate for later BBA-REQ-03 or BBA-REQ-04 validation mapping. |
| Mock brand strategy | `src/types/index.ts` `BrandStrategy` | Candidate for later validation mapping. |
| Mock campaign plan | `src/types/index.ts` `CampaignPlan` | Candidate for later validation mapping. |
| Mock creative concepts | `src/types/index.ts` `CreativeConcept` | Candidate for later validation mapping. |
| Agent output contracts | `src/contracts/schemas.ts` `CONTRACT_MAP` | Separate from `BbaNucleusSchema`; not changed in BBA-REQ-02. |

## Fields Not Covered

The BBA fixture baseline does not cover:

- real billing details;
- invoice amounts;
- payment identifiers;
- ad platform IDs;
- CRM IDs;
- real client emails or phone numbers;
- production campaign IDs;
- API credentials or tokens.

## Schema Gaps

| Gap | Impact | Resolution Path |
| --- | --- | --- |
| BBA-domain schemas are separate from active `CONTRACT_MAP`. | Existing agent validation may not validate BBA aggregate fixtures directly. | BBA-REQ-03 should add or use a safe local validation path if approved. |
| Fixture wrapper is broader than `BbaNucleusSchema`. | Direct schema validation must target the `nucleus` sub-object. | BBA-REQ-03 should document the extraction/validation method or blocker. |
| No fixture loader exists. | Fixture is documentation evidence, not runtime evidence. | Keep under `.instructions` until product-source fixture path is explicitly approved. |
| No dedicated BBA schema tests exist. | L3 evidence depends on future validation command/report. | BBA-REQ-03 should validate or document blocker. |

## Validation Command If Known

Current known safe command candidates from BBA-REQ-01:

- `npm run typecheck`
- `npm run test:contracts`
- `npm run test:permissions`
- `npm run test:cost`

No command is currently documented to validate `.instructions/fixtures/bba-agency.mock-data.json` against `BbaNucleusSchema`. BBA-REQ-03 may create a documentation-only validation report or request a separate safe schema validation script, but must not change package files.

## BBA-REQ-03 Validation Plan

1. Confirm fixture exists and JSON syntax passes.
2. Confirm fixture contains only synthetic values.
3. Confirm `nucleus` keys match `BbaNucleusSchema`.
4. Run approved local commands only.
5. Keep conditional agent scripts behind forced mock env.
6. Record blockers for schema validation if no safe command exists.
