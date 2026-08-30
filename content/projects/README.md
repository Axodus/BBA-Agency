# BBA Agency Project example content sources

This directory is the canonical, machine-readable source for informational BBA
Agency Project examples on `bba.country`. A Project example explains a possible
structured engagement; it is not an operational Project, a customer record, or
evidence that a planned product is available.

Each Markdown file has YAML frontmatter for the complete structured rendering
model and a fixed English Markdown hierarchy for the authoritative narrative.
Read [`schema.yml`](schema.yml), validate the source, then consume the generated
typed module. React components provide layout and reusable labels only: they
must not create a second Project narrative or fill a missing content field.

Only `neurons-protocol-launch` is `PROTOTYPE_BACKED`, because BBA Publisher has
a separately hosted functional prototype at `https://dev.bba.country`. Every
other source is `ILLUSTRATIVE_PLANNED`; it describes intended product behavior
and must not imply operational availability, execution, publication, or a
customer outcome.

## Adding or changing an example

1. Use a stable lowercase ID and the matching non-localized `/projects/...` route.
2. Complete all frontmatter fields, exact required Markdown sections, and at
   least five FAQs before page work begins.
3. Reference an existing canonical Product ID; do not duplicate the Product
   catalog in this directory.
4. Keep previous/next navigation reciprocal and update its neighboring sources.
5. State limitations, human authority, source-quality boundaries, and the
   correct prototype or planned-product disclosure.
6. Run `pnpm --dir static check:project-content` and regenerate the typed input
   with `pnpm --dir static generate:project-content`.

The static website never defines forms, execution commands, persistence, API
endpoints, active approval controls, or export actions in these sources.
