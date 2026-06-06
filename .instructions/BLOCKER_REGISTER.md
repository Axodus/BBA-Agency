# BBA-Agency Blocker Register

Updated: 2026-06-06

## BBA-BLOCKER-001 — Current validation gate not executed

ID: `BBA-BLOCKER-001`
Severity: High
Status: OPEN

Description:
Current L3 validation evidence has not been executed. BBA-REQ-02 creates mock/local fixtures and handoff only.

Impact:
BBA-Agency cannot be marked L3 candidate until BBA-REQ-03 executes or blocks safe local validation.

Resolution path:
Execute `BBA-REQ-03 — Local Validation Evidence & L3 Recovery Report`.

## BBA-BLOCKER-002 — BBA-domain schemas not wired into active validation map

ID: `BBA-BLOCKER-002`
Severity: Medium
Status: OPEN

Description:
`src/contracts/bba.schemas.ts` provides the BBA-domain aggregate, but active agent validation uses `src/contracts/schemas.ts` and `CONTRACT_MAP`.

Impact:
Fixture shape can be documented, but schema-level validation may require a safe validation command or separate implementation request.

Resolution path:
BBA-REQ-03 should validate what is possible without package/runtime changes and document remaining gaps.

## BBA-BLOCKER-003 — Production/external execution remains disabled

ID: `BBA-BLOCKER-003`
Severity: High
Status: CONTROLLED

Description:
Production automations, real billing, campaign execution, CRM dispatch, external APIs, secrets, payment flows, and production claims are not authorized.

Impact:
All BBA evidence remains mock/local only.

Resolution path:
Maintain boundary. Any production move requires a separate approved request.

## BBA-BLOCKER-004 — Package manager ambiguity

ID: `BBA-BLOCKER-004`
Severity: Medium
Status: OPEN

Description:
Both `package-lock.json` and `pnpm-lock.yaml` exist.

Impact:
BBA-REQ-03 must choose a validation runner without changing package or lock files.

Resolution path:
Use the already documented command baseline and avoid installs or lockfile changes.

## BBA-BLOCKER-005 — Claim-risk review pending

ID: `BBA-BLOCKER-005`
Severity: High
Status: OPEN

Description:
Public-facing claims about partnerships, audits, performance, revenue, production readiness, governance approval, treasury compatibility, or external execution are not approved.

Impact:
BBA content and fixtures cannot be used for public/prod communication.

Resolution path:
Create a claim review and evidence registry before public-facing content work.
