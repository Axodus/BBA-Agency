# BBA Publisher Reference Demo

A small, honest reference implementation of the BBA Agency governed publishing concept.

## What it demonstrates

```text
Governed knowledge
→ Mission
→ policy retrieval
→ AI-assisted production
→ core Institutional Asset
→ core human approval
→ channel selection
→ channel-specific adaptation
→ independent variant review
→ Distribution Package
→ audit record
```

The browser executes these operations locally:

- loads a synthetic source document;
- retrieves relevant policies using deterministic keyword scoring;
- creates and transitions a structured Mission;
- renders a pre-generated editorial reference package;
- records structured review findings;
- requires explicit human approval or rejection of the core asset;
- presents local Channel Profiles for X, Medium, DEV Community, Forum / Community, and Telegram;
- derives deterministic variants with preserved `missionId` and `parentAssetId`;
- reviews each variant against its illustrative channel constraints;
- records independent variant decisions and derives a Distribution Package;
- exports the complete multichannel audit record as JSON.

## Important disclosure

GPT-5.6 was used during the reference build to generate and validate the sample editorial assets. The browser demo replays a deterministic reference package while executing policy retrieval, workflow transitions, human approval, and audit logging locally.

This is **not** the BBA Publishing Platform MVP and is not production-ready. It does not perform external publishing, authentication, multi-tenancy, autonomous multi-agent execution, or live connector calls.

The reference demo prepares channel-specific publication variants but does not connect to or publish on external platforms. Channel constraints are illustrative configuration data and may not reflect current platform limits.

## Run locally

Because the demo loads JSON files with `fetch`, use a local static server instead of opening `index.html` directly.

### Python

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

The **Run governed workflow** button remains disabled while the four local JSON files are loading. It becomes enabled only after the files have been parsed and validated. The browser executes the core workflow through 88% progress, waits for core asset approval, then enables channel selection and deterministic variant generation. The export action becomes available only after at least one variant has been independently decided and the Distribution Package is complete.

### Node

```bash
npx serve .
```

## Demo script

1. Click **Run governed workflow**.
2. Observe the source, selected policies, Mission, and AI Workforce.
3. Review the generated core Institutional Asset and claims-review warning.
4. Enter an optional core decision note and click **Approve**.
5. Inspect the Channel Profiles, then keep or change the suggested X, Medium, DEV Community, and Telegram selection.
6. Click **Generate channel variants** and review each card, including its character count, profile guidance, and findings.
7. Approve or reject variants independently, or use **Approve all eligible variants**.
8. Confirm the Distribution Package status and export the JSON audit record.

## Troubleshooting

- If the page stays on `Loading demo data…`, confirm that the server was started from this directory and that the browser URL is `http://localhost:8080/`.
- If a data file is missing or returns invalid JSON, the page keeps the run button disabled and reports the resource and parsing/fetch error in the visible status message. This includes `data/channels.json`. The browser console contains the stack trace.
- If the browser console reports a module or MIME-type error, use `python -m http.server 8080` (or another static server) instead of opening `index.html` with `file://`.
- Variants cannot be generated until the core asset is approved. A variant with a blocking finding cannot be approved because this reference demo does not implement an override path.
- A rejected variant is excluded from `approvedVariants`; an approved package uses the explicit state `approved_for_distribution` and never `published`.
- After a completed, partial, or rejected distribution outcome, use **Reset** to clear the Mission, channels, variants, decisions, package, and audit timeline before running another cycle. No page reload is required.

## Validation commands

The demo has no build step or external runtime dependency. These commands validate the JavaScript syntax and data files from the repository root:

```bash
node --check src/app.js
node --check src/retrieval.js
node --check src/workflow.js
node --check src/audit.js
node --check src/channels.js
node --check src/adaptation.js
node --check src/review.js
node --check src/distribution.js
python -m json.tool data/sample-source.json >/dev/null
python -m json.tool data/policies.json >/dev/null
python -m json.tool data/reference-output.json >/dev/null
python -m json.tool data/channels.json >/dev/null
```

For a smoke test of static serving:

```bash
python -m http.server 8080
```

Then verify that `index.html`, all modules under `src/`, and all four files under `data/` return HTTP 200. The page must be served over HTTP so ES modules and `fetch` work consistently in Chromium, Firefox, and Edge.

## Project structure

```text
bba-publisher-reference-demo/
    ├── index.html
    ├── package.json
    ├── styles.css
├── src/
│   ├── app.js
│   ├── retrieval.js
│   ├── workflow.js
│   ├── audit.js
│   ├── channels.js
│   ├── adaptation.js
│   ├── review.js
│   └── distribution.js
├── data/
│   ├── channels.json
│   ├── policies.json
│   ├── sample-source.json
│   └── reference-output.json
└── docs/
    └── concept-mapping.md
```

## Suggested Devpost positioning

> During Build Week, we transformed the governed product and domain documentation of BBA Agency into an executable reference workflow. The demo shows how institutional knowledge can guide AI-assisted asset production, specialist review, human authorization, and auditable state transitions.

## License

MIT. See `LICENSE`.
