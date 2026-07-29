# Error and Validation Taxonomy

REQ: `REQ-IMP-000-012`

## Validation statuses

| Status | Meaning |
| --- | --- |
| `PASS` | Command or acceptance criterion executed and passed. |
| `FAIL` | Executed and did not satisfy the criterion. |
| `NOT_RUN` | Not executed; never evidence of success. |
| `NOT_APPLICABLE` | Explicitly outside the REQ with justification. |
| `BLOCKED` | Could not execute because a declared prerequisite or boundary prevented it. |

## Error categories

| Category | Meaning |
| --- | --- |
| `configuration_invalid` | Declared configuration cannot be parsed or satisfies its contract. |
| `boundary_violation` | Code or execution crosses a prohibited repository or context boundary. |
| `validation_error` | Input is structurally or semantically invalid. |
| `invariant_violation` | A certified domain or safety invariant would be broken. |
| `concurrency_conflict` | Optimistic version or concurrent update check fails. |
| `technical_permission_denied` | The authenticated technical principal lacks permission. |
| `institutional_authority_insufficient` | Technical access does not establish Human Governance authority. |
| `tenant_isolation_violation` | A Tenant boundary or ownership scope is crossed. |
| `connector_failure` | An external Connector fails or refuses an operation. |
| `agent_execution_failure` | A bounded Agent execution fails or returns invalid output. |
| `persistence_failure` | Storage cannot safely persist or reconstruct evidence. |
| `unsupported_operation` | The requested operation is outside the current contract. |

Errors must preserve cause, affected scope, owner, recovery condition, and
escalation meaning where those fields apply. M0 implements only bootstrap and
boundary failure paths; later domain REQs will add typed domain errors.
