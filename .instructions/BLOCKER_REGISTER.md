# BBA-Agency Blocker Register

Updated: 2026-06-06

## BBA-BLOCKER-001 — Current validation gate executed with warnings

ID: `BBA-BLOCKER-001`
Severity: High
Status: RESOLVED_WITH_WARNINGS

Description:
BBA-REQ-03 executed the approved local validation command set and recorded L3 candidate evidence.

Impact:
BBA-Agency can be treated as L3 candidate, but not production-ready.

Resolution path:
Keep schema-level warnings open and return to portfolio balancing.

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

## BBA-BLOCKER-006 — BBA paused after L3 candidate

ID: `BBA-BLOCKER-006`
Severity: Medium
Status: CONTROLLED

Description:
BBA-Agency should pause after L3 candidate evidence until portfolio review approves more BBA work.

Impact:
Prevents scope creep from mock/local validation into production-like campaign, billing, or client execution work.

Resolution path:
Return to portfolio balancing. Recommended next focus: Lottery Recovery — L2 to L3.
