# BBA Agency Operational Documentation Index

Effective date: September 7, 2026

This is the entry point for agents working in the active `dev` workspace. Read
the documents in the route that matches the task before treating historical
records as implementation guidance.

## Authority and document states

The certified private Documentation corpus remains the normative source. Its
repository-relative reference is defined in [development/source-index.md](development/source-index.md).

Local `.rag/` records use these practical states:

| State | Meaning | Use in execution |
| --- | --- | --- |
| Active control | Describes a current workspace rule or boundary | Follow it |
| Implemented evidence | Records a completed, locally verified change | Use as evidence; revalidate when scope changes |
| Planned | Describes a target that is not yet implemented | Do not present as current behavior |
| Historical | Preserves prior work or archived surfaces | Do not use as an implementation instruction |

The machine-readable [Execution Manifest](execution-manifest.json) maps each
executive implementation Epic to its authority, records, implementation area,
dependencies, validation commands, and blockers. It is checked by
`pnpm workspace:check`.

## Start here by task

| Task | Required reading |
| --- | --- |
| Any workspace change | [development/repository-boundaries.md](development/repository-boundaries.md), [development/definition-of-ready.md](development/definition-of-ready.md), and [development/definition-of-done.md](development/definition-of-done.md) |
| Core or canonical Platform API | [development/source-index.md](development/source-index.md), [development/BOUNDED-CONTEXT-MAP.md](development/BOUNDED-CONTEXT-MAP.md), [development/contracts/README.md](development/contracts/README.md), and applicable ADRs |
| Private Publisher API or Railway runtime | [development/repository-boundaries.md](development/repository-boundaries.md), `contracts/agency/`, and the implementation in `apps/api`, `transport/agency-runtime`, and `packages/publisher-prototype` |
| Web UI or Vercel surface | [design/BBA-APP-UI-FOUNDATION.md](design/BBA-APP-UI-FOUNDATION.md), [development/UI-FOUNDATION-VERIFICATION-2026-09-06.md](development/UI-FOUNDATION-VERIFICATION-2026-09-06.md), and [architecture/EPIC-IMP-014-FRONTEND-FOUNDATION.md](architecture/EPIC-IMP-014-FRONTEND-FOUNDATION.md) |
| UI component or accessibility change | [design/BBA-APP-UI-FOUNDATION.md](design/BBA-APP-UI-FOUNDATION.md), [development/UI-FOUNDATION-VERIFICATION-2026-09-06.md](development/UI-FOUNDATION-VERIFICATION-2026-09-06.md), and [evidence/BBA-APP-UI-FOUNDATION/design-qa.md](evidence/BBA-APP-UI-FOUNDATION/design-qa.md) |
| Architecture decision | [adr/README.md](adr/README.md), then the relevant ADR and [development/repository-boundaries.md](development/repository-boundaries.md) |
| Verification or release evidence | [development/UI-FOUNDATION-VERIFICATION-2026-09-06.md](development/UI-FOUNDATION-VERIFICATION-2026-09-06.md), applicable `development/*-REPORT.md`, and matching `evidence/` directory |

## Active workspace facts

- `apps/web` is the BBA application UI deployed through Vercel.
- `apps/api` is the private, transitional Publisher API runtime deployed through Railway.
- `packages/publisher-prototype` and `transport/agency-runtime` support the active Publisher runtime.
- `core`, `transport/http`, and `contracts/openapi` define the canonical Platform direction. A Core HTTP host is not mounted or deployed.
- `publisher-prototype -> core` is planned work that requires a separate adaptation contract, compatibility tests, and migration plan.
- The maximum demonstrated distribution state is `approved for distribution`; no local record proves external publication.

## Historical material

`plans/` preserves the April 2026 AXODUS campaign-agent framework, its memory
stack, and its merge plans. Those files reference removed `src/`, `axodus/`,
MongoDB/Chroma memory infrastructure, and `npm` scripts. They are historical
context only. The archived source snapshot is
`archive/dev-legacy-demo-src-2026-09-03`.

Some development, design, architecture, and evidence records refer to the
former `static/`, `demo/`, or legacy `src/` surfaces. They remain traceability
evidence for the work completed at the time. They do not establish an active
dependency or deployment path.

## Validation baseline

Run the smallest relevant check. For a cross-workspace verification, run:

```bash
pnpm workspace:check
pnpm contracts:check
```

For API, Core, or Web changes, follow the scoped commands in
[development/repository-boundaries.md](development/repository-boundaries.md)
and the repository instructions.
