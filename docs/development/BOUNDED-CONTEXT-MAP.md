# Bounded Context Map

Status: ACCEPTED for EPIC-IMP-008 implementation.

This local map records implementation boundaries for the Core. It does not
replace the certified BBA Platform Architecture or Domain documentation.

```text
                         Shared Kernel
                              │
          ┌───────────────────┼───────────────────────┬────────────────────┐
          ▼                   ▼                       ▼                    ▼
       Mission          Human Governance        AI Workforce    Institutional Assets
          ▲                   ▲                       ▲                    ▲
          │                   │                       │                    │
          └───────────────────┴── Application Coordinators/Ports ─────────┘
                                      │
                                      ▼
                              Knowledge & Policy
                                      ▲
                                      │
                  Application Coordinators/Ports
                                      │
                                      ▼
                    Workflow & Mission Orchestration
                                      │
                                      ▼
                       Review implementation module
                                      │
                                      ▼
                       future Publication, Connector
```

Rules:

- Bounded Contexts may depend on neutral Shared Kernel contracts only.
- Bounded Contexts must not import another Bounded Context laterally.
- Mission and Governance coordinate through public Application ports.
- `Decision` references `MissionId`; it never owns or loads a Mission.
- Mission stores only neutral Authority, Decision and Approval references.
- AI Workforce stores only neutral Mission, Governance and Tenant references;
  it never imports a Mission or Governance Aggregate.
- Institutional Assets stores only neutral Mission and human authority
  references; it never imports Mission, Governance or AI Workforce Aggregates.
- Knowledge & Policy stores only neutral Asset, AssetVersion, Policy and human
  authority references; it never imports Mission, Governance, AI Workforce or
  Institutional Assets.
- Knowledge organizes references; it never stores canonical Asset payload.
- Policy describes institutional rules; it never executes them or encodes
  Workflow, Review, Publication, Connector or AI runtime behavior.
- Workflow stores definitions and executions separately. `Workflow` owns
  `StageDefinition` and `TaskDefinition`; `WorkflowExecution` owns
  `StageExecution` and `TaskExecution`.
- Workflow coordinates only by Shared References and ports. It never mutates
  Mission, Governance, AI Workforce, Institutional Assets or Knowledge &
  Policy Aggregates.
- `TaskDefinition` never references `WorkAssignment`; `TaskExecution` may only
  record an optional `WorkAssignmentReference` observed externally.
- `TaskReady` is emitted only during Stage activation; external observations
  cannot set a Task to `READY`.
- Workflow never automatically selects the next Stage. `AdvanceStage` requires
  an explicit target Stage and a closed `StageDisposition`.
- Review is an isolated implementation module for institutional assessment;
  certified canonical Authority, Decision and Approval remain owned by Human
  Governance.
- Review owns exactly one immutable ReviewRequest, ReviewSessions, Findings
  and one optional non-binding ReviewConclusion.
- Only CLOSED ReviewSessions contribute Finding IDs to ReviewConclusion.
  CANCELLED session Findings remain auditable but do not contribute.
- Review outcomes never alter Mission, Assets, Knowledge, Workflow or
  Publication. Cross-context coordination uses ports and neutral references.
- Review notifications occur after save. Notification failure remains visible
  and does not undo the in-memory persisted mutation.
- Asset graph checks and multi-Aggregate supersession are Application concerns
  exposed through ports; Assets never load other Assets from domain code.
- `Capability` is a Value Object and `CapabilitySet` is immutable.
- `Governance.Assignment` and `AIWorkforce.WorkAssignment` have separate IDs,
  ownership and rules.
- `BUSY` is derived from WorkAssignment state and is not persisted as source of
  truth; only explicit `PAUSED` changes operational availability.
- `Authority` exclusively owns its `Assignment[]`; an Assignment cannot be
  shared by multiple Authorities.
- `shared/references/` may import Shared Kernel identity primitives, but never
  Governance, Mission or another bounded context.
- `core/src/application/` is the only permitted cross-context coordination
  surface.

The architecture test validates the matrix for implemented contexts and keeps
future context names reserved for later Epics.
