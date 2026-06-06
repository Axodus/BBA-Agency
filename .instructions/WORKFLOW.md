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

## Mock/Local Fixture Workflow

1. Keep fixtures under `.instructions/fixtures` unless a product-source fixture path is explicitly approved.
2. Use synthetic identifiers, `.invalid` domains, and mock-only labels.
3. Map fixture records to BBA schemas and TypeScript contracts.
4. Record permission and claim boundaries before validation.
5. Hand off only approved local validation commands to BBA-REQ-03.

Rules:
- Fixtures are not production data.
- Mock approval is not coordinator, governance, treasury, or publication approval.
- Mock metrics are not performance claims.
- Billing placeholders must not include prices, invoice numbers, payment links, or receivables.

## Local Validation Evidence Workflow

1. Confirm BBA-REQ-03 handoff is `PROCEED` or `PROCEED_WITH_WARNINGS`.
2. Record git status and current commit.
3. Validate required documentation files.
4. Validate fixture JSON syntax.
5. Run only approved local validation commands with mock env and token variables removed.
6. Record skipped commands and reasons.
7. Assess L3 candidate evidence.
8. Return to portfolio balancing.

Rules:
- Passing local validation does not authorize production.
- L3 candidate does not authorize campaigns, billing, external automation, payments, or client execution.
- Any stronger maturity claim requires a separate approved request.
