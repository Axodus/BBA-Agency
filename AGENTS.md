# BBA Agency Agent Instructions

This file defines operating instructions for Codex and other coding agents working in the Axodus/BBA-Agency repository.

The repository contains both legacy experiments and the current BBA Publisher Reference Demo. Preserve this distinction and never present experimental code as a completed platform.

## Product definition

BBA Agency is not a conventional marketing agency application. It is an AI-first platform concept for orchestrating:

- institutional knowledge;
- Missions;
- AI Workforce execution;
- human governance;
- Institutional Assets;
- publishing preparation;
- channel-specific adaptation;
- Distribution Packages;
- auditability.

The commercial name is **BBA Agency**. The internal platform concept may be referred to as **BBA Platform**.

## Ubiquitous language

Use these terms consistently:

- **Mission:** the central unit of work.
- **AI Workforce:** specialized AI roles that execute work.
- **Human Governance:** authorized human decisions and direction.
- **Steward:** a human role with responsibility or authority.
- **Institutional Asset:** a governed canonical output.
- **Channel Variant:** an adaptation derived from an approved Institutional Asset.
- **Distribution Package:** the structured collection of channel variants and decisions.
- **Connector:** an integration boundary with an external system.
- **Audit Record:** chronological evidence of execution and decisions.

Do not casually replace these terms with campaign, document, operator, or post when the domain meaning is broader.

## Repository boundaries

### `demo/`

This is the executable reference implementation created for the hackathon. It is static, deterministic, browser-based, locally executed, intentionally limited, and suitable for demonstration.

It is not production-ready, connected to external publishing APIs, a live autonomous multi-agent system, a multi-tenant application, or evidence that the full BBA Platform is complete.

### `src/`

This area contains earlier platform and campaign-oriented experiments. Before modifying it:

- inspect the current code and documentation;
- identify whether the requested work belongs to the current BBA domain;
- do not assume legacy campaign terminology represents the target architecture;
- avoid coupling the demo to legacy infrastructure without an explicit requirement.

### `docs/`

Documentation must separate domain concerns (what the platform is) from implementation concerns (how it is built). Do not mix aspirational product claims with verified implementation status.

## Core operating principles

1. AI executes; humans govern.
2. Every meaningful execution belongs to a Mission.
3. An Institutional Asset is canonical; Channel Variants derive from it.
4. Human approval of the core asset does not automatically approve variants.
5. State transitions must be explicit and protected.
6. All important decisions must be auditable.
7. External publication must not be claimed unless a real Connector executed successfully.
8. Errors must be visible; do not fail silently.
9. Deterministic demo behavior must be described honestly.
10. Avoid adding infrastructure that is unnecessary for the requested scope.

## Current demo workflow

The expected reference flow is:

```text
loading
→ ready
→ running
→ awaiting_asset_decision
→ asset_approved
→ configuring_distribution
→ generating_variants
→ awaiting_variant_decisions
→ distribution_ready
→ completed
```

Alternative outcomes may include `asset_rejected`, `partially_approved`, `rejected`, and `failed`.

Agents may refine names only when preserving behavior and compatibility.

## Demo invariants

Do not break these rules:

- The run action remains disabled until all required local data files load and validate.
- Variants cannot be generated before approval of the core Institutional Asset.
- Every variant preserves `missionId` and `parentAssetId`.
- Variant decisions are independent and single-use.
- Blocking findings prevent approval unless an explicit, audited override is implemented.
- Export is available only after required decisions exist.
- Reset clears the complete in-memory workflow without requiring a page reload.
- The Audit Timeline remains chronological.
- The maximum distribution state is `approved_for_distribution`, never `published`.
- No API key is exposed in browser code.
- No external publishing call occurs in the reference demo.

## Channel adaptation rules

Channel behavior must be driven by configuration, preferably [`demo/data/channels.json`](demo/data/channels.json). Avoid hardcoding platform-specific policy throughout UI modules.

Each Channel Profile should define relevant properties such as:

- audience;
- tone;
- title support;
- Markdown support;
- recommended or illustrative length;
- tags or hashtags;
- disclosure requirements;
- call-to-action guidance.

Channel constraints in the demo are illustrative. Do not describe them as guaranteed current platform rules.

## Module responsibilities

Keep modules cohesive:

- `app.js`: UI orchestration and event binding;
- `workflow.js`: Mission states and guarded transitions;
- `retrieval.js`: deterministic policy retrieval;
- `audit.js`: audit events and chronology;
- `channels.js`: channel catalog loading and validation;
- `adaptation.js`: deterministic variant creation;
- `review.js`: structured findings and eligibility checks;
- `distribution.js`: Distribution Package and aggregate status.

Do not place all business logic into `app.js`.

## Coding requirements

- Use native ES modules in the demo.
- Prefer plain JavaScript, HTML, and CSS unless the scope explicitly changes.
- Preserve accessibility and keyboard operation.
- Use native controls with visible labels.
- Use persistent UI messages for load, parsing, and execution failures.
- Validate externalized JSON defensively.
- Keep IDs unique and lineage explicit.
- Use ISO 8601 timestamps.
- Avoid hidden global state.
- Avoid silent catch blocks.
- Do not introduce dependencies without a clear benefit.
- Do not add authentication, databases, queues, cloud services, or external Connectors to the demo without explicit approval.

## Verification

For changes under `demo/`, run at minimum from the repository root:

```bash
node --check demo/src/app.js
node --check demo/src/retrieval.js
node --check demo/src/workflow.js
node --check demo/src/audit.js
node --check demo/src/channels.js
node --check demo/src/adaptation.js
node --check demo/src/review.js
node --check demo/src/distribution.js

python -m json.tool demo/data/sample-source.json >/dev/null
python -m json.tool demo/data/policies.json >/dev/null
python -m json.tool demo/data/reference-output.json >/dev/null
python -m json.tool demo/data/channels.json >/dev/null
```

Also run a static HTTP smoke test and verify:

- early clicks remain blocked;
- core approval and rejection;
- complete multichannel approval;
- partial approval;
- reset and second execution;
- valid JSON export;
- missing or malformed data handling;
- no unexpected browser console errors.

When browser automation is unavailable, state this limitation explicitly. Do not claim cross-browser visual validation without evidence.

## Documentation requirements

When changing behavior:

- update [`demo/README.md`](demo/README.md);
- update `demo/docs/concept-mapping.md` when domain mappings change;
- update [`README.md`](README.md) when the repository entry point or product positioning changes;
- add an ADR when a durable architectural decision is introduced.

Documentation must state what works, what is deterministic, what is simulated, what is not implemented, what was validated, and what remains a limitation.

## Commit and pull request guidance

Prefer focused commits with prefixes such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, and `chore:`.

Pull request descriptions should include:

- problem;
- approach;
- files changed;
- state-model impact;
- validation performed;
- limitations;
- screenshots or demo steps when UI changes.

## Prohibited claims

Do not claim that BBA:

- autonomously publishes;
- is production-ready;
- supports real multi-tenancy;
- has active external Connectors;
- runs multiple live autonomous agents;
- guarantees current third-party platform constraints;
- has completed the full publishing platform.

Use precise language such as **reference implementation**, **deterministic demo**, **AI-assisted**, **approved for distribution**, **Connector not configured**, and **illustrative Channel Profile**.

## Decision rule

When uncertain, preserve domain integrity, traceability, human authority, and honest representation over feature breadth or visual spectacle.
