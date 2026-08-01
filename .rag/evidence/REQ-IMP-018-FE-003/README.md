# REQ-IMP-018-FE-003 — Evidence

## Content validation and generation

```text
pnpm --dir static check:product-content
Product content validation passed: 5 files, schemaVersion 1.0.
EXIT: 0
```

The validation pass also regenerated:

- `static/src/content/products/generated/product-content.generated.ts`

## TypeScript validation

```text
pnpm --dir static typecheck
tsc --noEmit
EXIT: 0
```

## Lint and format

```text
pnpm --dir static lint
node ../tools/workspace-quality-check.mjs --lint src
Lint check passed.
EXIT: 0

pnpm --dir static format:check
node ../tools/workspace-quality-check.mjs --format src
Format check passed.
EXIT: 0
```

## Build validation

```text
pnpm --dir static build
pnpm check:product-content
node tools/check-product-content.mjs
Product content validation passed: 5 files, schemaVersion 1.0.
tsc --noEmit && vite build
vite v8.1.5 building client environment for production...
transforming... 41 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.64 kB | gzip:   0.57 kB
dist/assets/index-DDl5RYa1.css   37.90 kB | gzip:   7.87 kB
dist/assets/index-DSOqa0LZ.js   351.87 kB | gzip: 101.06 kB | map: 1,503.44 kB
EXIT: 0
```

## Language check

```text
node tools/check-agency-language.mjs
Agency language check passed: canonical English, default locale en-US, fallback locale en-US.
EXIT: 0
```

## Frontend boundary check

```text
node tools/check-frontend-boundaries.mjs
Frontend package graph check passed.
EXIT: 0
```

## Diff hygiene

```text
git diff --check -- static/app/globals.css static/package.json static/src/App.tsx static/src/content/services.ts static/src/pages/Services.tsx static/tools/check-product-content.mjs static/src/pages/ProductDetail.tsx static/src/components/products/ProductContentBlocks.tsx static/src/components/products/ProductDetailPage.tsx static/src/content/products/index.ts static/src/content/products/product-content.types.ts static/src/content/products/generated/product-content.generated.ts static/tools/generate-product-content.mjs static/tools/product-content-lib.mjs
EXIT: 0
```

## Route and browser evidence

Automated browser coverage is blocked in this environment:

- no Playwright or other browser-test harness is configured under `static/`;
- no route-smoke browser runner is available in the repository-native static app;
- no screenshots were captured from the sandbox.

As required by the REQ, visual evidence is reported as blocked rather than
claimed complete.

## Expected evidence directories

- `content-validation/` — blocked for screenshot capture; command evidence is recorded in this README
- `desktop/` — blocked
- `laptop/` — blocked
- `tablet/` — blocked
- `mobile/` — blocked
- `route-smoke/` — blocked
- `accessibility/` — blocked
