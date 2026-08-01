# REQ-IMP-018-FE-003 — Product Detail Pages Report

Status: `PASS`

```yaml
canonical_language: English
default_locale: en-US
backend_dependency: NONE
operational_behavior: PROHIBITED
content_source: static/content/products/
build_time_generation: ENABLED
```

## Objective achieved

The static Vite application now renders five reusable informational product
detail pages from the canonical Markdown and YAML sources in
`static/content/products/`, and `/services` now works as the main discovery
surface for those pages.

Implemented routes:

- `/services`
- `/services/publisher`
- `/services/advertising`
- `/services/scientific-writing`
- `/services/governance`
- `/services/research`
- `/services/:unknown` -> existing accessible unavailable state

The static site remains informational. No Project creation, agent execution,
approval actions, backend calls, persistence, or runtime progress was added.

## Canonical content sources consumed

- `static/content/products/schema.yml`
- `static/content/products/bba-publisher.md`
- `static/content/products/advertising-campaign.md`
- `static/content/products/scientific-article.md`
- `static/content/products/governance-proposal.md`
- `static/content/products/market-research.md`
- `static/src/content/services.ts` for compact catalog ordering and summaries

## Parser and generation strategy

The implementation uses a deterministic build-time pipeline:

1. `static/tools/product-content-lib.mjs` reads product Markdown sources.
2. YAML frontmatter is parsed with a purpose-built restricted parser aligned to
   the existing schema shape.
3. Markdown body sections are parsed into typed blocks:
   paragraphs, lists, blockquotes, simple tables, inline emphasis, code spans,
   and links.
4. Required sections are mapped into a typed `AgencyProductContent` model.
5. `static/tools/check-product-content.mjs` validates the canonical sources and
   writes `static/src/content/products/generated/product-content.generated.ts`.
6. React imports the generated typed module; the browser does not fetch or
   parse raw Markdown at runtime.

Unsupported constructs such as code fences, raw HTML, and deep heading levels
fail validation instead of being rendered unsafely.

## Schema validation

Validation now covers:

- presence of all five expected product files;
- YAML frontmatter delimiters and parseability;
- supported `schemaVersion`;
- required frontmatter fields;
- unique product IDs and routes;
- valid availability codes;
- `status`/`availability.code` consistency;
- required Markdown sections;
- FAQ minimum;
- workflow order and checkpoint presence;
- deliverable and agent-team shapes;
- Publisher prototype metadata;
- planned-product operational CTA rejection;
- unresolved placeholders;
- navigation and related-product reference integrity.

Invalid canonical content now fails `pnpm --dir static check:product-content`
and blocks the build.

## Reusable components and routes

Created:

- `static/src/content/products/product-content.types.ts`
- `static/src/content/products/index.ts`
- `static/src/content/products/generated/product-content.generated.ts`
- `static/src/components/products/ProductContentBlocks.tsx`
- `static/src/components/products/ProductDetailPage.tsx`
- `static/src/pages/ProductDetail.tsx`
- `static/tools/generate-product-content.mjs`
- `static/tools/product-content-lib.mjs`

Updated:

- `static/src/App.tsx` to use `/services/:serviceSlug`
- `static/src/pages/Services.tsx`
- `static/src/content/services.ts`
- `static/app/globals.css`
- `static/tools/check-product-content.mjs`
- `static/package.json`

Removed:

- `static/src/pages/ServiceDetail.tsx` (previous hardcoded Publisher-only page)

## Services page layout changes

`/services` preserves the FE-002 informational content while refining the
catalog into a clearer product-discovery surface:

- hero actions now remain informational only;
- the common six-step Agency journey remains visible;
- the catalog distinguishes category from product name;
- cards are less dense and emphasize headline, outcome, deliverables, review,
  availability, and informational detail links;
- all five products now link to their detail pages;
- prototype disclosure remains explicit and external;
- a related informational CTA closes the page without introducing operational
  actions.

## Product detail template behavior

All five product pages share one reusable `ProductDetailPage` template that
renders from content rather than duplicated page-specific JSX.

The template includes:

- hero with category, name, headline, summary, availability, and informational action;
- overview facts;
- problem and outcome distinction;
- audience list;
- customer inputs section;
- structured workflow timeline from frontmatter metadata;
- agent team section from frontmatter metadata;
- human review section with visible checkpoints;
- deliverables grid with package relationship;
- illustrative example;
- quality and traceability;
- mandatory limitations section;
- availability and platform relationship;
- editorial FAQ;
- related products and previous/next navigation.

## Content not changed

Canonical product narratives were not rewritten in JSX. Long-form detail copy
continues to live in `static/content/products/*.md`. The React layer contains
labels, layout text, and explanatory UI language only.

## Accessibility and responsive results

Static validation completed:

- one `<h1>` per page;
- semantic `<main>` per route;
- logical heading hierarchy;
- descriptive internal links;
- external links use `target="_blank"` and `rel="noopener noreferrer"`;
- availability is shown with explicit text, not color only;
- FAQ content remains readable without interactive disclosure controls;
- mobile layouts collapse to single columns without horizontal overflow rules
  being intentionally bypassed.

Responsive CSS was added for the services hero, detail hero, workflow cards,
agent roles, deliverables, related products, and product navigation at the
existing 1000px and 700px breakpoints.

## Validation results

- `pnpm --dir static check:product-content` -> PASS
- `pnpm --dir static typecheck` -> PASS
- `pnpm --dir static lint` -> PASS
- `pnpm --dir static format:check` -> PASS
- `pnpm --dir static build` -> PASS
- `node tools/check-agency-language.mjs` -> PASS
- `node tools/check-frontend-boundaries.mjs` -> PASS
- `git diff --check` on touched implementation paths -> PASS

## Visual evidence

Blocked in this execution environment. No Playwright or equivalent browser
automation is configured for the static app, and no screenshot capture was
available in the sandbox. The evidence manifest records this explicitly rather
than claiming unsupported completion.

## Known limitations

- Route-specific server-rendered SEO metadata is still not available in the SPA;
  per-product SEO fields remain in the typed content model for future use.
- Browser screenshots, route-smoke captures, and accessibility screenshots are
  blocked by the current environment.
- The static package `lint` and `format:check` script paths were corrected in
  this REQ so the repository-native commands succeed from this checkout.

## Commit reference

```text
feat(static): generate informational product detail pages
```
