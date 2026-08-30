# BBA Agency Delivery Package content sources

This directory is the canonical, machine-readable source for informational
Delivery Packages on `bba.country`. A Package explains the reviewed materials,
human decisions, and traceability a customer can expect after a representative
Project. It is never a customer record, a download, or an operational workflow.

Every source combines YAML frontmatter with a fixed English Markdown narrative.
Read [`schema.yml`](schema.yml), validate the sources, and consume the generated
TypeScript module. JSX supplies presentation only; it must not become a second
source of canonical Package copy.

## Boundary and status

The static site explains deterministic informational examples. It does not
generate, approve, request revisions for, export, download, or publish a
Package. Future functional workflows belong to `dev.bba.country` and remain
subject to Human Governance. `PROTOTYPE_BACKED` applies only to the Editorial
Package; all other Packages are `ILLUSTRATIVE_PLANNED` and must not imply an
implemented service.

## Relationships and maintenance

Each Package references one canonical Product and one representative Project.
Those names and routes are resolved against `content/products/` and
`content/projects/`; do not duplicate or invent either catalog. File names,
IDs, slugs, and `/deliveries/...` routes are stable and are not localized.
Canonical copy is English (`en-US`).

To add a Package, first extend the validated inventory in the delivery content
library, then add a complete Markdown source, reciprocal navigation, at least
five FAQs, and all schema fields. Run:

```text
pnpm --dir static generate:delivery-content
pnpm --dir static check:delivery-content
```

The generator is the only writer of `src/content/deliveries/generated/`.
Operational controls, calls to APIs, action metadata, download references, and
canonical Package prose in JSX are prohibited.
