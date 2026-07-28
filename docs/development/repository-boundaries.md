# Repository Boundaries

REQ: `REQ-IMP-000-002`

## Responsibilities

| Area | Responsibility |
| --- | --- |
| `core/` | Isolated BBA Platform Core implementation, tests, and bootstrap tooling. |
| `demo/` | Deterministic local Publisher Reference Demo for demonstration only. |
| `src/` | Preserved legacy experiments until a separately approved migration. |
| `docs/development/` | Local implementation controls, source index, evidence, and M0 reports. |
| `docs/adr/` | Local durable technical decisions; not a replacement for domain ADRs. |

## Dependency policy

| Dependency | Status in this Epic |
| --- | --- |
| `core/` → `demo/` | **PROHIBITED** |
| `core/` → `src/` | **PROHIBITED** |
| `demo/` → `core/` | **PROHIBITED** in EPIC-IMP-000 |
| `src/` → `core/` | **PROHIBITED** in EPIC-IMP-000 |
| Core → external Connector | **PROHIBITED** in EPIC-IMP-000 |
| Core → database, ORM, frontend, Agent runtime | **PROHIBITED** in EPIC-IMP-000 |
| Documentation → any repository area | Allowed as a reference only |

The executable boundary is enforced by `core/tools/check-core-boundaries.mjs`
and `core/test/architecture/core-isolation.test.ts`. Documentation may name
`demo/` and `src/`; the boundary test only scans executable Core files.

## Future sharing and migration

Shared code may be introduced only through a future REQ with explicit owner,
contract, lineage, tests, and migration evidence. Copying legacy code into the
Core is not a migration strategy. No migration is implied by this baseline.

## Non-regression rule

Core validation and demo validation are separate gates. A Core change cannot
be accepted by weakening demo behavior, and demo code cannot be imported to
make a Core test pass.
