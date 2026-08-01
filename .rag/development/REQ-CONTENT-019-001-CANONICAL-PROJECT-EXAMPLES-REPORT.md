# REQ-CONTENT-019-001 — Canonical Project Examples Report

Status: `PASS`

## Purpose

This requirement establishes five canonical informational Project examples for
the static BBA Agency website. It does not implement Project pages, browser
controls, backend calls, persistence, approvals, exports, or execution.

## Content architecture

`static/content/projects/*.md` is the editable authority. Every source pairs
structured YAML frontmatter with a fixed English narrative hierarchy. A
dependency-free validator checks the sources and generates the typed rendering
input at `static/src/content/projects/generated/project-content.generated.ts`.
The generated module is deterministic and is not manually edited. React is a
future consumer of this content; it must not invent missing Project narrative.

The Project validator loads the existing canonical Product content inventory,
so Product IDs, names, and routes are checked against the authoritative Product
sources rather than copied into a second catalog.

## Inventory

| Project | Product | Status | Package |
| --- | --- | --- | --- |
| Neurons Protocol Launch | BBA Publisher | Prototype-backed example | Editorial Package |
| Responsible AI Awareness Campaign | Advertising Campaign | Illustrative planned example | Campaign Package |
| AI-Assisted Publishing Research Article | Scientific Article | Illustrative planned example | Scientific Package |
| Institutional AI Content Governance Proposal | Governance Proposal | Illustrative planned example | Institutional Package |
| Enterprise AI Publishing Market Study | Market Research | Illustrative planned example | Research Package |

## Schema and terminology decisions

Schema version `1.0` defines stable public identity, Product relationship,
availability disclosure, context and materials, expected outcome, ordered
workflow, team roles, human decisions, revision example, deliverables,
traceability, limitations, SEO, and previous/next navigation. The validator
also resolves all internal IDs: materials to facts, roles and artifacts to
stages, decisions to checkpoints, expected outcome references, revisions, and
trace records.

The content uses customer-facing Project vocabulary: Context, Materials,
Deliverables, Package, Agent team, Human checkpoints, Review, Delivery, and
Traceability. It keeps the static/prototype boundary explicit. Only Publisher
is prototype-backed and links to `dev.bba.country`; the other four sources are
illustrative planned products and state that they are not operational
implementations.

## Product-specific differences

The Publisher example covers the current Publisher prototype pattern and its
Editorial Core, strategy, Blog, LinkedIn, Instagram, consistency review, and
non-publication boundary. Advertising excludes media purchasing and performance
guarantees. Scientific writing excludes fabricated evidence, authorship
replacement, and journal-acceptance claims. Governance preserves authorized
human institutional decisions and excludes legal advice. Market research makes
source quality, assumptions, and commercial uncertainty visible.

## Validation and known limitations

Passed: Project content validation, canonical Product-reference validation,
typecheck, lint, format, build, language gate, frontend-boundary check, and
`git diff --check`. Generation is stable from sorted canonical sources.

The schema is a formal JSON Schema expressed in YAML; enforcement is provided
by the repository-native dependency-free validator, which intentionally parses
the documented restricted YAML form rather than implementing a general YAML
engine. Page generation and browser evidence belong to later frontend requests.

## Files changed

- `static/content/projects/` canonical sources, schema, and consumption guide
- `static/tools/project-content-lib.mjs` and validation/generation entrypoints
- `static/src/content/projects/` typed content contract and generated module
- `static/package.json` Project-content scripts and build prerequisite
- `.rag/evidence/REQ-CONTENT-019-001/` validation evidence

## Commit reference

`content(static): define canonical informational project examples`
