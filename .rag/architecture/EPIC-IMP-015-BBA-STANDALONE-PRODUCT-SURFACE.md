# EPIC-IMP-015 — BBA Standalone Product Surface

## Status

`PASS` in the reference implementation after the acceptance commands listed
below complete successfully.

The standalone browser surface consumes only `@bba/sdk-react`, which delegates
to the generated `@bba/api-client`. Browser code does not import Core,
Persistence, Transport, or generated-client types directly.

## Implemented surface

| Slice | Product area | Operations |
| --- | --- | ---: |
| 015.2 | Mission | 5 |
| 015.3 | Human Governance | 8 |
| 015.4 | AI Workforce | 6 |
| 015.5 | Institutional Assets and Knowledge / Policy | 14 |
| 015.6 | Workflow, Review and Publication | 30 |
| 015.7 | Connector | 11 |
| | Total | 74 |

The total contains 57 Commands and 17 Queries. Every Command uses a typed
`CommandIntent`, an interaction-scoped idempotency key, normalized receipt,
explicit cache invalidation, and distinct `REJECTED`/`OUTCOME_UNKNOWN` states.
Queries use tenant-bound keys and public view types.

`packages/sdk-react/product-operation-inventory.json` is derived from the
canonical OpenAPI operation inventory. It records the React binding, product
route/action, interaction type, confirmation requirement, and implementation
slice. It is traceability data, not an independent HTTP contract.

## Product boundaries

- Authentication remains the ephemeral development adapter from EPIC-014.
- Tokens, tenant authorization, Command payloads, and query caches are not
  manually persisted in browser storage.
- Publication records preparation, authorization, and observed outcomes. It
  does not claim or perform external delivery.
- Connector exposes configuration and evidence operations only. There is no
  polling, webhook, OAuth, scheduler, retry, circuit-breaker, or transport
  runtime.
- `demo/` and legacy `src/` are not part of this product graph.

## Acceptance evidence

```bash
pnpm --dir core check
pnpm contracts:check
pnpm --dir clients/typescript check
pnpm --dir transport/http test
pnpm frontend:check
git diff --check
```

The product gate proves the invariant:

```text
74 OpenAPI operations
↔ 74 generated SDK calls
↔ 74 public React bindings
↔ 74 product-addressable bindings
```

The test-only runtime coverage manifest maps all nine bounded contexts to Core
integration suites that compose real M12 runners with the reference M11
persistence provider. It is excluded from the production browser graph.
