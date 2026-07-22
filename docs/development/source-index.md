# Development Source Index

## Authority

The implementation authority is the certified documentation corpus at:

`../Documentation/.rag/bba-platform/`

On this workspace, the path resolves to the sibling repository
`/mnt/d/Rede/Github/Axodus/Documentation/.rag/bba-platform/`. A clean clone
that does not include that private checkout must mark source verification as
`BLOCKED`; it must not invent a substitute document.

The normative hierarchy is:

```text
Foundation → Product → Domain → Architecture → Development → Operations
```

Local documents provide execution links only. The external governed corpus is
private by default and is not copied into this repository.

## Required foundation and reference sources

- `FOUNDATION-MANIFEST.yaml`
- `BBA-DOC-UBIQUITOUS-LANGUAGE.md`
- `BBA-DOC-DECISION-TRACEABILITY.md`
- `BBA-DOC-QUALITY-STANDARDS.md`
- `BBA-DOC-PUBLIC-PRIVATE-BOUNDARY.md`
- `adr/BBA-ADR-0001-DOCUMENTATION-AS-SOURCE-OF-TRUTH.md`
- `adr/BBA-ADR-0002-MISSION-AS-CORE-DOMAIN-ENTITY.md`
- `adr/BBA-ADR-0003-TENANT-NEUTRAL-CORE.md`
- `adr/BBA-ADR-0004-DOMAIN-BEFORE-ARCHITECTURE.md`

## Architecture sources

All `architecture/BBAPLT-ARCH-*.md` documents are normative inputs. M0
particularly depends on the architecture constitution, bounded contexts,
canonical interfaces, information integrity and lineage, Tenant isolation, and
auditability documents.

## Mission Core sources

EPIC-IMP-002 additionally depends on:

- `domain/BBAPLT-GDE-011-MISSION-DOMAIN-OVERVIEW.md`;
- `domain/BBAPLT-GDE-012-MISSION-LIFECYCLE.md`;
- `domain/BBAPLT-GDE-013-MISSION-STATE-MODEL.md`;
- `domain/BBAPLT-GDE-014-MISSION-RULES.md`;
- `domain/BBAPLT-GDE-015-MISSION-POLICIES.md`;
- `domain/BBAPLT-GDE-016-MISSION-CONSTRAINTS.md`;
- `domain/BBAPLT-RPT-003-MISSION-DOMAIN-REVIEW.md`;
- `architecture/BBAPLT-ARCH-020-INFORMATION-LIFECYCLE.md`;
- `development/BBAPLT-GDE-082-BACKEND-DOMAIN-REALIZATION.md`;
- `development/BBAPLT-GDE-083-BACKEND-PERSISTENCE-AND-DATA-ACCESS-CONTRACTS.md`.

Where implementation labels differ from the canonical Mission State Model,
`ADR-IMP-0008` records the realization without creating alternate Domain states.

## Development sources

The implementation baseline consults:

- `development/BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md` (`document_id:
  BBAPLT-GDE-076`)
- `development/BBAPLT-GDE-077-ENGINEERING-PRINCIPLES.md`
- `development/BBAPLT-GDE-078-DEVELOPMENT-GLOSSARY-AND-TAXONOMY.md`
- `development/BBAPLT-GDE-079-IMPLEMENTATION-TRACEABILITY-AND-ADR-PRACTICE.md`
- `development/BBAPLT-GDE-080-QUALITY-AND-CONTRIBUTION-GATES.md`
- `development/BBAPLT-GDE-081` through `BBAPLT-GDE-085`
- `development/BBAPLT-GDE-091` through `BBAPLT-GDE-100`
- `development/BBAPLT-RPT-024-DEVELOPMENT-CANONICAL-REVIEW.md`

The requested `BBAPLT-GDE-076-*.md` reference resolves by canonical document
ID to `development/BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md`. The filename
differs from the ID-based reference in the REQ; this mapping is recorded in
`documentation-gaps.md`. The supplied REQ also names `BBAPLT-GDE-091`, `095`,
`096`, `097`, `098`, `099`, and `100`; all were located.

## Review implementation sources

EPIC-IMP-008 additionally depends on:

- `domain/BBAPLT-GDE-037-QUALITY-GATES-AND-REVIEW-OBLIGATIONS.md`;
- `domain/BBAPLT-GDE-045-DECISION-AND-APPROVAL-MODEL.md`;
- `domain/BBAPLT-GDE-049-GOVERNANCE-RULES.md`;
- `architecture/BBAPLT-ARCH-003-BOUNDED-CONTEXT-ARCHITECTURE.md`;
- `architecture/BBAPLT-ARCH-005-CANONICAL-INFORMATION-FLOW.md`;
- `architecture/BBAPLT-ARCH-007-CANONICAL-INTERFACE-CONTRACTS.md`;
- `architecture/BBAPLT-ARCH-008-CROSS-CONTEXT-INTERACTION-MATRIX.md`;
- `architecture/BBAPLT-ARCH-025-AUDITABILITY-AND-TRACEABILITY.md`.

The certified architecture assigns Review and Approval semantics to Human
Governance. `ADR-IMP-0025` therefore records Review as an isolated
implementation module without declaring a new canonical bounded context or
transferring institutional Authority.

## Local status rule

Every local traceability claim uses `PASS`, `FAIL`, `NOT_RUN`,
`NOT_APPLICABLE`, or `BLOCKED`. Local documents never claim that the Core is
production-ready.
