# Decision Aggregate Contract

`Decision` is the auditable institutional decision Aggregate. It stores a
Tenant-bound `MissionId`, Authority/Assignment references, Evidence, Lineage,
Version and one Approval outcome.

Accepted commands are `CreateDecision`, `ApproveDecision`, `RejectDecision` and
`FinalizeDecision`. A Decision starts `PROPOSED`, receives an approving or
rejecting Approval, and then becomes `FINALIZED`.

After `FINALIZED`, outcome, Approval, Evidence, Lineage, Authority, Assignment
and Mission references cannot be changed. Publication, Workflow and Mission
coordination consume public references and ports only; they do not access this
Aggregate's internals.

Events include `DecisionCreated`, `DecisionApproved`, `DecisionRejected`,
`ApprovalRecorded` and `DecisionFinalized`. Each preserves Tenant, Version,
Evidence context, Correlation and Causation through the event payload and
Aggregate audit state.

Public exports are defined in `core/src/modules/governance/domain/index.ts`.
Persistence is exposed through `DecisionRepository`; the current adapter is
in-memory and not production persistence.
