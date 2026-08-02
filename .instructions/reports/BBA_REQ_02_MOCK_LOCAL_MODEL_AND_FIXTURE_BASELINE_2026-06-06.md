# BBA-REQ-02 Mock/Local Model And Fixture Baseline Report

Report date: 2026-06-06

## Purpose

Create the BBA-Agency mock/local operating model, fixture baseline, schema/contract alignment, permission/claim boundaries, and validation handoff required before BBA-REQ-03.

## Execution Gate

Required BBA-REQ-01 files were present:

- `.instructions/BBA_L3_RECOVERY_PLAN.md`
- `.instructions/BBA_VALIDATION_BASELINE.md`
- `.instructions/BBA_CURRENT_STATE_AUDIT.md`

Repository state at start:

- Branch: `dev...origin/dev`
- HEAD: `b3d8ad4e0ed4181ee412b48a35eb8df0d93eb5e3`

## Files Inspected

- `.instructions/BBA_L3_RECOVERY_PLAN.md`
- `.instructions/BBA_VALIDATION_BASELINE.md`
- `.instructions/BBA_CURRENT_STATE_AUDIT.md`
- `.instructions/STATUS.md`
- `.instructions/WORKFLOW.md`
- `.instructions/SECURITY.md`
- `.instructions/BUB_AGENTS.md`
- `src/contracts/bba.schemas.ts`
- `src/types/bba.ts`
- `src/config/permissions.ts`

## BUB Agents

BUB agents were used in read-only mode:

- BBA mock domain reviewer;
- BBA fixture schema reviewer;
- BBA permission/claim boundary reviewer.

Their final findings are reconciled into the mock/local model, fixture alignment, permission boundaries, blockers, and BBA-REQ-03 handoff.

## Files Created

- `.instructions/BBA_MOCK_LOCAL_MODEL.md`
- `.instructions/BBA_FIXTURE_BASELINE.md`
- `.instructions/BBA_SCHEMA_CONTRACT_ALIGNMENT.md`
- `.instructions/BBA_PERMISSION_AND_CLAIM_BOUNDARIES.md`
- `.instructions/BBA_REQ_03_VALIDATION_HANDOFF.md`
- `.instructions/fixtures/bba-agency.mock-data.json`
- `.instructions/BLOCKER_REGISTER.md`
- `.instructions/reports/BBA_REQ_02_MOCK_LOCAL_MODEL_AND_FIXTURE_BASELINE_2026-06-06.md`

## Files Updated

- `.instructions/STATUS.md`
- `.instructions/ROADMAP.md`
- `.instructions/TASKS.md`
- `.instructions/WORKFLOW.md`
- `.instructions/SECURITY.md`

## Mock/Local Model Summary

BBA-Agency mock/local evidence now defines synthetic clients, campaigns, service packages, proposals, approval states, invoice placeholders, tasks/orders, performance snapshots, and permission/claim examples. All records are local-only and explicitly forbidden for production use.

## Fixture Summary

Fixture path:

```text
.instructions/fixtures/bba-agency.mock-data.json
```

The fixture includes a documentation-governance wrapper. Its `nucleus` object is aligned to the BBA domain schema shape, while metadata, scenarios, and permission claims are documentation-only evidence for L3 recovery.

Required scenarios covered:

- draft campaign;
- pending approval;
- approved mock campaign;
- rejected mock campaign;
- paused mock campaign;
- mock client with incomplete profile;
- mock package/service option;
- mock permission denied scenario.

## Schema/Contract Alignment Summary

- `src/contracts/bba.schemas.ts` provides the intended BBA aggregate schema surface.
- `src/types/bba.ts` provides matching TypeScript interfaces.
- `src/config/permissions.ts` defines execution-sensitive tool boundaries.
- Active `CONTRACT_MAP` validation remains separate in `src/contracts/schemas.ts`; this is documented as a BBA-REQ-03 blocker/gap.
- Schema-level validation should target the fixture `nucleus` sub-object.
- Active agent pipeline types such as `Brief`, `ICPProfile`, `BrandStrategy`, `CampaignPlan`, and `CreativeConcept` are documented as separate future mapping surfaces.

## Permission And Claim Boundary Summary

Forbidden:

- real client records;
- real billing;
- external automation;
- campaign execution;
- CRM dispatch;
- payment flow;
- production APIs;
- secrets;
- revenue, APY, yield, risk-free, production-readiness, partnership, audit, legal, governance approval, or treasury claims.

## BBA-REQ-03 Handoff

Handoff status: `PROCEED_WITH_WARNINGS`

BBA-REQ-03 may proceed to local validation if it records preflight, validates JSON syntax, uses mock env, avoids tokens and external services, and runs only approved local commands.

Additional warnings:

- Memory-backed agent paths may touch Mongo/Chroma if services are reachable.
- HITL demo auto-approval is not real approval.
- MCP server paths can call Figma/Notion when tokens exist and must remain blocked.

## Validation Results

Validation commands:

```bash
test -s .instructions/BBA_MOCK_LOCAL_MODEL.md
test -s .instructions/BBA_FIXTURE_BASELINE.md
test -s .instructions/BBA_SCHEMA_CONTRACT_ALIGNMENT.md
test -s .instructions/BBA_PERMISSION_AND_CLAIM_BOUNDARIES.md
test -s .instructions/BBA_REQ_03_VALIDATION_HANDOFF.md
test -s .instructions/reports/BBA_REQ_02_MOCK_LOCAL_MODEL_AND_FIXTURE_BASELINE_2026-06-06.md
test -s .instructions/fixtures/bba-agency.mock-data.json || true
python -m json.tool .instructions/fixtures/bba-agency.mock-data.json >/dev/null
rg -n "mock|local|fixture|DISABLED|forbidden|BBA-REQ-03|PROCEED" .instructions
git diff --check -- .instructions
git status --short --branch
```

Result:

- Required files: PASS
- Fixture JSON syntax: PASS
- Documentation grep checks: PASS
- `git diff --check -- .instructions`: PASS

Final git status is recorded in the command output for this request.

## Boundaries Preserved

- Production automation: DISABLED
- Real billing: DISABLED
- Client execution: DISABLED
- External service calls: DISABLED
- Payment flows: DISABLED
- Secrets usage: DISABLED
- Package changes: DISABLED
- Dependency installs: DISABLED
- Production readiness claims: DISABLED

## Final Status

`BBA-REQ-02: COMPLETE`

BBA-Agency remains L2 moving toward L3 evidence. BBA-REQ-02 creates the mock/local model and fixture baseline, but does not execute validation and does not claim L3 achieved.

## Next

`BBA-REQ-03 — Local Validation Evidence & L3 Recovery Report`
