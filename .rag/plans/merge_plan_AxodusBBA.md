# 📋 Plano de Merge: `axodus/` + `src/` → `AxodusBBA`

## 1. **Objetivo do Merge**
Unificar os diretórios `axodus/` e `src/` em uma única estrutura coesa (`AxodusBBA`), mantendo todas as funcionalidades, agentes, ferramentas e configurações. O projeto resultante deve ser:
- **Funcional**: Todos os agentes, ferramentas e pipelines devem operar sem erros.
- **Testável**: Testes automatizados e manuais devem validar a integridade do merge.
- **Escalável**: Estrutura organizada para suportar novos agentes e ferramentas.

---

## 2. **Estrutura Final Proposta (`AxodusBBA`)**
Estrutura integrada, combinando o melhor de ambos os diretórios. Arquivos conflitantes (ex.: `base.agent.ts`) serão mesclados, priorizando a implementação mais robusta e incorporando funcionalidades exclusivas.

### **Diretórios e Arquivos**
| Diretório/Arquivo               | Origem               | Ação                                                                                     | Prioridade | Justificativa                                                                                     |
|---------------------------------|----------------------|------------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------|
| `agents/base.agent.ts`          | `axodus/` + `src/`   | Mesclar implementações. Priorizar `axodus/` (validação de contratos, permissões, HITL). Incorporar mock LLM de `src/`. | Alta       | `axodus/` possui validação de contratos e permissões, enquanto `src/` tem suporte a mock LLM.     |
| `agents/creative/`              | `axodus/` + `src/`   | Unificar agentes. `axodus/` tem `parallel-ideation.engine.ts`. `src/` tem `copywriter.agent.ts` e `creative-director.agent.ts`. | Alta       | Ambos os diretórios possuem agentes complementares.                                               |
| `agents/strategy/`              | `axodus/` + `src/`   | Unificar agentes. Ambos possuem `audience-profiler.agent.ts` e `brief-interpreter.agent.ts`. Priorizar `axodus/`.       | Alta       | Implementações similares, mas `axodus/` está mais avançado (Fase 4).                              |
| `agents/performance/`           | `axodus/` + `src/`   | Unificar agentes. `src/` possui `analytics.agent.ts` e `data-analyst.agent.ts`. `axodus/` não possui implementações.    | Alta       | `src/` possui agentes exclusivos para validação e feedback.                                       |
| `agents/orchestrator/`          | `axodus/` + `src/`   | Unificar. `src/` possui `orchestrator.agent.ts`. `axodus/` não possui implementação.                | Média       | `src/` possui implementação exclusiva.                                                            |
| `config/`                       | `axodus/`            | Mover `permissions.ts` para o novo projeto.                                                    | Alta       | `axodus/` possui matriz de permissões robusta.                                                    |
| `contracts/`                    | `axodus/`            | Mover `schemas.ts` para o novo projeto.                                                        | Alta       | `axodus/` possui validação de contratos com Zod.                                                  |
| `memory/`                       | `axodus/` + `src/`   | Mesclar implementações. Priorizar `axodus/` (episódic + semantic). Incorporar inicialização de `src/`. | Alta       | `axodus/` possui implementação mais avançada.                                                     |
| `pipelines/campaign.flow.ts`    | `axodus/` + `src/`   | Mesclar implementações. Priorizar `axodus/` (Fase 6).                                           | Alta       | `axodus/` possui pipeline mais avançado.                                                          |
| `tools/`                        | `axodus/` + `src/`   | Unificar ferramentas. `src/` possui `mcp-server.ts`. `axodus/` possui diretórios vazios.         | Alta       | `src/` possui implementação funcional de MCP.                                                     |
| `types/`                        | `axodus/` + `src/`   | Mesclar tipos. Priorizar `axodus/` (tipos core e `agent.interface.ts`).                           | Alta       | `axodus/` possui tipos mais completos.                                                            |
| `utils/`                        | `axodus/` + `src/`   | Unificar utilitários. `axodus/` possui `cost-auditor.ts`, `intervention.ts`, `errors.ts`. `src/` possui `mock-agent.ts`, `test-agent.ts`. | Alta       | Ambos possuem utilitários complementares.                                                         |
| `package.json`                  | `axodus/` + `src/`   | Mesclar dependências e scripts. Priorizar `axodus/` como base.                                   | Alta       | `axodus/` possui dependências mais completas.                                                     |
| `tsconfig.json`                 | `axodus/` + `src/`   | Priorizar `axodus/` como base. Mesclar configurações exclusivas de `src/`.                       | Alta       | `axodus/` possui configurações mais avançadas.                                                    |
| `.env.example`                  | `axodus/`            | Mover para o novo projeto.                                                                       | Média       | `axodus/` possui exemplo de configuração.                                                         |
| `README.md`                     | `axodus/` + `src/`   | Criar novo `README.md` para `AxodusBBA`, incorporando documentação de ambos.                     | Alta       | Documentação unificada é essencial para o projeto.                                                |
| `IMPLEMENTATION_STATUS.md`      | `axodus/`            | Mover para o novo projeto e atualizar com o status do merge.                                     | Baixa       | Documentação de status é útil para rastreabilidade.                                               |

