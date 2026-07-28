# Definition of Ready

REQ: `REQ-IMP-000-009`

A future REQ is `READY` only when this checklist is complete:

- [ ] unique REQ ID, Epic, Sprint, owner, scope, and priority;
- [ ] objective and acceptance criteria;
- [ ] normative Foundation/Product/Domain/Architecture/Development sources;
- [ ] dependencies and permitted files/directories;
- [ ] input and output contracts;
- [ ] **API Pública do Módulo**, including exported classes, interfaces, and
      types versus internal implementation details;
- [ ] states, transitions, invariants, and failure behavior;
- [ ] Tenant, identity, Authority, Accountability, Stewardship, Lineage, and
      Evidence obligations;
- [ ] test scenarios and validation commands;
- [ ] explicit out-of-scope behavior;
- [ ] gate decision and required evidence.

Missing evidence keeps the REQ out of `READY`; it is not silently inferred
from legacy code or a prototype.
