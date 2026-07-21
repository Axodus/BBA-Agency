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
| Distribution Channels | A local catalog exposes selectable Channel Profiles with illustrative constraints and editorial guidance. |
| Channel Adaptation | Deterministic templates derive distinct variants from the approved core asset. |
| Variant Governance | Each variant receives independent deterministic findings and a human decision. |
| Distribution Package | Approved, rejected, and pending variants remain grouped under one Mission and parent asset. |
| Audit Evidence | Every material transition is recorded and exportable as JSON. |

## Multichannel reference flow

```text
One governed source
→ one approved Institutional Asset
→ multiple channel-specific variants
→ independent human decisions
→ one auditable Distribution Package
```

Every variant carries `missionId` and `parentAssetId`. The package can reach `approved_for_distribution` or `partially_approved`; it never claims that a platform received or published the content. Channel constraints are local illustrative configuration and are not permanent platform guarantees.

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
