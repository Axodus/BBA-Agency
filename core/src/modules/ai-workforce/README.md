# AI Workforce Context

AI Workforce represents bounded operational capacity. `Agent` identifies a
functional capability and executes only work assigned within a Mission.

`WorkAssignment` is intentionally different from
`governance.Assignment`: the former assigns operational work to an Agent; the
latter delegates institutional authority to a human. Their IDs, entities,
rules and lifecycles are not shared.

`Capability` is a Value Object and `CapabilitySet` is immutable. Agents do not
contain Authority, provider, model, prompt, MCP, endpoint, credential or
runtime data. `Execution` stores only neutral references, including a
`MissionReference`; it never imports or commands the Mission Aggregate.

Cross-context coordination occurs through Application ports. This Epic uses
in-memory repositories and deterministic tests only; no live Agent runtime or
LLM provider is configured.
