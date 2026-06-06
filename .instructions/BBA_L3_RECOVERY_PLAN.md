# BBA-Agency L3 Recovery Plan

Plan date: 2026-06-06

## Target L3 Definition

BBA-Agency reaches `L3 - Mock/Local` candidate when it has reproducible mock/local evidence without production execution. L3 requires local fixtures or a clear fixture map, documented mock behavior, safe validation commands, current validation evidence or explicit blockers, and a report that preserves all production-disabled boundaries.

## Required Mock/Local Evidence

| Evidence | Requirement | Current Status | Owner Request |
| --- | --- | --- | --- |
| Mock/local operating model | Define what runs locally, what remains mocked, and what is forbidden. | PARTIAL | BBA-REQ-02 |
| Fixture baseline | Create or map mock briefs, audiences, campaign inputs, brand inputs, and expected non-production outputs. | MISSING | BBA-REQ-02 |
| Schema/contract map | Link fixtures to `src/contracts` and `src/types`. | PARTIAL | BBA-REQ-02 |
| Active schema coverage | Clarify the boundary between BBA-domain schemas and active agent `CONTRACT_MAP` validation. | PARTIAL | BBA-REQ-02/BBA-REQ-03 |
| Safe validation command set | Classify and approve local commands. | PARTIAL | BBA-REQ-01/BBA-REQ-03 |
| Local validation evidence | Execute approved safe commands and record results. | MISSING | BBA-REQ-03 |
| Production boundary evidence | Confirm production execution remains disabled. | PRESENT | Maintain in every request |

## Fixture Requirements

Fixtures must be:

- synthetic;
- clearly marked mock/local;
- free of real client data;
- free of credentials, API keys, tokens, wallet data, billing data, and payment details;
- small enough for review;
- mapped to schema/contract expectations where possible;
- safe to use without network calls, external services, or production automation.

Minimum fixture model for BBA-REQ-02:

- mock client brief;
- mock audience profile;
- mock brand strategy input;
- mock campaign planning input;
- mock creative direction input;
- expected local-only validation notes.

## Local Validation Requirements

L3 validation should prefer:

- `npm run typecheck` if dependencies are available;
- approved mock agent/script validations after source review;
- schema/contract validation paths;
- `npm run test:contracts`, `npm run test:permissions`, and `npm run test:cost` after clean preflight;
- permission denial validation;
- forced mock env for agent-style validations;
- no install;
- no dev server;
- no MCP server;
- no Docker service startup;
- no memory service mutation unless separately approved.

## Production-Disabled Boundaries

The following remain disabled:

- runtime production execution;
- real billing;
- payment flows;
- external automation execution;
- production campaign dispatch;
- real CRM dispatch;
- secrets or credentials;
- production API integrations;
- treasury movement;
- wallet signing;
- on-chain writes;
- production readiness claims.

## Request Sequence

| Request | Purpose | Status |
| --- | --- | --- |
| BBA-REQ-01 - Recovery Audit & Validation Baseline | Document current state, validation baseline, and L3 recovery plan. | COMPLETE |
| BBA-REQ-02 - Mock/Local Model & Fixture Baseline | Create or map the mock/local operating model and fixtures. | NEXT |
| BBA-REQ-03 - Safe Local Validation Execution | Run approved local validation and record evidence. | PENDING |
| BBA-REQ-04 - L3 Evidence Review & Closeout | Decide whether BBA-Agency can be marked L3 candidate. | PENDING |

## Acceptance Criteria For L3 Candidate

BBA-Agency may be considered L3 candidate when:

- mock/local operating model is documented;
- fixture baseline exists or is clearly mapped;
- schema/contract and permission boundaries are mapped to fixtures;
- validation commands are documented and classified;
- safe local validation evidence exists or blockers are explicitly documented;
- production/external execution remains disabled;
- final L3 recovery report exists;
- no production readiness is claimed.

Next request: `BBA-REQ-02 - Mock/Local Model & Fixture Baseline`
