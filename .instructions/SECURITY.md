# BBA-Agency Security

Security posture: conservative communications only.

## Forbidden Claims

- guaranteed returns;
- unrealistic APY/yield;
- risk-free statements;
- fake partnerships;
- fake audits;
- fake legal approvals;
- fake production readiness;
- fake token or treasury claims.

## Sensitive Areas

BBA-Agency must not handle:

- secrets;
- private keys;
- wallets;
- treasury actions;
- trading credentials;
- production configs;
- production deployment keys.

If campaign material references another Axodus nucleus, verify the current status in global and nucleus `.instructions`.

## Mock/Local Fixture Safety

Fixtures must use synthetic values only.

Forbidden in fixtures:

- real client names;
- real emails;
- real phone numbers;
- real billing data;
- invoice numbers;
- payment links;
- ad platform IDs;
- CRM IDs;
- API keys;
- tokens;
- private identifiers;
- production campaign IDs.

BBA-REQ-02 fixture evidence is documentation-governance evidence only. It must not be used to execute campaigns, bill clients, dispatch CRM messages, call production APIs, or claim production readiness.

## BBA-REQ-03 Validation Security Boundary

BBA-REQ-03 validation used mock environment variables and removed known token variables from validation command environments.

Still forbidden:

- production automations;
- campaign execution;
- real client systems;
- billing;
- payment flows;
- external APIs;
- secrets;
- dependency installs;
- package changes;
- production readiness claims.
