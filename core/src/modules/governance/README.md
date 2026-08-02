# Human Governance module

This bounded context represents institutional human authority, delegation,
decisions, approvals and accountability. It does not implement authentication,
technical authorization, RBAC, IAM or digital identity.

`Decision` references a `MissionId` from the Shared Kernel but never imports or
loads the Mission module. `Authority` exclusively owns its Assignment entities.
Cross-context execution is exposed through `GovernanceAuthorizationPort` and
coordinated by the Application layer.

Suspension is a time-bounded protective condition. It is not an institutional
lifecycle state. A finalized Decision is immutable, including its outcome,
Approval, Evidence, Lineage and all references.

The public module API is defined by `domain/index.ts`, `application/index.ts`,
`ports/index.ts` and `infrastructure/index.ts`. The in-memory adapters are
reference implementations for contract tests, not production persistence.
