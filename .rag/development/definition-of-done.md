# Definition of Done

REQ: `REQ-IMP-000-010`

A REQ is `DONE` only when applicable items below have evidence:

- [ ] implementation is complete and scoped;
- [ ] unit, architecture, contract, or integration tests pass as applicable;
- [ ] typecheck, lint, and format check pass;
- [ ] documentation and source traceability are updated;
- [ ] ADR or Change Control exists for durable decisions;
- [ ] boundary and Tenant checks pass;
- [ ] demo regression is run when the REQ can affect it, or marked
      `NOT_APPLICABLE` with justification;
- [ ] limitations, skipped commands, and residual risks are recorded;
- [ ] changed and preserved files are listed;
- [ ] a focused local commit exists;
- [ ] no automatic push, merge, release, or remote mutation occurred.

Validation results use only `PASS`, `FAIL`, `NOT_RUN`, `NOT_APPLICABLE`, or
`BLOCKED`. `NOT_RUN` cannot be converted to `PASS` by wording.
