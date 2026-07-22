# M0 — Repository Ready Report

REQ: `REQ-IMP-000-022`
Program: `BBA Platform Core Implementation`
Epic: `EPIC-IMP-000 — Baseline e Fundação do Repositório`
Date: `2026-07-22`

## Result

- EPIC-IMP-000: **PASS**
- M0 — Repository Ready: **PASS**
- Push realizado: **NÃO**

## Executive summary

The repository now has an isolated `core/` TypeScript + Node.js + ESM
workspace using pnpm and native `node:test`. Development governance, source
indexing, repository boundaries, DoR, DoD, validation taxonomy, traceability,
and six local ADRs were added. CI validates Core quality and demo static
regression in separate jobs. The Core has no executable dependency on `demo/`
or legacy `src/`. Existing demo and legacy files were preserved. The private
normative corpus was available in the sibling Documentation checkout; the
requested `BBAPLT-GDE-076-*` source was absent and is recorded as a gap. No
domain aggregate or production capability was implemented in this Epic.

## REQs

| REQ | Status | Evidence |
| --- | --- | --- |
| REQ-IMP-000-001 | DONE | `repository-baseline.md` |
| REQ-IMP-000-002 | DONE | `repository-boundaries.md` |
| REQ-IMP-000-003 | DONE | `core/`, smoke test, Core README |
| REQ-IMP-000-004 | DONE | `pnpm-workspace.yaml`, updated `pnpm-lock.yaml` |
| REQ-IMP-000-005 | DONE | boundary checker and architecture test |
| REQ-IMP-000-006 | DONE | `demo-regression-contract.md` and static checks |
| REQ-IMP-000-007 | DONE | `source-index.md` |
| REQ-IMP-000-008 | DONE | `development-constitution.md` |
| REQ-IMP-000-009 | DONE | `definition-of-ready.md` |
| REQ-IMP-000-010 | DONE | `definition-of-done.md` |
| REQ-IMP-000-011 | DONE | `traceability-matrix.md` |
| REQ-IMP-000-012 | DONE | `error-and-validation-taxonomy.md` |
| REQ-IMP-000-013 | DONE | `docs/adr/README.md` and template |
| REQ-IMP-000-014 | DONE | ADR-IMP-0001 |
| REQ-IMP-000-015 | DONE | ADR-IMP-0002 |
| REQ-IMP-000-016 | DONE | ADR-IMP-0003 |
| REQ-IMP-000-017 | DONE | ADR-IMP-0004 |
| REQ-IMP-000-018 | DONE | ADR-IMP-0005 |
| REQ-IMP-000-019 | DONE | ADR-IMP-0006 and native tests |
| REQ-IMP-000-020 | DONE | Core `check` command |
| REQ-IMP-000-021 | DONE | `.github/workflows/core-foundation.yml` |
| REQ-IMP-000-022 | DONE | This report |

## Files created

- `core/` workspace, bootstrap export, smoke test, architecture test, and
  deterministic quality/boundary tools;
- `docs/development/` local Development controls and M0 evidence;
- `docs/adr/` index, template, and six implementation ADRs;
- `.github/workflows/core-foundation.yml`;
- `pnpm-workspace.yaml`.

## Files altered

- `package.json`: pinned repository package manager to `pnpm@11.1.2`;
- `pnpm-lock.yaml`: added the Core workspace importer and synchronized the
  previously stale root dependency graph;
- `.gitignore`: ignored Core test output at `core/.tmp/`.

## Files preserved

- `demo/`: no files changed;
- `src/`: no files changed;
- `package-lock.json`: preserved;
- existing root scripts and root `tsconfig.json`: preserved.

## ADRs

| ID | Decision | Status |
| --- | --- | --- |
| ADR-IMP-0001 | Core isolated in `core/`; no demo/legacy imports | ACCEPTED |
| ADR-IMP-0002 | TypeScript + Node.js + ESM baseline | ACCEPTED |
| ADR-IMP-0003 | Modular monolith | ACCEPTED |
| ADR-IMP-0004 | Ports and Adapters | ACCEPTED |
| ADR-IMP-0005 | In-memory repositories before persistence selection | ACCEPTED |
| ADR-IMP-0006 | Native `node:test` and minimal quality scripts | ACCEPTED |

## Validation

| Command | Result | Observation |
| --- | --- | --- |
| `pnpm install --frozen-lockfile --store-dir /tmp/bba-pnpm-store` | PASS | Reproducible workspace install; optional legacy build scripts are explicitly ignored in `pnpm-workspace.yaml`. |
| `pnpm --dir core check` | PASS | Typecheck, test, lint, format, and architecture checks. |
| `pnpm --dir core typecheck` | PASS | Strict ESM TypeScript compilation. |
| `pnpm --dir core test` | PASS | 2 native tests passed. |
| `pnpm --dir core lint` | PASS | Deterministic Core source lint. |
| `pnpm --dir core format:check` | PASS | No trailing whitespace or missing final newlines. |
| `pnpm --dir core architecture` | PASS | No executable Core dependency on `demo/` or `src/`. |
| `python -c` workflow YAML parse | PASS | CI workflow parsed with local PyYAML. |
| `node --check demo/src/*.js` required files | PASS | 8 demo modules passed syntax checks. |
| `python -m json.tool demo/data/*.json` required files | PASS | 4 demo JSON files passed syntax checks. |
| Static HTTP smoke on `http://127.0.0.1:8765/demo/index.html` | PASS | HTTP 200; temporary server stopped after request. |
| `git diff --check` | PASS | No whitespace errors. |
| Browser automation scenarios | NOT_RUN | No browser automation harness was available; no visual or cross-browser claim is made. |

## Demo

The required static JavaScript, JSON, and HTTP checks passed. Interactive
workflow scenarios and visual/cross-browser validation were not run. The demo
was not modified and remains a deterministic local reference implementation.

## Boundaries

- core → demo: **nenhuma dependência**
- core → src: **nenhuma dependência**
- demo preservado: **sim**
- src preservado: **sim**

## Risks and gaps

- `BBAPLT-GDE-076-*.md` is absent from the inspected private corpus. The source
  index records the gap without inventing a document.
- The private Documentation checkout is a sibling repository and is not
  included in a clean BBA-Agency clone.
- Optional native build scripts from existing legacy dependencies are explicitly
  ignored in `pnpm-workspace.yaml`; M0 does not require those runtime builds.
- M0 has no remote CI execution evidence; the workflow was parsed and reviewed
  locally, but GitHub Actions itself was not invoked.

## Commits locais

- `ec43bf3` — `docs: add repository baseline and development gates`
- `7e3c375` — `chore(core): scaffold isolated TypeScript workspace`
- `29291fe` — `docs(adr): record initial core architecture decisions`
- A final documentation closeout commit records this hash list and the M0
  report update.

## Próximo gate

EPIC-IMP-001 may begin. Its first REQ must implement canonical identity and
Tenant Context contracts without weakening the boundaries established here.
