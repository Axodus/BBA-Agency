# BBA Platform Development Constitution

REQ: `REQ-IMP-000-008`

## Authority order

Certified Foundation, Product, Domain, Architecture, Development, and
Operations documentation are the normative source. Approved local ADRs record
durable implementation choices but cannot redefine certified domain meaning.
This REQ is the execution instruction for EPIC-IMP-000 and is subordinate to
the certified corpus.

## Constitutional principles

- Mission remains the central unit of purposeful work.
- The Core remains Tenant-neutral; Axodus is not a default Tenant.
- Human Governance retains institutional Authority; technical permissions do
  not replace it.
- Agents execute bounded Assignments and cannot approve their own work.
- Institutional Assets retain identity, Version, ownership, Stewardship,
  Evidence, and Lineage.
- Approval, authorization for distribution, submission, channel acceptance,
  and publication are distinct meanings.
- Domain rules are independent from frameworks, persistence, Connectors, and
  runtime providers.
- Dependencies are directional and bounded by owned responsibilities.
- Failures are attributable, visible, and semantically distinguishable.
- Every material implementation leaves traceability from REQ to code, tests,
  ADRs, and commit evidence.
- Tenant boundaries, least disclosure, secrets, and public/private boundaries
  are preserved in every environment.

## Engineering baseline

The initial Core uses TypeScript, Node.js, ESM, pnpm, native `node:test`, a
modular monolith shape, Ports and Adapters, and in-memory repositories. It
does not add an ORM, database, frontend framework, real Connector, or Agent
runtime in M0.

## Change and contribution rules

Durable changes to runtime, dependency direction, persistence, public
interfaces, Authority, Tenant isolation, Asset identity, or Lineage require an
ADR or approved Change Control. Contributions remain scoped to one coherent
REQ, include focused tests and documentation, and do not push, merge, release,
or mutate remote state automatically.

## Module public API rule

Every REQ must document the module's public API explicitly: exported classes,
interfaces, types, factories, and stable error contracts. Internal helpers and
implementation details remain unexported unless an accepted ADR or a future
REQ changes the boundary.
