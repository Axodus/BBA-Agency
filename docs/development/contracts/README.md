# Aggregate Contracts

Every Core Aggregate must have one local implementation contract in this
directory. Contracts summarize certified Domain meaning for code review; they
do not replace the normative Documentation corpus.

Each contract records responsibilities, invariants, accepted commands, emitted
events, canonical states, permitted transitions, public API, dependencies,
serialization, persistence port, validation, and deferred concerns.

Current contracts:

- [MissionAggregate](MissionAggregate.md)
- [GovernanceAggregate](GovernanceAggregate.md)
- [AuthorityAggregate](AuthorityAggregate.md)
- [DecisionAggregate](DecisionAggregate.md)
- [AgentAggregate](AgentAggregate.md)
- [ExecutionAggregate](ExecutionAggregate.md)
- [WorkAssignment](WorkAssignment.md)
- [AIWorkforceContext](AIWorkforceContext.md)
