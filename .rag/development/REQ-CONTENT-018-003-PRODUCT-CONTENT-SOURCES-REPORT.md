# REQ-CONTENT-018-003 — Product Content Sources Report

Status: `PASS`

## Purpose

This requirement establishes canonical, machine-readable, long-form product
content for five BBA Agency services under `static/content/products/`. It does
not implement React detail pages or add operational behavior to `bba.country`.

## Selected format and schema

Each product uses Markdown with YAML frontmatter. The frontmatter supplies
stable identity, route, availability, SEO, navigation, audience, structured
agent roles, workflow stages, and deliverables; the body supplies the fixed
editorial hierarchy. `schema.yml` is JSON Schema expressed as YAML and defines
schema version `1.0`, required fields, allowed availability codes, role,
workflow, and deliverable shapes, nullable navigation, and versioning rules.

`static/tools/check-product-content.mjs` is dependency-free and validates the
restricted documented YAML shape, content inventory, workflow and deliverable
requirements, headings, FAQ minimum, template markers, status disclosures, and
the static-site boundary. `static/package.json` exposes it as
`pnpm --dir static check:product-content`.

## Product inventory

| Product | Route | Availability | Team status | Package |
|---|---|---|---|---|
| BBA Publisher | `/services/publisher` | Prototype available | Prototype implemented | Editorial Package |
| Advertising Campaign | `/services/advertising` | Planned | Conceptual | Campaign Package |
| Scientific Article | `/services/scientific-writing` | Planned | Conceptual | Scientific Package |
| Governance Proposal | `/services/governance` | Planned | Conceptual | Institutional Package |
| Market Research | `/services/research` | Planned | Conceptual | Research Package |

## Content decisions and terminology

The sources lead with customer problems and outcomes, then identify materials,
Agency team responsibilities, human checkpoints, deliverables, traceability,
limitations, availability, and an illustrative example. The common customer
journey is specialized for each service rather than copied as generic process
copy. Customer-facing vocabulary uses Service, Product, Project, Context,
Materials, Agency team, Agent role, Human checkpoint, Deliverable, Package,
Review, Delivery, and Traceability.

The static website explains services only. It does not create projects, execute
work, make decisions, or publish. BBA Publisher is the sole separately hosted
prototype; its source clearly states no external publication occurs. The other
four sources are planned conceptual products and contain no operational CTA.

## Limitations

The validator deliberately parses the bounded frontmatter grammar described by
the schema rather than becoming a general YAML parser. Product pages are out of
scope and have not yet been changed to consume these sources. The existing
`services.ts` catalog remains the compact card and routing source; detailed
documents are authoritative for future product detail pages.

## Validation results

```text
pnpm --dir static check:product-content
Product content validation passed: 5 files, schemaVersion 1.0.

pnpm --dir static typecheck
tsc --noEmit
```

Both commands exited successfully. Full inventory and terminology evidence are
in `.rag/evidence/REQ-CONTENT-018-003/`.

## Files changed

- `static/content/products/README.md`
- `static/content/products/schema.yml`
- five product Markdown sources under `static/content/products/`
- `static/tools/check-product-content.mjs`
- `static/package.json`
- `.rag/evidence/REQ-CONTENT-018-003/`
- this report

## Commit reference

Intended subject: `content(static): define detailed BBA Agency product sources`.
Local commit creation was attempted but could not complete because the resolved
Git metadata path (`/opt/Axodus/BBA-Agency/.git/index.lock`) is read-only in
this execution environment. No commit or push was created.
