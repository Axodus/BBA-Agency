# BBA Agency

**One Mission. One governed Institutional Asset. Multiple channel-specific variants. Every decision auditable.**

BBA Agency is an AI-first platform concept for governed institutional publishing.

The platform is designed to transform institutional knowledge into reviewed, reusable, channel-aware publication assets while keeping human authority, provenance, and auditability explicit.

This repository contains the current BBA Publisher Reference Demo alongside earlier platform and campaign-oriented experiments. The demo is the recommended entry point for reviewers and contributors who want to understand the current product thesis.

## Why BBA Agency?

Institutional publishing is not only a content-generation problem. It requires a governed path from source knowledge to an approved canonical asset and then to channel-specific adaptations. BBA Agency models that path explicitly:

```text
Governed knowledge
→ Mission
→ policy retrieval
→ AI-assisted production
→ core Institutional Asset
→ human approval
→ channel selection
→ channel-specific adaptation
→ independent variant review
→ Distribution Package
→ audit record
```

The design principle is simple: **AI executes; humans govern.**

## Reference demo

The hackathon reference implementation is a bounded, deterministic, browser-based workflow. It runs locally and demonstrates:

- governed source knowledge and deterministic policy retrieval;
- a structured Mission with explicit state transitions;
- an AI Workforce representation for specialized roles;
- a canonical Institutional Asset with human approval or rejection;
- illustrative Channel Profiles for X, Medium, DEV Community, Forum / Community, and Telegram;
- deterministic channel-specific adaptation with preserved lineage;
- independent review and decision-making for each Channel Variant;
- a Distribution Package with aggregate status;
- a chronological Audit Timeline and complete JSON export.

The demo does not connect to or publish on external platforms. Its channel constraints are illustrative configuration data, not guarantees about current third-party platform rules.

## Product model

The current BBA domain is organized around five concepts:

| Concept | Meaning |
| --- | --- |
| **Mission** | The central unit of work. It carries the objective, source knowledge, policies, execution state, decisions, and resulting assets. |
| **AI Workforce** | Specialized AI roles for research, policy retrieval, planning, composition, review, and distribution preparation. |
| **Human Governance** | Authorized humans define objectives, approve or reject outputs, change direction, and retain decision authority. |
| **Institutional Asset** | The canonical governed output of a Mission, such as an article, technical note, paper, newsletter, release, campaign, documentation, or educational material. |
| **Distribution Package** | A structured set of channel-specific variants derived from an approved Institutional Asset, with independent review decisions and full lineage. |

## Run the demo

The demo loads JSON files and native ES modules over HTTP. Do not open `demo/index.html` directly with `file://`.

```bash
cd demo
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

### Demo walkthrough

1. Click **Run governed workflow**.
2. Review the source, retrieved policies, Mission, and AI Workforce representation.
3. Review and approve or reject the core Institutional Asset.
4. Select distribution channels.
5. Generate channel-specific variants.
6. Review and decide each variant independently.
7. Inspect the Distribution Package and Audit Timeline.
8. Export the complete structured JSON record.

For detailed operating notes and troubleshooting, see [`demo/README.md`](demo/README.md).

## Validate the demo

From the repository root:

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

Then run the static server and complete these smoke scenarios:

- core asset approval;
- core asset rejection;
- complete multichannel approval;
- partial channel approval;
- reset and second execution;
- audit JSON export;
- missing or invalid data-file failure.

The demo has no build step and no external runtime dependency. When browser automation is unavailable, validation should be reported as static or manual rather than as cross-browser visual validation.

## Repository structure

```text
BBA-Agency/
├── README.md
├── AGENTS.md
├── apps/
│   └── bba-web/
├── packages/
│   ├── ui/
│   ├── app-shell/
│   └── sdk-react/
├── clients/
├── core/
├── transport/
├── demo/
│   ├── index.html
│   ├── styles.css
│   ├── package.json
│   ├── data/
│   ├── docs/
│   └── src/
├── .rag/
│   ├── development/
│   ├── architecture/
│   ├── adr/
│   └── plans/
├── src/
├── package.json
└── tsconfig.json
```

The contents under `src/` include earlier platform and campaign-oriented experiments. They are not the same thing as the current reference demo and must not be presented as a completed BBA Platform implementation.

## Development principles

- AI first, human governed.
- Mission driven execution.
- Institutional Assets as governed outputs.
- Dynamic workflow with explicit state transitions.
- Traceability before automation.
- Channel adaptation instead of blind duplication.
- No production-readiness claims without evidence.
- Domain concepts remain separate from implementation details.

Contributor and coding-agent instructions are defined in [`AGENTS.md`](AGENTS.md).

## Frontend foundation

The standalone web foundation lives in `apps/bba-web` and consumes the generated TypeScript SDK exclusively through `@bba/sdk-react`. It currently provides the responsive application shell and a read-only Mission lookup slice. See [EPIC-IMP-014 Frontend Foundation](.rag/architecture/EPIC-IMP-014-FRONTEND-FOUNDATION.md) for package boundaries, local-session constraints, and validation commands.

## Important disclosure

GPT-5.6 was used during the reference build to reason over the product model and generate or validate sample editorial assets.

Codex was used to help design, implement, debug, validate, and document the reference workflow.

The browser demo replays deterministic reference data while executing policy retrieval, state transitions, channel adaptation, human decisions, and audit logging locally.

This repository must not be interpreted as a production-ready autonomous publishing platform. It does not claim autonomous publishing, live external connectors, a multi-tenant runtime, or multiple live autonomous agents.

## Hackathon

The reference implementation was created for **OpenAI Build Week** and submitted on Devpost as **Axodus BBA Agency**.

- Demo video: [youtu.be/kU0z4TbK-fQ](https://youtu.be/kU0z4TbK-fQ)
- Devpost project: [Axodus BBA Agency](https://devpost.com/software/axodus-bba)

## License

See the repository license and the license included under [`demo/`](demo/).
