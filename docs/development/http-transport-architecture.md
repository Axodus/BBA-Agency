# HTTP Transport Architecture

The official HTTP boundary is outside the BBA Platform Core package:

```text
External client
  -> @bba/http-transport
  -> @bba/platform-core/application
  -> Application API M12
  -> Domain and Persistence through their existing ports
```

The adapter cannot import Core source paths, bindings, modules, repositories or
Persistence. Its only Core dependency is the closed package export
`@bba/platform-core/application`.

## Contract flow

```text
contracts/openapi/v1/openapi.yaml
  -> Fastify route and serialization schemas
  -> operation-inventory.json
  -> contract tests
  -> @bba/api-client generated SDK
```

The inventory is derived evidence, not another contract source. Each OpenAPI
operation records its bounded context, Application method and command/query
kind. Runtime composition resolves that identity to exactly one API Port call.

## Security boundary

Bearer authentication resolves a principal. The tenant header is only a
requested tenant and must be authorized against the principal, OpenAPI
`operationId` and optional target. HTTP authorization does not reproduce Domain
or Human Governance rules; those remain in Application and Domain.

## Runtime compatibility

The canonical contract is OpenAPI 3.1. Runtime schemas use a deliberately
restricted JSON Schema subset and are compiled during Fastify bootstrap. All
public responses have closed schemas, making serialization itself a disclosure
boundary.
