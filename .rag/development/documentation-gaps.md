# Documentation Gap and Reference Resolution Register

This local register records reference-resolution findings that affect Core
implementation. It does not mutate the canonical `Axodus/Documentation`
Migration Register.

| Reference | Finding | Resolution | Status |
| --- | --- | --- | --- |
| `BBAPLT-GDE-076-*.md` | The requested filename was not present under `development/`. | The canonical document exists at `development/BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md`; its front matter declares `document_id: BBAPLT-GDE-076`. `documentation.manifest.json` records the same `source_path`. | RESOLVED — filename mapping |

## Rule

Future REQs may reference `BBAPLT-GDE-076` by canonical document ID. When a
path is needed, use the resolved `BBAPLT-DEV-001-DEVELOPMENT-CONSTITUTION.md`
path and do not create a duplicate file.
