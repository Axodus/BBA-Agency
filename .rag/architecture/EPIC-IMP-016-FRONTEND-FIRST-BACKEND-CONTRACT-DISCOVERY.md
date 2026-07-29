# EPIC-IMP-016 — Frontend-First Backend Contract Discovery

Status: `IMPLEMENTATION_EVIDENCE`

Requirement: `REQ-IMP-016-FE-001`

```yaml
canonical_language: English
default_locale: en-US
fallback_locale: en-US
frontend_localization_ready: true
backend_messages_language: English
logs_language: English
deliverable_language: customer-configurable
```

Application locale and deliverable language are separate contracts. Runtime
states, events, actions, errors, payload fields, audit messages, and telemetry
remain English and locale-independent. Customer content uses the explicit
`contentLanguage` field and may use another BCP 47 language tag.

## Functional reference

The static BBA Publisher experience in `apps/bba-web/src/static-publisher/`
is the functional reference for deriving the future Agency Runtime API. It
uses no HTTP client, generated Platform DTO, authentication adapter, provider
credential, timer-based orchestration, or browser persistence.

The user journey is:

```text
Service → Project → Editorial Context → Agent team → Human review
→ Editorial Package
```

Platform concepts remain available only through `/platform-diagnostics` and
optional execution details.

## Route map

| Route | Customer function |
| --- | --- |
| `/` | Select an Agency service |
| `/services/publisher` | Understand Publisher outcome and limitations |
| `/services/publisher/new` | Complete the seven-step Editorial Context wizard |
| `/projects` | List Projects and demonstrate loading/empty/error |
| `/projects/:projectId/context` | Inspect context and Editorial Core |
| `/projects/:projectId/strategy` | Inspect publication strategy |
| `/projects/:projectId/content` | Review Blog, LinkedIn, and Instagram |
| `/projects/:projectId/review` | Inspect findings and record final decision |
| `/projects/:projectId/delivery` | Copy or export the approved package |
| `/settings/ai` | Demonstrate sanitized BYOK states |
| `/platform-diagnostics` | Inspect previous Platform coverage technically |

All Project sections are deep-linkable. Fixture scenarios may also be selected
with `?scenario=<scenario>`.

## Experience contracts

The stable frontend-first view models are declared in
`static-publisher/models.ts`. `PublisherProjectView` owns exactly what the
Experience needs: visible stage, Editorial Context, Core versions, plan,
variants, review, delivery, agents, decisions, timeline, consumption, and
available actions. It does not import generated SDK or Platform models.

The local state machine is `static-publisher/state-machine.ts`. Events are
explicit English identifiers and form the candidate Runtime event vocabulary;
timers and translated labels are not part of the behavioral contract.

## Action to backend derivation

| UI action | Future kind | Minimum request | Minimum response | Public failures | Platform capability |
| --- | --- | --- | --- | --- | --- |
| List Projects | Query | user/tenant context, filters | Project summaries | unauthorized, unavailable | Mission projection |
| Create Project | Command | product version, Editorial Context, execution mode | Project snapshot | validation, conflict | Mission, Knowledge |
| Open Project | Query | Project ID | complete Experience snapshot | not found, forbidden | composed read model |
| Advance execution | Command | Project ID, expected visible version | updated snapshot | stale version, execution failure | Workflow, AI Workforce |
| Retry stage | Command | Project ID, failed stage, prior attempt | attempt receipt and snapshot | action unavailable | Workflow execution |
| Approve Editorial Core | Command | Core version, rationale | recorded decision | stale version, forbidden | Human Governance, Review |
| Request Core revision | Command | Core version, guidance, impacted outputs | revised Core snapshot | validation, conflict | Review, Workflow |
| Reject Editorial Core | Command | Core version, rationale | terminal Project snapshot | stale version | Human Governance |
| Approve package | Command | package/review version, rationale | Delivery package | blocking finding, stale version | Review, Publication |
| Request package revision | Command | package version, guidance, affected channels | regenerated package snapshot | action unavailable | Workflow, Assets, Review |
| Reject package | Command | package version, rationale | rejected Project snapshot | stale version | Human Governance |
| Export package | Query/download | Project ID and package version | structured JSON stream | not ready, not found | Publication projection |
| Read BYOK state | Query | principal context | sanitized provider status | unavailable | Runtime credential boundary |
| Configure BYOK | Command | provider, credential, consent | sanitized status | invalid, rate limit | Runtime credential boundary |
| Remove BYOK | Command | provider | unconfigured status | not found | Runtime credential boundary |

No API key may be returned. No Platform Aggregate is exposed to the browser.

## Fixture catalog

Fixtures live under `static-publisher/fixtures/` and include products,
Projects, Editorial Contexts, Editorial Cores, plans, channel variants,
findings, decisions, agents, execution events, and provider states.

Supported Project scenarios:

- `new-project`;
- `running-context-analysis`;
- `awaiting-core-approval`;
- `core-revision-requested`;
- `running-content-generation`;
- `awaiting-package-approval`;
- `package-blocked`;
- `package-revision-requested`;
- `ready-for-delivery`;
- `recoverable-failure`.

Provider scenarios additionally cover not configured, checking, configured,
invalid, rate limited, and expired.

## Error and transversal state catalog

The static routes demonstrate loading, empty, success, validation error,
not-found, execution failure, retrying, awaiting-user, stale/superseded
versions, blocked approval, and unavailable actions. Authentication and
authorization remain future Runtime responsibilities and are represented in
the action matrix rather than simulated as a fake login.

## Deliberate limitations

- browser reload clears Projects created by the user;
- URLs and file bytes are never processed;
- no backend, LLM, streaming, Connector, publication, billing, or `$Neurons`;
- copied and exported content comes from typed fixtures/local state;
- channel limits are illustrative;
- technical Platform coverage is diagnostic, not a customer product.

The next backend requirement must start from this action matrix and produce a
separate contract proposal. It must not reinterpret incidental Platform APIs
as the Agency Experience contract.
