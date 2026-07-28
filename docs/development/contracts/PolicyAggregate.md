# Policy Aggregate Contract

## Responsibility

Policy describes institutional rules. It does not execute rules, approve
actions, publish content or orchestrate workflows.

## Invariants

- Tenant-bound.
- Starts in `PROPOSED`.
- `CreatePolicy` creates the first immutable `PolicyVersion`.
- Exactly one `currentVersionId` exists.
- Prior `PolicyVersion` records are immutable.
- `PolicyRule` and `PolicyRuleSet` are institutional descriptions only.
- `PolicyRuleSet` belongs exclusively to one `PolicyVersion`.

## Public API

Public exports are defined in `core/src/modules/knowledge-policy/domain` and
the module root namespace `KnowledgePolicy`.

## Forbidden dependencies

Policy must not import Workflow, Review, Publication, Connector, AI runtime,
Mission, Governance, Institutional Assets, infrastructure or frontend.
