# REQ-IMP-016-FE-002 — English Default Language Report

Status: `PASS`

```yaml
canonical_language: English
default_locale: en-US
fallback_locale: en-US
frontend_localization_ready: true
backend_messages_language: English
logs_language: English
deliverable_language: customer-configurable
```

## Correction

The active BBA Agency Experience, Publisher Product, Agency Runtime, SDK,
fixtures, exports, audit events, public errors, shared browser primitives, and
acceptance tests now use English as their canonical source language.

`applicationLocale` and `contentLanguage` are deliberately distinct. The
application always falls back to `en-US`; a customer may request deliverables
in another language without changing application navigation, statuses,
validation, errors, or technical records.

The automated `agency:check-language` gate covers the active product stack.
Legacy experiments, deterministic reference implementations, customer-provided
content fixtures, and historical documents are excluded by explicit scope.

## Validation

- agency language gate: PASS;
- Publisher Product: typecheck, 6/6 tests, lint, and format PASS;
- Agency Runtime HTTP: typecheck, 6/6 tests, lint, and format PASS;
- Agency SDK and BBA web typecheck: PASS;
- BBA web unit/component tests: 14/14 PASS;
- browser boundary, lint, and format: PASS;
- production build and bundle baseline: PASS (119,776 bytes gzip JavaScript;
  6,684 bytes gzip CSS);
- Playwright: 6/6 PASS across desktop and mobile golden, revision, and
  recoverable-failure journeys;
- OpenAPI contract inventory: PASS (74 operations, 57 Commands, 17 Queries);
- Core regression: 33/33 PASS with lint, format, and architecture gates;
- regenerated English screenshots and golden-path video: PASS;
- visual inspection of English Home and Delivery: PASS.

The executable gates ran against an ext4 verification mirror containing the
same authoritative source tree because the mounted `/mnt/d` pnpm store cannot
open its SQLite index and attempts a slow full relink. No implementation file
was sourced from the mirror.
