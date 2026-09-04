# Reference runtime acceptance harness

This directory belongs only to product acceptance. It is not exported, imported
by `src/`, or included in the browser bundle.

`runtime-coverage.json` maps every product bounded context to the Core
integration suite that composes the real M12 command/query runners with the
reference M11 persistence provider. The final acceptance gate executes those
suites through `pnpm --dir core check`, then validates the 74 HTTP operations,
generated client methods, React bindings, product actions, and representative
browser journeys.

The harness uses deterministic tenants, actors and identifiers. It does not
configure a production provider, external Connector runtime, or publication
delivery mechanism.
