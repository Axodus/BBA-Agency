# Shared Kernel

The Shared Kernel contains only stable, infrastructure-independent primitives
needed by every future Bounded Context. It does not own Mission, Governance,
Workforce, Asset, Workflow, Connector, persistence, or application policy.

## Public API do módulo

The following barrels are the supported public API. Files not exported by a
barrel are internal implementation details.

| Module | Public exports |
| --- | --- |
| `common` | `AuditMetadata`, `CorrelationId`, `CausationId`, JSON and timestamp utilities |
| `identity` | `Identity`, `IdentityFactory`, `TenantId`, `MissionId`, `AssetId`, `AgentId`, `AssignmentId`, `AuthorityId`, `DecisionId`, `ApprovalId`, `EvidenceId`, `ConnectorId` |
| `tenant` | `TenantContext`, `TenantContextProvider`, `CurrentTenantPort`, tenant boundary rules |
| `time` | `Clock`, `SystemClock`, `FakeClock` |
| `version` | `Version` |
| `lineage` | `LineageReference`, `LineageRelationship` |
| `evidence` | `EvidenceReference` |
| `references` | Tenant-bound Authority, Decision, Approval and Assignment references |
| `errors` | `DomainError`, `ValidationError`, `InvariantViolation`, `TenantViolation` |
| `events` | `DomainEvent` |
| `entity` | `Entity` |
| `aggregate` | `AggregateRoot` |
| `valueobject` | `ValueObject` |

## Dependency direction

Primitives depend only on other shared primitives. No module imports a database,
ORM, HTTP framework, Connector, frontend, Agent runtime, `demo/`, or legacy
`src/`. Domain contexts may consume this API; the Shared Kernel must not import
future contexts.
