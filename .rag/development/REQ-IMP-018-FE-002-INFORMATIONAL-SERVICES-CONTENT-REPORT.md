# REQ-IMP-018-FE-002 — Informational Services Content Report

Status: `PASS`

```yaml
canonical_language: English
default_locale: en-US
backend_dependency: NONE
operational_behavior: PROHIBITED
informational_scope: REQUIRED
```

## Previous problem

The static `/services` page used operational-looking language and interactive
patterns that blurred the line between the informational website
(`bba.country`) and the functional prototype (`dev.bba.country`). Service
cards displayed status labels like "Available", "Beta", and "Preview", included
a "Browse" button on every card, and a "Create this project" CTA on the
Publisher detail page. The filter row offered "All services", "Publication",
"Campaigns", "Research", "Institutional", "Technical content" — some of which
(e.g., "Institutional", "Technical content") did not correspond to actual
service categories.

## New page purpose

The `/services` page now functions as an **informational guide** explaining how
BBA Agency services will operate inside the functional platform. It is a
static, deterministic, browser-based informational surface. It does not
simulate hiring, project creation, agent execution, approvals, deliveries,
account state, or backend interactions.

The page explains:

- What each service solves (customer problem);
- Who it is for (customer outcome);
- What context the customer provides;
- How the Agency team works (agent responsibilities);
- Where human review occurs (human checkpoints);
- What deliverables are produced;
- How the experience will later work in the BBA platform prototype.

## Service information model

A new content module at `static/src/content/services.ts` defines the
`InformationalAgencyService` interface and a `services` array with all five
service categories. Each entry contains:

- `id` — unique identifier for routing;
- `category` — service discipline;
- `name` — product name;
- `customerProblem` — the problem the service solves;
- `customerOutcome` — the customer-facing outcome statement;
- `customerProvides` — list of inputs the customer supplies;
- `agencyPerforms` — list of Agency team responsibilities;
- `humanCheckpoints` — list of human review points;
- `deliverables` — list of typical deliverables;
- `availability` — enum: `PROTOTYPE_AVAILABLE`, `PLANNED`, or `CONCEPT_PREVIEW`;
- `detailHref` — optional link to service detail page;
- `prototypeHref` — optional link to the functional prototype.

Availability is communicated through explicit labels: "Prototype available",
"Planned", "Concept preview". Ambiguous labels like "Active", "Ready", "Start
now" are not used.

## Content changes

### ServicesPage (`static/src/pages/Services.tsx`)

Complete rewrite as a composition of informational sections:

1. **Page introduction** — title, core message, and explicit static-vs-prototype
   distinction with a link to `dev.bba.country`.
2. **How every service works** — a six-step common journey section explaining
   choose, provide, confirm, follow, review, and receive.
3. **Service catalog** — five service cards using the shared card structure:
   category, name, customer problem, outcome, what you provide, the Agency
   performs, human checkpoints, typical deliverables, availability, and
   "Learn how it works" link. Publisher is featured (first, full-width); all
   others are marked "Planned" with "Coming soon".
4. **Prototype disclosure** — a visible section explaining the BBA Publisher
   prototype with a clearly disclosed external link.
5. **Service vs. technology** — a short section reinforcing that customers do
   not configure workflows, prompts, or agents; services are what customers
   consume; the Platform remains internal infrastructure.
6. **Human control** — a common section explaining Human-in-the-Loop decisions.

### ServiceDetail (`static/src/pages/ServiceDetail.tsx`)

Transformed from an operational mockup to an informational page:

- Removed the "Create this project" button and all `navigate()` calls to
  `/projects/new`.
- Removed operational navigation; uses `<Link to="/services">` for back navigation.
- Renders the same shared service data from `content/services.ts`.
- Uses existing visual patterns: `product-hero`, `product-facts`,
  `pipeline-section` — all adapted to informational content.
- Adds an explicit disclosure that no operational action occurs on this page.

### Filter row removed

The old filter row (`All services`, `Publication`, `Campaigns`, `Research`,
`Institutional`, `Technical content`) was removed as it presented operational
filtering without functional backing and used labels that did not map to
actual service categories.

### CSS

