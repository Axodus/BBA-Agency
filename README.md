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
CHROMA_URL=http://localhost:8000

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