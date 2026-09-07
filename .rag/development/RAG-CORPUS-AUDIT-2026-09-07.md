# RAG Corpus Audit — 2026-09-07

## Scope

This audit reviewed the local `.rag/` corpus against the active `dev`
workspace, repository boundaries, package layout, and the UI Foundation gate
approved on September 6, 2026.

## Outcome

The corpus remains useful after routing changes. The main risk was retrieval of
the April 2026 AXODUS campaign-agent material as though it described the active
BBA Agency implementation.

The [Operational Documentation Index](../OPERATIONAL_INDEX.md) is now the
required entry point for active work. It routes agents by task, records the
authority hierarchy, and distinguishes active controls, implemented evidence,
planned work, and historical material.

## Classification

| Collection or record set | Classification | Handling |
| --- | --- | --- |
| `development/repository-boundaries.md`, `definition-of-ready.md`, `definition-of-done.md`, `source-index.md` | Active control | Read before changes in the active workspace |
| `adr/` and `development/contracts/` | Active implementation reference | Use with the private certified corpus and applicable code |
| `design/BBA-APP-UI-FOUNDATION.md` and `development/UI-FOUNDATION-VERIFICATION-2026-09-06.md` | Active UI reference and evidence | Read for web and UI SDK work |
| `development/*-REPORT.md` and EPIC implementation records | Implemented evidence | Use to establish what was verified at the recorded time; revalidate when scope changes |
| Records that reference `static/`, `demo/`, or legacy `src/` | Historical traceability within an implementation record | Do not infer an active dependency, runtime, or deployment from those references |
| `plans/` | Historical | Explicit warnings added to every legacy AXODUS plan |
| `evidence/` | Evidence | Versioned files are evidence; generated untracked artifacts require review before they become governed evidence |

## Obsolete operational instructions corrected

- The eight April 2026 AXODUS plan files now identify themselves as historical
  at the top of the document.
- The development index no longer points to a missing demo regression contract
  or identifies `EPIC-IMP-005 / M5` as the current gate.
- The UI Foundation semantic-state table now includes `blocked`, matching the
  implemented `@bba/ui` contract and its verification report.
- The root corpus README now routes agents to the operational index and
  describes `design/` and `evidence/` as first-class collections.

## Known historical references retained intentionally

The former institutional `static` surface, the deterministic `demo`, legacy
`src`, and the AXODUS memory stack remain mentioned in reports, architecture
records, design audits, and evidence because those documents preserve
traceability. They are not removed or rewritten as current behavior. The active
workspace boundary and operational index supersede them for execution.

## Validation

- Confirmed active workspace roots: `apps/`, `packages/`, `core/`,
  `transport/`, `contracts/`, and `.rag/`.
- Confirmed `pnpm-workspace.yaml` does not include `static`.
- Confirmed legacy `src/` and `docker-compose.memory.yml` are absent from
  active `dev`.
- Checked documentation changes with `git diff --check`.
