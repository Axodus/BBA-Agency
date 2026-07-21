# Concept Mapping

| BBA concept | Reference demo behavior |
|---|---|
| Governed Knowledge | A source note and a local policy corpus are loaded from JSON. |
| Mission | A structured Mission is created with an ID, owner, objective, state, and timestamps. |
| Policy Retrieval | Relevant policies are selected with transparent deterministic scoring. |
| AI Workforce | Specialized roles are represented as an execution team with visible progress. |
| Editorial Production | A deterministic reference package is rendered as an Institutional Asset. |
| Specialist Review | Structured findings include severity, code, and explanation. |
| Human Governance | Approval or rejection is mandatory after review. |
| Institutional Asset | The generated article has title, dek, body, disclosure, version, and lifecycle state. |
| Audit Evidence | Every material transition is recorded and exportable as JSON. |

## Deliberate exclusions

- no live LLM call;
- no browser API key;
- no real publication connector;
- no authentication or authorization hierarchy;
- no database;
- no tenant isolation;
- no production-grade agent orchestration;
- no claim of autonomous publishing.

## Reference implementation boundary

The demo proves that BBA documentation concepts can be expressed as executable behavior. It does not prove production readiness, scale, security, connector compatibility, or autonomous operation.
