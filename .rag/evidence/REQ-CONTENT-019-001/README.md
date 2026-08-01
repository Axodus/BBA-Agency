# REQ-CONTENT-019-001 — Evidence

## Content and schema validation

```text
pnpm --dir static check:project-content
Project content validation passed: 5 files, schemaVersion 1.0.
EXIT: 0
```

The check generates `static/src/content/projects/generated/project-content.generated.ts` from the five canonical Markdown sources.

## Static validation

```text
pnpm --dir static typecheck
tsc --noEmit
EXIT: 0

pnpm --dir static lint
Lint check passed.
EXIT: 0

pnpm --dir static format:check
Format check passed.
EXIT: 0

pnpm --dir static build
Product content validation passed: 5 files, schemaVersion 1.0.
Project content validation passed: 5 files, schemaVersion 1.0.
EXIT: 0

node tools/check-agency-language.mjs
Agency language check passed: canonical English, default locale en-US, fallback locale en-US.
EXIT: 0

node tools/check-frontend-boundaries.mjs
Frontend package graph check passed.
EXIT: 0

git diff --check
EXIT: 0
```

## Evidence inventory

- `content-inventory.yml` records the five canonical Project examples and their required structured counts.
- `schema-validation.txt` records the Project schema and reference validation result.
- `project-reference-validation.txt` records links to canonical Product content.
- `terminology-check.txt` records the informational and non-operational boundary.
- `generation-determinism.txt` records deterministic generated-module evidence.

Page implementation, browser screenshots, and route smoke are out of scope for this content-only requirement.