---

## 3. **Passos para Execução do Merge**
O merge será dividido em etapas lógicas, priorizando a unificação de componentes críticos (ex.: `base.agent.ts`, `memory/`, `tools/`). Cada etapa inclui validação para garantir integridade.

### **Etapa 1: Backup dos Diretórios Originais**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Criar backup de `axodus/` e `src/`    | `cp -r axodus axodus_backup && cp -r src src_backup`                                          | `axodus/`, `src/`                            | Verificar se os diretórios `axodus_backup/` e `src_backup/` foram criados. | **Code Mode**     |

---

### **Etapa 2: Configuração Inicial do Projeto `AxodusBBA`**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Criar diretório `AxodusBBA`           | `mkdir -p AxodusBBA`                                                                           | `AxodusBBA/`                                 | Verificar se o diretório foi criado.           | **Code Mode**     |
| Copiar estrutura base de `axodus/`    | `cp -r axodus/* AxodusBBA/`                                                                     | Todos os arquivos de `axodus/`               | Verificar se a estrutura foi copiada.          | **Code Mode**     |

---

### **Etapa 3: Unificação de Arquivos Críticos**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Mesclar `agents/base.agent.ts`        | Incorporar suporte a mock LLM de `src/agents/base.agent.ts` na implementação de `axodus/agents/base.agent.ts`. | `AxodusBBA/agents/base.agent.ts`             | Verificar se o arquivo compila (`npx tsc --noEmit`). | **Code Mode**     |
| Unificar `agents/creative/`           | Mover `copywriter.agent.ts` e `creative-director.agent.ts` de `src/` para `AxodusBBA/agents/creative/`. | `AxodusBBA/agents/creative/`                 | Verificar se os agentes são reconhecidos pelo TypeScript. | **Code Mode**     |
| Unificar `agents/performance/`        | Mover `analytics.agent.ts` e `data-analyst.agent.ts` de `src/` para `AxodusBBA/agents/performance/`. | `AxodusBBA/agents/performance/`              | Verificar se os agentes são reconhecidos pelo TypeScript. | **Code Mode**     |
| Unificar `agents/orchestrator/`       | Mover `orchestrator.agent.ts` de `src/` para `AxodusBBA/agents/orchestrator/`.                  | `AxodusBBA/agents/orchestrator/orchestrator.agent.ts` | Verificar se o agente é reconhecido pelo TypeScript. | **Code Mode**     |
| Mesclar `memory/`                     | Incorporar lógica de inicialização de `src/memory/init.ts` em `AxodusBBA/memory/`. Priorizar implementação de `axodus/`. | `AxodusBBA/memory/`                          | Verificar se a inicialização da memória funciona (`npm run memory:init`). | **Code Mode**     |
| Unificar `tools/`                     | Mover `mcp-server.ts` de `src/tools/` para `AxodusBBA/tools/mcp-server.ts`. Remover diretórios vazios de `axodus/tools/`. | `AxodusBBA/tools/mcp-server.ts`              | Verificar se o servidor MCP sobe (`npm run mcp`). | **Code Mode**     |
| Mesclar `utils/`                      | Mover `mock-agent.ts` e `test-agent.ts` de `src/utils/` para `AxodusBBA/utils/`.                  | `AxodusBBA/utils/`                           | Verificar se os utilitários são reconhecidos pelo TypeScript. | **Code Mode**     |
| Mesclar `package.json`                | Incorporar dependências e scripts exclusivos de `src/package.json` em `AxodusBBA/package.json`. Priorizar `axodus/package.json` como base. | `AxodusBBA/package.json`                     | Verificar se `npm install` executa sem erros.  | **Code Mode**     |
| Mesclar `tsconfig.json`               | Incorporar configurações exclusivas de `src/tsconfig.json` em `AxodusBBA/tsconfig.json`. Priorizar `axodus/tsconfig.json` como base. | `AxodusBBA/tsconfig.json`                    | Verificar se o TypeScript compila (`npx tsc --noEmit`). | **Code Mode**     |

