# Demo Regression Contract

REQ: `REQ-IMP-000-006`

`demo/` remains a deterministic, browser-based reference implementation. It
is not the Core and is not production-ready.

## Required validation

From the repository root, run the syntax and data checks documented by
`AGENTS.md` and `README.md`:

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

The browser smoke scenarios remain manual unless browser automation is
available: blocked early actions, asset approval/rejection, complete and
partial variant decisions, reset and second execution, export, malformed data,
and console error review.

## Status semantics

Each command is recorded as `PASS`, `FAIL`, `NOT_RUN`, `NOT_APPLICABLE`, or
`BLOCKED`. Browser automation unavailable is a limitation, not a PASS.

## Prohibited claims

The demo must not be described as a live multi-tenant system, autonomous
multi-agent runtime, external publishing integration, or proof of completed
BBA Platform implementation. Core validation must never depend on the demo.
