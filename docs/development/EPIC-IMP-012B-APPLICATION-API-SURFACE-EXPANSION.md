# EPIC-IMP-012B — Application API Surface Expansion

Status: BACKLOG  
Origin: M12 corrective scope decision  
Dependency: EPIC-IMP-012 = PASS

## Objective

Expand the transport-neutral Application API incrementally, bounded context by
bounded context, only when an institutional consumer requires an operation.

## Backlog input

`core/tools/inventory-application-exports.mjs` reports application use cases
available in the modules. An exported use case is a capability, not an
automatic public API contract.

For every selected operation, a future requirement must define:

- the public Command or Query DTO;
- the API Port method;
- required collaborators;
- transaction and idempotency behavior;
- committed resource references;
- read model;
- tests and traceability.

No operation is approved merely because it is exported by a module.

## Initial candidates

- Human Governance;
- AI Workforce;
- Institutional Assets;
- Knowledge and Policy;
- Workflow;
- Review;
- Publication;
- Connector.

The ordering and exact methods remain subject to institutional demand and a
separate Definition of Ready review.