---

### **Etapa 4: Resolução de Conflitos**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Resolver conflitos de imports         | Atualizar imports em todos os arquivos para refletir a nova estrutura. Ex.: `import { memory } from "../memory/memory.manager"` → `import { memory } from "../../memory/memory.manager"`. | Todos os arquivos `.ts`                      | Verificar se não há erros de import (`npx tsc --noEmit`). | **Code Mode**     |
| Resolver conflitos de tipos           | Mesclar tipos conflitantes em `AxodusBBA/types/`. Priorizar `axodus/types/`.                   | `AxodusBBA/types/`                           | Verificar se não há erros de tipo (`npx tsc --noEmit`). | **Code Mode**     |
| Resolver conflitos de configuração    | Mesclar variáveis de ambiente em `.env.example`. Priorizar `axodus/.env.example`.              | `AxodusBBA/.env.example`                     | Verificar se todas as variáveis necessárias estão presentes. | **Code Mode**     |

---

### **Etapa 5: Validação da Integridade**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Compilar TypeScript                   | `cd AxodusBBA && npx tsc --noEmit`                                                            | Todos os arquivos `.ts`                      | Verificar se não há erros de compilação.       | **Code Mode**     |
| Validar inicialização da memória      | `cd AxodusBBA && npm run memory:init`                                                         | `AxodusBBA/memory/init.ts`                   | Verificar se a memória é inicializada sem erros. | **Code Mode**     |
| Testar agentes                        | `cd AxodusBBA && npm run test:agent`                                                          | `AxodusBBA/utils/test-agent.ts`              | Verificar se os agentes executam sem erros.    | **Code Mode**     |
| Testar servidor MCP                   | `cd AxodusBBA && npm run mcp`                                                                  | `AxodusBBA/tools/mcp-server.ts`              | Verificar se o servidor sobe e responde requisições. | **Code Mode**     |

---

### **Etapa 6: Documentação**
| O que Fazer                          | Como Fazer                                                                                     | Arquivos Envolvidos                          | Validação                                      | Responsável       |
|---------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------|------------------------------------------------|-------------------|
| Criar `README.md` unificado          | Documentar estrutura do projeto, como executar testes, inicializar memória e subir o MCP.      | `AxodusBBA/README.md`                        | Verificar se a documentação está clara e completa. | **Code Mode**     |
| Atualizar `IMPLEMENTATION_STATUS.md`  | Atualizar com o status do merge e próximas etapas.                                             | `AxodusBBA/IMPLEMENTATION_STATUS.md`         | Verificar se o status está atualizado.         | **Code Mode**     |

---

## 4. **Ferramentas e Comandos Necessários**
| Ferramenta/Comando               | Descrição                                                                                       | Quando Usar                                                                                     |
|-----------------------------------|-------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `cp -r`                            | Copiar diretórios e arquivos.                                                                    | Backup e cópia de estrutura inicial.                                                          |
| `npx tsc --noEmit`                | Compilar TypeScript sem gerar arquivos de saída.                                                | Validação de integridade após mudanças.                                                        |
| `npm install`                     | Instalar dependências do projeto.                                                               | Após mesclar `package.json`.                                                                    |
| `npm run memory:init`             | Inicializar memória com seed data.                                                              | Validação da memória.                                                                           |
| `npm run test:agent`              | Testar agentes.                                                                                 | Validação de agentes.                                                                           |
| `npm run mcp`                     | Subir servidor MCP.                                                                             | Validação do MCP.                                                                               |
| `diff`                            | Comparar arquivos para identificar diferenças.                                                  | Resolução de conflitos.                                                                         |
| VS Code (ou IDE similar)          | Editor de código para mesclar arquivos manualmente.                                             | Mesclagem de arquivos conflitantes.                                                            |

