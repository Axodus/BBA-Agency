# Implementation Traceability Matrix

REQ: `REQ-IMP-000-011`

| Requirement | Source document | Invariant / responsibility | Code path | Test path | ADR | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REQ-IMP-000-001 | BBA-STD-001 | Repository evidence | `docs/development/repository-baseline.md` | M0 review | — | DONE |
| REQ-IMP-000-002 | BBA-POL-001 | Executable boundaries | `docs/development/repository-boundaries.md` | `core/test/architecture/core-isolation.test.ts` | ADR-IMP-0001 | DONE |
| REQ-IMP-000-003 | BBA-GDE-081 | Core isolation | `core/` | `core/test/smoke.test.ts` | ADR-IMP-0001/2 | DONE |
| REQ-IMP-000-004 | BBA-GDE-097 | Reproducible dependencies | `pnpm-workspace.yaml` | CI install | ADR-IMP-0002 | DONE |
| REQ-IMP-000-005 | BBA-GDE-079 | Directional dependency boundary | `core/tools/check-core-boundaries.mjs` | architecture test | ADR-IMP-0001 | DONE |
| REQ-IMP-000-006 | BBA-GDE-080 | Demo non-regression | `docs/development/demo-regression-contract.md` | demo syntax/data checks | — | DONE |
| REQ-IMP-000-007 | BBA-ADR-0001 | Documentation authority | `docs/development/source-index.md` | source availability review | — | DONE |
| REQ-IMP-000-008 | BBAPLT-DEV-001 | Development governance | `docs/development/development-constitution.md` | document review | — | DONE |
| REQ-IMP-000-009 | BBA-STD-002 | Readiness gate | `docs/development/definition-of-ready.md` | checklist review | — | DONE |
| REQ-IMP-000-010 | BBA-STD-002 | Completion evidence | `docs/development/definition-of-done.md` | M0 report | — | DONE |
| REQ-IMP-000-011 | BBA-STD-001 | Bidirectional traceability | this matrix | M0 report | — | DONE |
| REQ-IMP-000-012 | GDE-085 | Error and validation clarity | `docs/development/error-and-validation-taxonomy.md` | Core quality checks | — | DONE |
| REQ-IMP-000-013 | GDE-079 | ADR governance | `docs/adr/` | ADR review | — | DONE |
| REQ-IMP-000-014 | GDE-081 | Core boundary | `core/` | architecture test | ADR-IMP-0001 | DONE |
| REQ-IMP-000-015 | GDE-096/098 | Runtime and build boundary | `core/package.json`, `core/tsconfig.json` | typecheck/test | ADR-IMP-0002 | DONE |
| REQ-IMP-000-016 | ARCH-003 | Modular ownership | `core/` structure | architecture review | ADR-IMP-0003 | DONE |
| REQ-IMP-000-017 | GDE-081/082 | Directional adapters | M0 boundary policy | architecture review | ADR-IMP-0004 | DONE |
| REQ-IMP-000-018 | GDE-083 | Persistence deferred | constitution and ADR | future contract tests | ADR-IMP-0005 | DONE |
| REQ-IMP-000-019 | GDE-080/085 | Deterministic tests | `core/test/` | `node:test` | ADR-IMP-0006 | DONE |
| REQ-IMP-000-020 | GDE-080/098 | Quality commands | `core/package.json`, `core/tools/` | Core check | ADR-IMP-0006 | DONE |
| REQ-IMP-000-021 | GDE-098 | CI validation | `.github/workflows/core-foundation.yml` | GitHub Actions config | ADR-IMP-0002/6 | DONE |
| REQ-IMP-000-022 | BBA-STD-001/002 | M0 decision evidence | `docs/development/M0-REPOSITORY-READY-REPORT.md` | validation table | — | DONE |

`DONE` means the local artifact exists and its validation evidence is recorded
in the M0 report.
