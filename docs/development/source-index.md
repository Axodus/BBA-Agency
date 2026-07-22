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

## Development sources

The implementation baseline consults:

- `development/BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md`
- `development/BBAPLT-GDE-077-ENGINEERING-PRINCIPLES.md`
- `development/BBAPLT-GDE-078-DEVELOPMENT-GLOSSARY-AND-TAXONOMY.md`
- `development/BBAPLT-GDE-079-IMPLEMENTATION-TRACEABILITY-AND-ADR-PRACTICE.md`
- `development/BBAPLT-GDE-080-QUALITY-AND-CONTRIBUTION-GATES.md`
- `development/BBAPLT-GDE-081` through `BBAPLT-GDE-085`
- `development/BBAPLT-GDE-091` through `BBAPLT-GDE-100`
- `development/BBAPLT-RPT-024-DEVELOPMENT-CANONICAL-REVIEW.md`

The requested `BBAPLT-GDE-076-*.md` file was not present in the inspected
corpus. This is recorded as a documentation gap, not replaced by an invented
file. The supplied REQ also names `BBAPLT-GDE-091`, `095`, `096`, `097`, `098`,
`099`, and `100`; all were located.

## Local status rule

Every local traceability claim uses `PASS`, `FAIL`, `NOT_RUN`,
`NOT_APPLICABLE`, or `BLOCKED`. Local documents never claim that the Core is
production-ready.
