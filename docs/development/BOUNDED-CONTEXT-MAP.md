# Bounded Context Map

Status: ACCEPTED for EPIC-IMP-004 implementation.

This local map records implementation boundaries for the Core. It does not
replace the certified BBA Platform Architecture or Domain documentation.

```text
                         Shared Kernel
                              │
          ┌───────────────────┼───────────────────────┐
          ▼                   ▼                       ▼
       Mission          Human Governance        AI Workforce
          ▲                   ▲                       ▲
          │                   │                       │
          └──── Application Coordinators/Ports ──────┘
                              │
                              ▼
                    future Assets, Knowledge,
                    Workflow, Publication,
                    Connector contexts
```

Rules:

- Bounded Contexts may depend on neutral Shared Kernel contracts only.
- Bounded Contexts must not import another Bounded Context laterally.
- Mission and Governance coordinate through public Application ports.
- `Decision` references `MissionId`; it never owns or loads a Mission.
- Mission stores only neutral Authority, Decision and Approval references.
- AI Workforce stores only neutral Mission, Governance and Tenant references;
  it never imports a Mission or Governance Aggregate.
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