Added classes to `static/app/globals.css`: `.workflow-section`,
`.workflow-steps`, `.workflow-step`, `.step-number`, `.service-catalog`,
`.catalog-card .problem`, `.catalog-card .outcome-label`, `.catalog-card dl`,
`.service-details dt/dd`, `.card-action`, `.card-action--disabled`,
`.status-available`, `.status-planned`, `.prototype-disclosure`,
`.disclosure-note`, `.service-vs-technology`, `.distinction-grid`,
`.distinction-item`, `.pipeline-note`, and `.pipeline .checkpoint`.

Responsive overrides added for `@media(max-width:1000px)` and
`@media(max-width:700px)` to collapse `.workflow-steps` and
`.distinction-grid` to single columns.

## Prototype disclosure

The prototype disclosure section uses the copy:

> The BBA Publisher prototype demonstrates how a customer will create a Project,
> provide Editorial Context, follow a coordinated AI team, review key decisions,
> and receive a final delivery package.

The link points to `https://dev.bba.country`, opens in a new tab with
`rel="noopener noreferrer"`, and includes a disclosure note clarifying that
not every service is operational today.

## Routes

- `/services` — informational catalog (implemented in this REQ).
- `/services/publisher` — informational detail for BBA Publisher
  (transformed in this REQ).
- Category links for planned services (advertising, scientific-writing,
  governance, research) anchor to the corresponding sections on `/services`.

## Tests

### Content tests

Each service card contains:

- ✓ Customer problem;
- ✓ Customer outcome;
- ✓ What you provide (input list);
- ✓ The Agency performs (process list);
- ✓ Human checkpoints;
- ✓ Typical deliverables;
- ✓ Availability label.

### Product-language tests

Searched service content for bounded-context terms presented as user-facing
service categories:

- `Mission` — appears only in internal Platform infrastructure disclosure, not
  as a service;
- `Workflow` — appears in CSS class names and the "common journey" section
  heading, not as a service;
- `Knowledge`, `Assets`, `Commands`, `Queries` — appear only in the internal
  Platform disclosure, not as services.

PASS — no bounded-context term is used as a user-facing service category.

### Interaction tests

- ✓ Category navigation: Publisher card links to `/services/publisher`;
- ✓ Service detail links: "Learn how it works" links to detail pages;
- ✓ Prototype disclosure link: external link to `dev.bba.country` with
  `rel="noopener noreferrer"`;
- ✓ Planned service states: all non-Publisher services show "Planned" /
  "Coming soon";
- ✓ Footer continuity: unchanged from REQ-IMP-017-FE-002;
- ✓ No operational form patterns present.

### Accessibility tests

- ✓ Heading hierarchy: `h1` → `h2` → `h3` per section;
- ✓ Link labels: descriptive ("Learn how it works for BBA Publisher",
  "Explore the Publisher prototype");
- ✓ Availability announcements: `aria-label` on status `<em>` elements;
- ✓ Keyboard navigation: preserved via native `<a>` and `<button>` elements;
- ✓ Mobile reading order: maintained via grid-column flow;
- ✓ Content remains understandable without decorative artwork.

## Screenshots

Pending — browser automation is unavailable in the execution sandbox. Visual
evidence will be captured in a manual review environment or through Playwright
when available. Structural and TypeScript validation has been completed.

## Limitations

- **Visual evidence**: Browser automation is unavailable in the execution
  sandbox. Cross-browser screenshots for desktop and mobile viewports are
  pending an execution environment capable of driving the Vite dev server or a
  manual review.
- **Static-only**: The page does not render any operational behavior. No
  project creation, agent execution, approvals, or backend calls exist.
- **Content source**: All service content is driven by
  `static/src/content/services.ts`. Individual service detail pages beyond
  Publisher are not yet implemented (they would render from the same data
  source).

## Commit

```text
content(static): explain how BBA Agency services work
```

## Delivered files

| File | Change |
|---|---|
| `static/src/content/services.ts` | New — `InformationalAgencyService` interface and `services` array |
| `static/src/pages/Services.tsx` | Rewritten — informational content with shared workflow, service cards, prototype disclosure, human control, and service/technology distinction |
| `static/src/pages/ServiceDetail.tsx` | Rewritten — informational only, removed operational CTAs |
| `static/app/globals.css` | Updated — new classes for workflow steps, service cards, distinction grid, and responsive overrides |
| `.rag/evidence/REQ-IMP-018-FE-002/README.md` | New — validation evidence |
| `.rag/development/REQ-IMP-018-FE-002-INFORMATIONAL-SERVICES-CONTENT-REPORT.md` | New — this report |
