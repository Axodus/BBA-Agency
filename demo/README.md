# BBA Publisher Reference Demo

A small, honest reference implementation of the BBA Agency governed publishing concept.

## What it demonstrates

```text
Governed knowledge
→ Mission
→ policy retrieval
→ AI-assisted production
→ specialist review
→ human decision
→ Institutional Asset
→ audit record
```

The browser executes these operations locally:

- loads a synthetic source document;
- retrieves relevant policies using deterministic keyword scoring;
- creates and transitions a structured Mission;
- renders a pre-generated editorial reference package;
- records structured review findings;
- requires explicit human approval or rejection;
- exports an audit record as JSON.

## Important disclosure

GPT-5.6 was used during the reference build to generate and validate the sample editorial assets. The browser demo replays a deterministic reference package while executing policy retrieval, workflow transitions, human approval, and audit logging locally.

This is **not** the BBA Publishing Platform MVP and is not production-ready. It does not perform external publishing, authentication, multi-tenancy, autonomous multi-agent execution, or live connector calls.

## Run locally

Because the demo loads JSON files with `fetch`, use a local static server instead of opening `index.html` directly.

### Python

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

The **Run governed workflow** button remains disabled while the three local JSON files are loading. It becomes enabled only after the files have been parsed and validated. The browser then executes the deterministic workflow through 88% progress, waits for **Approve** or **Reject**, records the human decision, and enables **Export audit JSON**.

### Node

```bash
npx serve .
```

## Demo script

1. Click **Run governed workflow**.
2. Observe the source and selected policies.
3. Show the Mission state and reference AI Workforce.
4. Review the generated Institutional Asset.
5. Highlight the claims-review warning.
6. Enter an optional decision note.
7. Click **Approve** or **Reject**.
8. Export the audit JSON.

## Troubleshooting

- If the page stays on `Loading demo data…`, confirm that the server was started from this directory and that the browser URL is `http://localhost:8080/`.
- If a data file is missing or returns invalid JSON, the page keeps the run button disabled and reports the resource and parsing/fetch error in the visible status message. The browser console contains the stack trace.
- If the browser console reports a module or MIME-type error, use `python -m http.server 8080` (or another static server) instead of opening `index.html` with `file://`.
- After an approval or rejection, use **Reset** to clear the Mission, panels, decision, and audit timeline before running another cycle. No page reload is required.

## Validation commands

The demo has no build step or external runtime dependency. These commands validate the JavaScript syntax and data files from the repository root:

```bash
node --check src/app.js
node --check src/retrieval.js
node --check src/workflow.js
node --check src/audit.js
python -m json.tool data/sample-source.json >/dev/null
python -m json.tool data/policies.json >/dev/null
python -m json.tool data/reference-output.json >/dev/null
```

For a smoke test of static serving:

```bash
python -m http.server 8080
```

Then verify that `index.html`, `src/app.js`, and all three files under `data/` return HTTP 200. The page must be served over HTTP so ES modules and `fetch` work consistently in Chromium, Firefox, and Edge.

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
│   └── audit.js
├── data/
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
