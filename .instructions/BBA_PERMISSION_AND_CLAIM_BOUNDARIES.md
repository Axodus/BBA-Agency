# BBA-Agency Permission And Claim Boundaries

Boundary date: 2026-06-06

## Local Mock Users May Do

- Read `.instructions` recovery documents.
- Read synthetic fixture data.
- Review mock campaign, proposal, service, workflow, channel, and deliverable states.
- Simulate approval or rejection state transitions in documentation only.
- Run approved local validation commands in BBA-REQ-03 after preflight.
- Record blockers and validation evidence.

## Local Mock Users May Not Do

- Create real client records.
- Use real emails, phone numbers, billing data, or CRM identifiers.
- Execute production campaigns.
- Call ad platforms.
- Dispatch CRM or external automation.
- Process payments.
- Start production APIs or servers.
- Use secrets, API keys, tokens, or credentials.
- Claim production readiness.
- Claim guaranteed performance, revenue, yield, APY, or risk-free outcomes.

## Read-Only Actions

| Action | Status | Notes |
| --- | --- | --- |
| Inspect `.instructions` | ALLOWED | Documentation governance only. |
| Inspect `src/contracts` and `src/types` | ALLOWED | Read-only schema/contract alignment. |
| Inspect `src/config/permissions.ts` | ALLOWED | Permission boundary review. |
| Inspect fixture JSON | ALLOWED | Synthetic fixture baseline. |

## Simulated Actions

| Action | Status | Boundary |
| --- | --- | --- |
| Campaign planning | SIMULATED | No dispatch or live platform execution. |
| Proposal approval | SIMULATED | Mock approval only; no coordinator/governance approval claim. |
| Deliverable approval | SIMULATED | Candidate/mock status only. |
| Performance snapshot | SIMULATED | Synthetic metrics only; no performance guarantee. |
| Permission denial | SIMULATED | Local evidence only. |
| Invoice placeholder | SIMULATED | No billing, invoice number, amount, payment link, or receivable. |

## Forbidden Actions

| Action | Status | Reason |
| --- | --- | --- |
| Real billing | FORBIDDEN | Payment and invoice flows are not authorized. |
| External automation | FORBIDDEN | No production campaign or CRM dispatch. |
| Client execution | FORBIDDEN | Mock/local sprint only. |
| Payment flow | FORBIDDEN | No payment processing. |
| Production ad execution | FORBIDDEN | `meta-ads-api` and `google-ads-api` are execution tools requiring approval. |
| Secrets usage | FORBIDDEN | Secret-bearing validation is not allowed. |
| Production readiness claims | FORBIDDEN | L3 mock/local evidence is not production evidence. |
| HITL demo auto-approval | FORBIDDEN | Demo fallback behavior is not coordinator, governance, treasury, billing, or publication approval. |
| Memory service mutation | FORBIDDEN BY DEFAULT | Mongo/Chroma-backed memory paths are not required for BBA-REQ-02 and remain conditional for later validation. |

## Claim Boundaries

BBA-Agency documentation and fixtures must not claim:

- guaranteed returns;
- revenue guarantees;
- APY/yield;
- risk-free performance;
- real partnerships;
- real audits;
- legal approval;
- DAO approval;
- treasury compatibility approval;
- production campaign readiness;
- payment readiness.

## BBA-REQ-03 Boundary

BBA-REQ-03 may proceed only as local validation evidence. It must use mock env, avoid tokens, avoid external services, avoid installs, avoid package changes, and avoid dev/MCP/Docker/service commands unless separately approved.
