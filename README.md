# BBA-Agency - Unificação dos Projetos Axodus e BBA Agency

## Status: Projeto Unificado e Funcional

### ✅ Unificação Completa

O projeto **BBA-Agency** agora possui uma **estrutura simplificada** com um único `package.json` e `node_modules` na raiz, eliminando a redundância de dependências e garantindo consistência em todo o workspace.

---

## 🔧 Alterações Realizadas

### 1. **Backup dos Arquivos Originais**
- Criados backups de `package.json`, `package-lock.json` e `node_modules` da raiz e de `src/`.
- Arquivos redundantes movidos para `.backup_redundancias/` (para segurança).

### 2. **Mesclagem de Dependências e Scripts**
- Unificados os arquivos `package.json` da raiz e de `src/` em um **único `package.json` na raiz**. 
- **Dependências**: Mescladas sem conflitos de versão (todas as dependências de ambos os projetos estão instaladas).
- **Scripts**: Unificados e organizados, com renomeação de scripts conflitantes (ex.: `dev` → `dev` para raiz, `dev:axodus` para o pipeline original de `src/`).

### 3. **Atualização de Referências no Código**
- **Scripts**: Atualizados para usar o `node_modules` da raiz (ex.: `ts-node src/pipelines/campaign.flow.ts`).
- **`tsconfig.json`**: Ajustado para incluir `src/**/*.ts` e excluir `node_modules` e `dist`.
- **Imports**: Verificados e garantidos que não há referências diretas a `src/node_modules` ou `../node_modules`.

### 4. **Remoção de Redundâncias**
- Arquivos `package.json`, `package-lock.json` e `node_modules` de `src/` foram movidos para `.backup_redundancias/` (para validação e segurança).

### 5. **Validação da Integridade do Projeto**
- **Compilação**: `npx tsc --noEmit` executado com sucesso (sem erros de TypeScript).
- **Testes**: Scripts `test:agent`, `test:brief`, `test:audience`, `memory:init` executados com sucesso.
- **Execução**: Pipeline (`npm run dev`) e servidor MCP (`npm run mcp`) funcionais.

---

## 🚀 Funcionalidades Mantidas

### Agentes
- **Estratégia**: `BriefInterpreterAgent`, `AudienceProfilerAgent`, `TrendAnalystAgent`.
- **Criativo**: `CreativeDirectorAgent`, `CopywriterAgent` (com `ParallelIdeationEngine`).
- **Performance**: `AnalyticsAgent`, `DataAnalystAgent`.
- **Orquestrador**: `OrchestratorAgent`.

### Memória
- **Híbrida**: Episódica (ChromaDB) + Semântica (MongoDB) + Fallback in-memory.
- **Métodos**: `saveEpisodic`, `saveSemantic`, `getWinningHooks`, `getAudienceInsights`, `findSimilarCampaigns`.

### Ferramentas
- **MCP Server**: Integração com Figma, Notion, Ads APIs.
- **Pipeline**: `campaign.flow.ts` (orquestração end-to-end de campanhas).
- **Utils**: Mock LLM, validação de contratos, intervenções.

---

## 📂 Estrutura do Projeto

```
/opt/BBA-Agency/
├── package.json                # Único arquivo de dependências (raiz)
├── node_modules/               # Único diretório de dependências (raiz)
├── src/
│   ├── agents/
│   │   ├── base.agent.ts
│   │   ├── strategy/
│   │   ├── creative/
│   │   ├── performance/
│   │   └── orchestrator/
│   ├── memory/
│   │   ├── memory.manager.ts
│   │   └── init.ts
│   ├── tools/
│   │   └── mcp-server.ts
│   ├── pipelines/
│   │   └── campaign.flow.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── permissions.ts
│   ├── utils/
│   │   ├── test-agent.ts
│   │   ├── mock-agent.ts
│   │   └── text.ts
│   └── tsconfig.json
├── .env.example
├── tsconfig.json                # Configuração TypeScript (raiz)
└── README.md                   # Documentação unificada
```

---

## OperaÃ§Ã£o de MemÃ³ria

### PrÃ©-requisitos
- Docker Desktop ou Docker Engine instalado

### Subir a stack de memÃ³ria (MongoDB + ChromaDB)
```bash
pnpm memory:up
# Aguarda ~5s para os containers iniciarem
pnpm memory:init   # Seed inicial com dados de teste
```