---

## 5. **Riscos e Mitigações**
| Risco                                      | Impacto                          | Mitigação                                                                                     |
|--------------------------------------------|----------------------------------|-------------------------------------------------------------------------------------------------|
| Perda de funcionalidades durante o merge   | Agentes ou ferramentas inoperantes         | Criar backup dos diretórios originais. Testar cada etapa do merge.                            |
| Conflitos em arquivos de configuração      | Build ou execução falha                    | Mesclar dependências e configurações manualmente. Validar com `npm install` e `tsc --noEmit`. |
| Erros de importação                       | Compilação falha                          | Atualizar imports manualmente. Usar `npx tsc --noEmit` para validar.                          |
| Incompatibilidade entre implementações     | Funcionalidades quebradas                  | Priorizar implementações mais robustas (ex.: `axodus/`) e incorporar funcionalidades exclusivas de `src/`. |
| Falta de documentação                    | Dificuldade na manutenção                  | Criar `README.md` unificado e atualizar `IMPLEMENTATION_STATUS.md`.                           |

---

## 6. **Validação Pós-Merge**
### **Testes Automatizados**
- **Compilação TypeScript**: `npx tsc --noEmit` (validar ausência de erros).
- **Testes de Agentes**: `npm run test:agent` (validar execução dos agentes).
- **Inicialização da Memória**: `npm run memory:init` (validar seed data).
- **Servidor MCP**: `npm run mcp` (validar subida do servidor e resposta a requisições).

### **Testes Manuais**
- **Execução de Agentes**: Verificar se agentes como `BriefInterpreterAgent`, `CopywriterAgent` e `AnalyticsAgent` executam sem erros.
- **Integração com Ferramentas**: Testar chamadas ao MCP (ex.: `figma.getFrame`, `notion.createPage`).
- **Validação de Contratos**: Verificar se a validação de contratos (Zod) funciona para todos os agentes.
- **HITL e Cost Tracking**: Testar fluxo de aprovação humana e auditoria de custos.

### **Critérios de Sucesso**
1. **Compilação**: TypeScript compila sem erros.
2. **Execução**: Todos os scripts do `package.json` executam sem erros.
3. **Funcionalidades**: Agentes, memória e MCP operam conforme esperado.
4. **Documentação**: `README.md` e `IMPLEMENTATION_STATUS.md` estão atualizados.

---

## 7. **Documentação**
### **Atualização do `README.md`**
O novo `README.md` deve incluir:
- **Estrutura do Projeto**: Descrição dos diretórios e arquivos principais.
- **Como Executar**: Instruções para compilar, testar e subir o MCP.
- **Configuração**: Variáveis de ambiente necessárias (`.env.example`).
- **Exemplos**: Exemplos de uso dos agentes e ferramentas.

### **Registro de Mudanças**
- **`IMPLEMENTATION_STATUS.md`**: Atualizar com o status do merge, funcionalidades unificadas e próximas etapas.
- **`CHANGELOG.md`**: Criar (se não existir) e registrar mudanças significativas.

### **Comentários no Código**
- Adicionar comentários em arquivos mesclados para explicar alterações críticas (ex.: `// MESCLADO: Incorporado suporte a mock LLM de src/agents/base.agent.ts`).

---

## 8. **Diagrama de Fluxo do Merge**
```mermaid
flowchart TD
    A[Início] --> B[Backup dos Diretórios]
    B --> C[Criar Estrutura AxodusBBA]
    C --> D[Unificar Arquivos Críticos]
    D --> E[Resolver Conflitos]
    E --> F[Validar Integridade]
    F --> G[Documentar Mudanças]
    G --> H[Fim]

    D -->|Etapas| D1[Mesclar base.agent.ts]
    D --> D2[Unificar agents/creative/]
    D --> D3[Unificar agents/performance/]
    D --> D4[Unificar tools/]
    D --> D5[Mesclar package.json]
    D --> D6[Mesclar tsconfig.json]

    E -->|Conflitos| E1[Imports]
    E --> E2[Tipos]
    E --> E3[Configurações]

    F -->|Testes| F1[Compilar TypeScript]
    F --> F2[Testar Agentes]
    F --> F3[Testar Memória]
    F --> F4[Testar MCP]