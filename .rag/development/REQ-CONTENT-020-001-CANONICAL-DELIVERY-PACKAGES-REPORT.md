# REQ-CONTENT-020-001 — Canonical Delivery Packages Report

Status: `PASS`

## Purpose

This requirement establishes five canonical, informational Delivery Package
sources for the static BBA Agency site. It does not implement React pages,
routes, downloads, exports, publishing, backend calls, operational approvals,
or revision controls.

## Inventory and mapping

| Package | Product | Representative Project | Classification |
| --- | --- | --- | --- |
| Editorial Package | BBA Publisher | Neurons Protocol Launch | Prototype-backed |
| Campaign Package | Advertising Campaign | Responsible AI Awareness Campaign | Illustrative planned |
| Scientific Package | Scientific Article | AI-Assisted Publishing Research Article | Illustrative planned |
| Institutional Package | Governance Proposal | Institutional AI Content Governance Proposal | Illustrative planned |
| Research Package | Market Research | Enterprise AI Publishing Market Study | Illustrative planned |

## Schema and generated contract

The editable authority is `static/content/deliveries/*.md`, each pairing
restricted YAML frontmatter with fixed English Markdown sections. `schema.yml`
expresses the JSON Schema draft 2020-12 contract. The dependency-free content
library parses the documented source form, validates references against the
canonical Product and Project inventories, and deterministically emits
`static/src/content/deliveries/generated/delivery-content.generated.ts`.

The public TypeScript contract exposes Package identity, classification,
availability, relationships, artifacts, ordered review checkpoints, approval,
revision policy, illustrative version records, traceability, quality gates,
limitations, narrative sections, and FAQs. Lookup exports are deterministic by
ID and slug.

## Governance model

Every Package is explicitly non-operational on the static site. Artifacts are
structured informational views, not downloadable files. Review steps describe
Human Governance checkpoints; they do not execute decisions. Revision examples
preserve prior versions, source references, and decisions while explaining that
changed scope may affect resources. Trace records express the customer-facing
lineage from Project context through artifact and review to human decision and
final Package, without exposing runtime internals.

Quality gates are product-specific and use illustrative `WARNING` or `BLOCKING`
severity. Publisher discloses its separate functional prototype at
`https://dev.bba.country`; the remaining four Package sources disclose their
planned status. Required limitations cover publication, media, science,
institutional authority, legal review, source quality, and commercial uncertainty.

## Validation results

Passed: Product-content prerequisite, Project-content prerequisite,
Delivery-content validation and drift check, deterministic generation,
typecheck, lint, format check, build, agency-language check,
frontend-boundary check, and `git diff --check`.

Evidence is recorded in `.rag/evidence/REQ-CONTENT-020-001/`.

## Known limitations

The repository-native parser deliberately supports the documented restricted
YAML shape instead of a general YAML runtime dependency. Package page generation,
route validation, accessibility checks, and visual evidence belong to the later
frontend and test requirements. The content does not establish a live delivery,
publication, or approval workflow.

## Commit reference

`content(static): define canonical informational delivery packages`
