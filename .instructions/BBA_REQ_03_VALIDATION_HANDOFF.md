# BBA-REQ-03 Validation Handoff

Handoff date: 2026-06-06

## Handoff Status

`PROCEED_WITH_WARNINGS`

## Whether BBA-REQ-03 May Proceed

BBA-REQ-03 may proceed to local validation planning and execution if it preserves all no-production boundaries and records a clean preflight.

Warnings:

- No dedicated runtime fixture loader exists.
- BBA-domain schemas are not wired into active `CONTRACT_MAP`.
- The fixture file has a governance wrapper; schema-level validation should target the `nucleus` sub-object.
- Some validation scripts require forced mock env before they can be considered safe.
- Memory, dev, MCP, Docker, build, aggregate tests, installs, and package updates remain blocked.

## Validation Commands To Run

Recommended initial sequence:

```bash
cd /opt/Axodus/BBA-Agency
pwd
git status --short --branch
git rev-parse HEAD
python -m json.tool .instructions/fixtures/bba-agency.mock-data.json >/dev/null
npm run typecheck
npm run test:contracts
npm run test:permissions
npm run test:cost
```

Conditional commands may be considered only after mock/no-token preflight:

```bash
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:planner
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:design
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:motion
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:ux
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:ads
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:growth
USE_MOCK_LLM=true AXODUS_MOCK_LLM=true npm run test:ideation
```

## Fixture Files To Validate

- `.instructions/fixtures/bba-agency.mock-data.json`

## Schemas And Contracts To Validate

- `src/contracts/bba.schemas.ts`
- `src/contracts/schemas.ts`
- `src/types/bba.ts`
- `src/config/permissions.ts`

## Blockers

| Blocker | Severity | Status | Resolution |
| --- | --- | --- | --- |
| BBA-domain fixture schema validation command not yet available | Medium | OPEN | BBA-REQ-03 should validate JSON syntax and document whether schema-level validation is possible without code/package changes. |
| Active `CONTRACT_MAP` does not directly validate BBA aggregate fixture | Medium | OPEN | Document as validation gap unless a safe local validation path exists. |
| Fixture wrapper requires sub-object validation | Medium | OPEN | Validate `nucleus` against `BbaNucleusSchema`; keep metadata/scenarios/permission claims as governance evidence. |
| External token paths exist | High | OPEN | Force mock env and avoid secret-bearing commands. |
| Memory initialization can occur in agent paths | Medium | OPEN | Keep agent scripts conditional unless reviewed as no-service/local-only. |
| HITL demo approval is not governance approval | High | OPEN | Treat Slack/webhook and auto-demo behavior as blocked for L3 validation unless separately scoped. |
| Production execution remains disabled | High | CONTROLLED | Keep all production/external commands blocked. |

## No-Production Boundary

BBA-REQ-03 must not:

- run production automations;
- execute campaigns;
- access production APIs;
- process billing;
- create payment flows;
- touch secrets;
- install dependencies;
- change package files;
- start dev/MCP servers;
- start Docker services;
- claim production readiness.
