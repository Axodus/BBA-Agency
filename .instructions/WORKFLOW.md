# BBA-Agency Workflow

## Request Workflow

1. Inspect global `.instructions`.
2. Inspect BBA-Agency `.instructions`.
3. Confirm whether the work is planning, prototype, or production-facing.
4. Preserve conservative status language.
5. Avoid claims that require external evidence.
6. Create or update a report for material changes.

## Review Rules

- Public-facing copy requires claim review.
- Financial language requires Governance/risk review.
- Partnership/audit/status claims require evidence.
- Product status must match `.instructions/ECOSYSTEM_STATUS.md` and the relevant nucleus docs.

No production execution is authorized here.

## L3 Mock/Local Recovery Workflow

1. Audit current repository and instruction state.
2. Document validation command baseline.
3. Define mock/local operating model.
4. Create or map fixture baseline.
5. Classify validation commands as safe, unsafe, blocked, or unknown.
6. Execute only approved local validation commands.
7. Record validation evidence and blockers.
8. Decide whether L3 candidate evidence is complete.

Rules:
- Mock/local validation does not authorize production execution.
- Historical validation claims do not replace current evidence.
- Dev, MCP, memory-service, Docker, install, package update, campaign, billing, payment, CRM, external automation, or production API commands require separate approval.
- Production-facing claims require evidence and review before public use.