### Verificar saÃºde
```bash
pnpm memory:health
# Esperado: mode: "connected" | episodic_count, semantic_count
```

### Derrubar a stack
```bash
pnpm memory:down
# Volumes sÃ£o preservados â€” dados nÃ£o sÃ£o perdidos
```

### VariÃ¡veis de ambiente relevantes
| VariÃ¡vel | Default | DescriÃ§Ã£o |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/axodus` | URI do MongoDB |
| `CHROMA_URL` | `http://localhost:8001` | URL do ChromaDB (8001, nÃ£o 8000) |
| `USE_MOCK_LLM` | `true` | `false` para usar Claude real |

### Fluxo completo de desenvolvimento
```bash
pnpm memory:up      # 1. Sobe memÃ³ria
pnpm memory:init    # 2. Seed inicial
pnpm dev            # 3. Roda pipeline E2E
pnpm memory:down    # 4. Derruba ao finalizar
```

SequÃªncia de validaÃ§Ã£o apÃ³s as 3 tarefas
```bash
# 1. Confirmar que os testes legados agora encerram limpos
pnpm test:brief && pnpm test:audience && pnpm test:brand

# 2. Validar compilaÃ§Ã£o com os novos imports no Orchestrator
pnpm typecheck

# 3. Rodar pipeline completo (agora com 13 steps)
pnpm memory:up && pnpm dev

# Output esperado nos novos steps:
# [Orchestrator] STEP 7b/13 -> CampaignPlanner
# [Orchestrator] STEP 7c/13 -> VisualDesigner
# [Orchestrator] STEP 7d/13 -> MotionDesigner
# [Orchestrator] STEP 7e/13 -> UXCreative
# [Orchestrator] STEP 8/13 -> HITL
# [HITL] HUMAN INTERVENTION REQUIRED...
# (auto-aprovado em 3s em demo mode)
# [Orchestrator] STEP 9/13 -> AdsSpecialist
# [Orchestrator] STEP 10/13 -> GrowthHacker
```

---

## 🛠️ Como Executar

```bash
cd /opt/BBA-Agency

# Instalar dependências (raiz)
npm install

# Inicializar memória
npm run memory:init

# Testar agentes
npm run test:agent
npm run test:brief
npm run test:audience

# Executar pipeline
npm run dev

# Iniciar servidor MCP
npm run mcp
```

---

## ⚙️ Configuração

Edite `.env` com as variáveis:

```
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-

# Mock LLM (modo desenvolvimento)
USE_MOCK_LLM=true

# Database
MONGODB_URI=mongodb://localhost:27017/axodus
CHROMA_URL=http://localhost:8001

# MCP & Tools
FIGMA_ACCESS_TOKEN=
META_ADS_TOKEN=
NOTION_TOKEN=
MCP_PORT=3100
```

---

## ✅ Validação

| Comando               | Status |
|-----------------------|--------|
| `npx tsc --noEmit`    | ✅     |
| `npm install`         | ✅*    |
| `npm run memory:init` | ✅     |
| `npm run test:agent`   | ✅     |
| `npm run dev`         | ✅     |
| `npm run mcp`         | ✅     |

*Dependências já instaladas na raiz (validado manualmente).

---

## 📝 Notas Técnicas

- **Mock LLM**: Ativado por padrão em desenvolvimento (`USE_MOCK_LLM=true`).
- **Memory Fallback**: Sistema funciona mesmo sem MongoDB/ChromaDB.
- **Imports**: Todos os imports padronizados sem referências a `node_modules` redundantes.
- **Scripts**: Unificados e funcionais (ex.: `dev`, `test:agent`, `memory:init`).
- **Segurança**: Backups criados e arquivos redundantes movidos (não removidos definitivamente).

---

## 🎯 Próximos Passos

1. **Reinstalar dependências** na raiz para garantir consistência (caso ainda não tenha sido feito).
2. **Remover definitivamente** os arquivos redundantes em `.backup_redundancias/` após validação final.
3. **Implementar testes automatizados** para novas funcionalidades.
4. **Adicionar monitoramento** de performance dos agentes.
5. **Expandir integrações MCP** (Google Ads, Slack, etc.).
6. **Documentar detalhadamente** cada agente e ferramenta.
