# EPIC-IMP-005 — Institutional Assets Report

Program: `BBA Platform Core Implementation`
Epic: `EPIC-IMP-005 — Institutional Assets`
Milestone: `M5 — Institutional Assets Ready`
Date: `2026-07-22`

## Result

- EPIC-IMP-005: **PASS**
- M5 — Institutional Assets Ready: **PASS**
- Push realizado: **NÃO**

## Resumo executivo

Institutional Assets foi implementado como bounded context canônico isolado.
Asset pertence a um Tenant e MissionReference e não representa arquivo,
renderização, storage ou publicação. O lifecycle canônico completo é conhecido,
mas somente create, produce, archive e supersede são executáveis nesta Epic.
AssetVersion é imutável, nasce DRAFT e `currentVersionId` é a única fonte da
versão vigente. Classificação é semântica. Authority, Decision e atores são
referências neutras. DERIVES_FROM e SUPERSEDES são acíclicos; REFERENCES e
RELATES_TO aceitam ciclos. Supersession usa commit lógico atômico e optimistic
concurrency. Demo e legado permaneceram preservados.

## REQs

As 55 REQs `REQ-IMP-005-001` a `REQ-IMP-005-055` estão `DONE` na
[matriz de rastreabilidade](traceability-matrix.md), com fonte, código, teste e
ADR associados.

## Entregas

- Asset Aggregate e lifecycle canônico protegido.
- AssetVersion imutável, CanonicalContent, metadata e classificação semântica.
- AssetAuthorityContext composto somente por referências neutras.
- Relações tipadas, grafo condicionalmente acíclico e direção fixada.
- AssetRepository, AssetRelationshipGraphPort e AssetUnitOfWorkPort.
- Adapters in-memory com optimistic Version checks e commit pareado.
- Use cases de create, produce, version, relationship, archive e supersede.
- Snapshots, serialização, reidratação, eventos e testes de arquitetura.

## ADRs

| ID | Decisão | Status |
| --- | --- | --- |
| ADR-IMP-0016 | Asset é o modelo institucional canônico, não representação física | ACCEPTED |
| ADR-IMP-0017 | AssetVersion é imutável e currentVersionId é o ponteiro vigente | ACCEPTED |
| ADR-IMP-0018 | Grafo é acíclico somente para derivação e supersession | ACCEPTED |

## Validação

| Comando | Resultado | Observação |
| --- | --- | --- |
| `pnpm --dir core typecheck` | PASS | TypeScript strict, NodeNext/ESM |
| `pnpm --dir core test` | PASS | 17 arquivos de teste, 17 passados |
| `pnpm --dir core lint` | PASS | Core quality check |
| `pnpm --dir core format:check` | PASS | Formatação determinística |
| `pnpm --dir core architecture` | PASS | Fronteiras do Core verificadas |
| `pnpm --dir core check` | PASS | Gate completo |
| checks de sintaxe do demo | PASS | 8 módulos JavaScript |
| validação JSON do demo | PASS | 4 arquivos de dados |
| `git diff --check` | PASS | Sem erros de whitespace |
| CI remoto | NOT_RUN | Workflow não invocado localmente |

## Fronteiras

- core → demo: **nenhuma dependência**
- core → src legado: **nenhuma dependência**
- Institutional Assets → Mission/Governance/AI Workforce: **nenhum import**
- Institutional Assets → Workflow/Review/Publication/Connector: **nenhum import**
- demo preservado: **sim**
- src preservado: **sim**

## Riscos e gaps

- Repositories e graph adapter são in-memory; persistência real permanece em
  EPIC-IMP-011.
- A atomicidade de supersession é lógica e determinística. Transação de banco e
  recuperação ficam para EPIC-IMP-011/014.
- Estados UNDER_REVIEW, APPROVED, PUBLISHED e REJECTED não possuem comandos
  locais; integração permanece nos bounded contexts futuros.
- CI remoto e validação visual/cross-browser do demo não foram executados.

## Decisão

EPIC-IMP-005
Status: `PASS`

Milestone:
`M5 — Institutional Assets Ready`

Approved to proceed:
`EPIC-IMP-006 — Knowledge & Policy`

Date:
`2026-07-22`

Approved by:
`Implementation Review`
