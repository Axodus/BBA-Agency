# BBA Agency product content sources

This directory is the canonical long-form content source for BBA Agency product
detail pages. It is intended for coding agents, static page generators,
frontend developers, and content validation tools. The compact catalog in
[`../../src/content/services.ts`](../../src/content/services.ts) supplies cards,
availability, and routing; these Markdown documents are authoritative for
complete product-page copy when the sources differ.

Each document has YAML frontmatter and a fixed Markdown heading hierarchy.
Read [`schema.yml`](schema.yml), validate the frontmatter, parse the Markdown
sections, and map fields to page components without changing their meaning.
Do not embed canonical long-form copy directly in JSX. A missing required field
or heading is a content gap: report it or fail generation rather than inventing
content.

## Adding or changing a product

1. Copy the structural pattern of an existing document and use a stable,
   lowercase ID and non-localized `/services/...` route.
2. Complete every schema field, role, workflow stage, deliverable, required
   heading, limitation, example, and FAQ before wiring a page.
3. Keep the default source language and application language as English.
4. Run `pnpm --dir static check:product-content` and update the evidence and
   implementation report for a governed change.

These are informational sources for `bba.country`. They explain a future or
prototype product experience but never execute a project, create a project,
or make decisions on the static site. Only BBA Publisher has a separately
hosted functional prototype at `dev.bba.country`; the other initial products
are planned concepts. Avoid pricing, financial meanings for `$Neurons`,
unverified performance claims, legal advice, or claims of external publication.
