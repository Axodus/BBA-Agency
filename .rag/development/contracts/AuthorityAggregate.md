# Authority Aggregate Contract

`Authority` represents institutional human authority. It is distinct from
authentication, technical permission, capability, responsibility and
accountability.

Lifecycle:

```text
Proposed → Active → UnderReview → Updated → Active
                         │
                         └────────────→ Retired
```

`DeactivateAuthority` retires an Authority. `SuspendAuthority` records a
time-bounded protective condition while preserving the lifecycle status.

`Authority` exclusively owns its Assignment entities. Assignment identity,
Tenant and ownership cannot be transferred or shared with another Authority.
Overlapping incompatible periods are rejected.

Public exports are defined in the Governance domain and application barrels.
The in-memory repository is a deterministic reference adapter only.
