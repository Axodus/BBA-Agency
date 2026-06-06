# BBA-Agency Validation Baseline

Baseline date: 2026-06-06

## Current Validation Status

Current validation status: `BLOCKED`

BBA-REQ-01 documents the validation baseline only. It does not execute tests, builds, dev servers, memory services, campaigns, MCP servers, installs, package updates, external APIs, or production automation.

## Command Classification

| Command | Status | Reason | BBA-REQ-03 Use |
| --- | --- | --- | --- |
| `npm run typecheck` | KNOWN_SAFE | Runs `tsc --noEmit`; local static TypeScript validation with no expected external service. | Preferred first validation command if dependencies are already available. |
| `npm run build` | UNKNOWN | Runs `tsc` and may emit `dist`; generated artifact policy is not defined. | Do not run until output handling is documented. |
| `npm run test:contracts` | KNOWN_SAFE | Contract rejection probe is local and does not require production services. | Candidate early BBA-REQ-03 command. |
| `npm run test:permissions` | KNOWN_SAFE | Permission denial probe is local and forces mock behavior. | Candidate early BBA-REQ-03 command. |
| `npm run test:cost` | KNOWN_SAFE | Cost overflow probe is local validation evidence. | Candidate early BBA-REQ-03 command. |
| `npm run test:planner` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:design` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:motion` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:ux` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:ads` | UNKNOWN | Ads-related permission surfaces exist; mock env must be forced and execution claims blocked. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:growth` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:ideation` | UNKNOWN | Can be safe with forced mock env, but should be run only after BBA-REQ-03 preflight. | Conditional candidate with `USE_MOCK_LLM=true` and no tokens. |
| `npm run test:agent` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run test:brief` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run test:audience` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run test:trend` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run test:brand` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run test:creative` | UNKNOWN | Does not consistently force mock env in the discovered command surface. | Candidate only after source review and forced mock environment. |
| `npm run tests` | BLOCKED | Long chain includes memory/HITL/cost paths and has not been classified command by command. | Do not run as a default L3 gate. |
| `npm run test:memory` | BLOCKED | May require local memory services and configured persistence. | Requires explicit local service scope. |
| `npm run memory:health` | BLOCKED | May require memory services. | Requires explicit local service scope. |
| `npm run memory:init` | BLOCKED | Mutates local memory state. | Not part of baseline validation. |
| `npm run memory:up` | KNOWN_UNSAFE | Starts Docker services. | Forbidden in BBA-REQ-01 and not default L3 evidence. |
| `npm run memory:down` | KNOWN_UNSAFE | Stops Docker services. | Forbidden unless a separate service-management request authorizes it. |
| `npm run dev` | BLOCKED | Runs campaign flow entrypoint; runtime behavior is not approved for this sprint. | Not part of L3 validation baseline. |
| `npm run dev:axodus` | BLOCKED | Runs campaign flow entrypoint; runtime behavior is not approved for this sprint. | Not part of L3 validation baseline. |
| `npm run mcp` | BLOCKED | Starts MCP server. | Not part of BBA-REQ-01 or default L3 validation. |
| `npm install`, `pnpm install`, `yarn install` | KNOWN_UNSAFE | Package/dependency changes are forbidden unless separately approved. | Do not run. |

## Commands Considered Safe

The current `KNOWN_SAFE` candidates for a future BBA-REQ-03 validation attempt are:

- `npm run typecheck`
- `npm run test:contracts`
- `npm run test:permissions`
- `npm run test:cost`

These remain candidates, not executed evidence, until BBA-REQ-03 runs them under a clean preflight.

## Commands Not Safe Or Not Confirmed

- Memory service commands are blocked until a local-only memory service request explicitly authorizes them.
- Dev and MCP commands are blocked because they may start runtime/server flows.
- The aggregate `npm run tests` command is blocked until every child command is classified.
- Individual agent validation scripts remain `UNKNOWN` or conditional until their source is reviewed against the no-secrets/no-external-services boundary and mock env is forced.
- `npm run build` remains `UNKNOWN` because artifact output handling is not documented.

## External Service And Secret Boundary

No BBA-REQ-01 validation command may require:

- production client systems;
- real billing;
- payment flows;
- external automation;
- production campaign dispatch;
- real CRM dispatch;
- secrets or credentials;
- production API integrations.

## Expected Validation Sequence For BBA-REQ-03

1. Record `pwd`, `git status --short --branch`, and `git rev-parse HEAD`.
2. Confirm fixture baseline from BBA-REQ-02 exists.
3. Confirm no secrets are required and no production integrations are enabled.
4. Confirm package manager policy without changing package files.
5. Force mock/local environment for validation: `USE_MOCK_LLM=true` and `AXODUS_MOCK_LLM=true`.
6. Run `npm run typecheck` if dependencies are already available.
7. Run `npm run test:contracts`, `npm run test:permissions`, and `npm run test:cost` if preflight confirms no external services or secrets.
8. Review conditional script-style validation commands for mock/no-service behavior.
9. Run only approved local mock validation scripts.
10. Record command output summaries and blockers.
11. Keep production/external execution disabled.

## Validation Evidence Status

| Evidence | Status | Notes |
| --- | --- | --- |
| Current audit | COMPLETE | Created in BBA-REQ-01. |
| Validation baseline | COMPLETE | Created in BBA-REQ-01. |
| Current command execution | NOT_PRESENT | No tests/builds were run in BBA-REQ-01. |
| Fixture baseline | PRESENT | Created in BBA-REQ-02 at `.instructions/fixtures/bba-agency.mock-data.json`. |
| L3 validation run | BLOCKED | Deferred to BBA-REQ-03. |
