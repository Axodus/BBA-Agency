# BBA-REQ-01 Recovery Audit And Validation Baseline Report

Report date: 2026-06-06

## Purpose

Establish a recovery baseline for moving BBA-Agency from `L2 - Validado` toward `L3 - Mock/Local` without production execution.

## Baseline

| Field | Result |
| --- | --- |
| Requested workspace | `/opt/Axodus/BBA-Agency` |
| Resolved repository | `/mnt/d/Rede/Github/Axodus/BBA-Agency` |
| Branch | `dev...origin/dev` |
| HEAD | `aa54dbfc1fa5ff993cd07d33b9eac76773b8a95a` |
| Current maturity | `L2 - Validado` |
| Target maturity | `L3 - Mock/Local` |
| Production execution | DISABLED |

## Files Inspected

- `.instructions/ARCHITECTURE.md`
- `.instructions/BUB_AGENTS.md`
- `.instructions/README.md`
- `.instructions/ROADMAP.md`
- `.instructions/SECURITY.md`
- `.instructions/STATUS.md`
- `.instructions/TASKS.md`
- `.instructions/WORKFLOW.md`
- `README.md`
- `package.json`
- `tsconfig.json`
- `src/contracts/bba.schemas.ts`
- `src/contracts/schemas.ts`
- `src/types/*`
- `src/config/permissions.ts`
- `src/utils/test-*.ts`
- `src/utils/mock-agent.ts`

## Files Created

- `.instructions/BBA_CURRENT_STATE_AUDIT.md`
- `.instructions/BBA_VALIDATION_BASELINE.md`
- `.instructions/BBA_L3_RECOVERY_PLAN.md`
- `.instructions/reports/BBA_REQ_01_RECOVERY_AUDIT_AND_VALIDATION_BASELINE_2026-06-06.md`

## Files Updated

- `.instructions/STATUS.md`
- `.instructions/ROADMAP.md`
- `.instructions/TASKS.md`
- `.instructions/WORKFLOW.md`

## BUB Agents

BUB agents were used in read-only mode.

| Agent Slice | Result |
| --- | --- |
| BBA instructions auditor | Confirmed local instruction set exists and remains L2; identified request-name mismatch with root portfolio queue. |
| BBA schema/contract/mock evidence auditor | Confirmed BBA schemas, TypeScript contracts, mock-agent evidence, mock env default, and script probes; flagged missing fixtures and inactive BBA-domain schema wiring. |
| BBA validation command auditor | Classified `typecheck`, `test:contracts`, `test:permissions`, and `test:cost` as local candidates; blocked dev, MCP, Docker, aggregate tests, and build. |

## Current State Findings

- `.instructions` are normalized and include BUB guidance.
- `.instructions/BUB_AGENTS.md` exists and is not currently ignored by Git.
- Zod schema and TypeScript contract surfaces exist under `src/contracts` and `src/types`.
- Script-style validation utilities exist under `src/utils`.
- `src/utils/mock-agent.ts` provides mock/local evidence.
- `src/config/env.ts` defaults `USE_MOCK_LLM` to mock mode unless explicitly disabled.
- `src/contracts/bba.schemas.ts` is BBA-domain schema evidence, but active agent contract validation is currently centered on `src/contracts/schemas.ts` and `CONTRACT_MAP`.
- No dedicated fixture directory or fixture manifest was detected.
- No current validation command was executed in BBA-REQ-01.

## Validation Baseline Summary

`npm run typecheck`, `npm run test:contracts`, `npm run test:permissions`, and `npm run test:cost` are classified as current local candidates for a future BBA-REQ-03 validation request, assuming dependencies are already available and a clean mock/local preflight is recorded. Aggregate tests, memory commands, dev commands, MCP server startup, Docker service commands, installs, package updates, and build output remain blocked or unconfirmed.

## Blockers

| Blocker | Status | Resolution |
| --- | --- | --- |
| Validation gate undefined/unexecuted | OPEN | Define and run safe local validation in BBA-REQ-03. |
| Fixture baseline missing | OPEN | Execute BBA-REQ-02. |
| BBA-domain schemas not wired into active validation map | OPEN | Map schema coverage and fixture validation in BBA-REQ-02/BBA-REQ-03. |
| Package manager ambiguity | OPEN | Select validation runner without package changes. |
| Production-facing claim review incomplete | OPEN | Add claim-risk review before public content/campaign work. |
| Runtime/service commands unsafe by default | OPEN | Keep memory/dev/MCP/Docker commands blocked unless separately approved. |
| External token paths exist | OPEN | Force mock env and no-token preflight before validation execution. |
| Root portfolio request naming mismatch | OPEN | Preserve BBA-REQ-01 locally and document coordination mismatch. |

## Validation Commands And Results

Commands run for BBA-REQ-01:

```bash
pwd
git status --short --branch
git branch -vv || true
git rev-parse HEAD || true
find .instructions -maxdepth 3 -type f | sort || true
test -f .instructions/BUB_AGENTS.md && echo "BUB_AGENTS exists" || echo "BUB_AGENTS missing"
git check-ignore -v .instructions/BUB_AGENTS.md || true
find . -maxdepth 3 -type f | sort | sed -n '1,220p'
find . -maxdepth 4 -type f \( -iname "package.json" -o -iname "tsconfig.json" -o -iname "*.schema.*" -o -iname "*.contract.*" -o -iname "*.test.*" -o -iname "*.spec.*" \) | sort
rg -n "npm run|pnpm|yarn|test|lint|typecheck|build|vitest|jest|zod|schema|contract|mock|fixture|validation" .instructions README* package.json tsconfig.json 2>/dev/null || true
```

Tests/builds executed: `NO`

Reason: BBA-REQ-01 is a recovery audit and validation baseline request. Safe execution is deferred until BBA-REQ-03.

## Boundaries Preserved

- Runtime production execution: DISABLED
- Real billing: DISABLED
- Payment flows: DISABLED
- External automation execution: DISABLED
- Production campaigns: DISABLED
- Real CRM dispatch: DISABLED
- Secrets usage: DISABLED
- Package changes: DISABLED
- Dependency installs: DISABLED
- Treasury movement: DISABLED
- Wallet signing: DISABLED
- On-chain writes: DISABLED

## Final Status

`BBA-REQ-01: COMPLETE`

BBA-Agency remains `L2 - Validado`. L3 is not claimed. Current work creates the audit, validation baseline, and recovery plan needed for the next mock/local fixture request.

## Next

`BBA-REQ-02 - Mock/Local Model & Fixture Baseline`
