# Repository Baseline

REQ: `REQ-IMP-000-001`

## Observed state

| Area | Classification | Evidence and boundary |
| --- | --- | --- |
| `core/` | `CORE_TARGET` | New isolated TypeScript + Node.js + ESM workspace created by this Epic. |
| `demo/` | `REFERENCE_DEMO` | Static, deterministic browser reference implementation; must remain independent. |
| `src/` | `LEGACY` | Earlier TypeScript and campaign-oriented experiments; not the target Core. |
| `.rag/development/` | `CORE_TARGET` | Local implementation governance and traceability records. |
| `.rag/adr/` | `CORE_TARGET` | Local durable implementation decisions. |
| `.instructions/` | `REVIEW_REQUIRED` | Historical/recovery instruction surface; not the certified BBA Platform corpus. |
| `.rag/plans/` | `LEGACY` | Historical implementation plans and status reports; not architectural authority. |
| `package.json` | `REVIEW_REQUIRED` | Existing CommonJS/legacy scripts and dependencies remain preserved. |
| `pnpm-lock.yaml` | `REVIEW_REQUIRED` | Existing lockfile retained; Core workspace importer is added only as needed. |
| `package-lock.json` | `REVIEW_REQUIRED` | Existing npm lockfile retained; no forced repository-wide package-manager migration. |
| `tsconfig.json` | `LEGACY` | Existing root TypeScript configuration targets `src/`; Core owns its own config. |
| `.github/` | `CORE_TARGET` | No workflow existed at baseline; M0 adds a Core validation workflow. |
| `docs/` | `CORE_TARGET` | Directory did not contain the local Core Development index before this Epic. |
| generated artifacts | `GENERATED` | `node_modules/`, `dist/`, and `core/.tmp/` are not source inputs. |
| secrets | `PROHIBITED_FOR_CORE_DEPENDENCY` | `.env` is ignored; no secret is required for M0. |

## Existing command surface

The root project exposes legacy `npm` scripts for TypeScript agents, memory,
MCP, and campaign experiments. They were inspected but not reclassified as
Core commands. The root `typecheck` and `build` target `src/` through the
existing root `tsconfig.json`.

M0 adds Core-scoped commands documented in `core/README.md` and does not claim
that the legacy command suite validates the Core.

## Risks and conflicts

- The root package is currently CommonJS; the Core is intentionally ESM in its
  own package boundary.
- Both npm and pnpm lockfiles exist; M0 pins pnpm for the workspace without
  deleting or rewriting the legacy npm lockfile.
- No existing lint, format, or CI workflow was found for the Core; M0 uses
  deterministic local quality checks without adding a framework dependency.
- The workspace explicitly ignores build scripts for the existing optional
  `onnxruntime-node`, `protobufjs`, and `sharp` dependencies; M0 does not need
  native builds.
- The private Documentation checkout is external to this repository and may be
  absent in a clean clone.
- The requested `BBAPLT-GDE-076-*` reference uses a different canonical file
  name: `BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md` declares that document ID.

## Preservation result

No file under `demo/` or `src/` was moved, deleted, or refactored by this Epic.
