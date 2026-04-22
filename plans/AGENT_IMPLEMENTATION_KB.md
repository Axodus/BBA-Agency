# Knowledge Base — AXODUS Agent Implementation

**Última Atualização**: 21 de Abril de 2026  
**Status**: Fase 4.1 ✅ | Próxima: Fase 4.2 ⏳

---

## 🎯 Padrão de Implementação de Agentes

Todos os agentes (depois do BriefInterpreter) seguem este template:

### 1. Arquivo Principal

**Local**: `agents/[categoria]/[agent-name].agent.ts`

```typescript
import { BaseAgent } from "../base.agent.ts";
import { CampaignContext, AgentOutput } from "../../types/index.ts";

export class [AgentClass]Agent extends BaseAgent {
  // 1. Declarações obrigatórias
  role = "[AgentName]" as const;
  step = "[pipeline_step]" as const;
  tools = ["tool1", "tool2"];

  // 2. System prompt com instruções claras para Claude
  buildSystemPrompt(): string {
    return `
Você é o [AgentName]...
`;
  }

  // 3. User prompt com contexto
  buildUserPrompt(context: CampaignContext): string {
    return `
Input: ${context...}
`;
  }

  // 4. Optional: override run() se precisar de setup especial
  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();
    // Carregar memória se aplicável
    if (!context.memory) {
      context.memory = await this.getMemoryContext(...);
    }
    return super.run(context);
  }
}
```

### 2. Schema Zod Correspondente

**Local**: `contracts/schemas.ts`

```typescript
export const [AgentName]OutputSchema = z.object({
  // Campos obrigatórios (required)
  field1: z.string().min(10),
  field2: z.number().min(0).max(1),
  
  // Campos opcionais
  optional_field: z.string().optional(),
});

// Registrar no CONTRACT_MAP
export const CONTRACT_MAP: Record<PipelineStep, z.ZodType> = {
  // ...
  "[step_name]": [AgentName]OutputSchema,
};
```

### 3. Test Suite

**Local**: `utils/test-[agent-name].ts`

```typescript
import { [AgentClass]Agent } from "../agents/[categoria]/[agent-name].agent.ts";
import { CampaignContext } from "../types/index.ts";

async function test() {
  const agent = new [AgentClass]Agent();
  
  const context: CampaignContext = {
    // Preparar contexto com dados necessários
  };
  
  try {
    const result = await agent.run(context);
    console.log("✅ TEST PASSED");
    console.log(result);
  } catch (error) {
    console.error("❌ TEST FAILED", error);
  }
}

test();
```

### 4. Adicionar ao package.json

```json
{
  "scripts": {
    "test:[agent-name]": "tsx utils/test-[agent-name].ts"
  }
}
```

### 5. Documentação

**Local**: `[AGENT_NAME]_AGENT.md`

- Descrição da função
- Diagrama de entrada/saída
- Exemplos de uso
- Guia de debugging

---

## ✅ Fase 4.1 — BriefInterpreterAgent

**Status**: COMPLETO  
**Files**: 3 arquivos + documentação

| Arquivo | Linhas | Status |
|---------|--------|--------|
| agents/strategy/brief-interpreter.agent.ts | 115 | ✅ |
| utils/test-brief-interpreter.ts | 142 | ✅ |
| BRIEF_INTERPRETER_AGENT.md | 256 | ✅ |

**Features**:
- ✅ Extrai problema real vs. sintoma
- ✅ Validação BriefOutputSchema
- ✅ Auto-correction (max 2 tentativas)
- ✅ Memory context integrada
- ✅ Permission check

**Test**:
```bash
npm run memory:init   # Pre-requisito
npm run test:brief    # Executar teste
```

**Expected Output**:
```
✅ TEST PASSED
core_problem: "..."
measurable_goal: { metric, target, timeframe }
confidence: 0.88
```

---

## ⏳ Fase 4.2 — AudienceProfilerAgent (PRÓXIMA)

**Role**: AudienceProfiler  
**Step**: strategy  
**Tools**: ["analytics-ga4", "meta-pixel", "vector-db"]  
**Input**: core_problem (do BriefInterpreter)  
**Output**: ICPOutputSchema

### ICPOutputSchema Structure

```typescript
ICPOutputSchema = z.object({
  segment: z.string(),           // "CFOs at manufacturing", etc.
  painPoints: z.array(z.string()),
  language: z.string(),          // "executivo", "técnico", etc.
  device: z.array(z.string()),   // ["desktop", "mobile"]
  platforms: z.array(z.string()),// ["LinkedIn", "Google Ads"]
  timing: z.string(),            // "Monday-Thursday, 9-12"
  buyingTriggers: z.array(z.string()),
  objections: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});
```

### Implementation Checklist

- [ ] Criar `agents/strategy/audience-profiler.agent.ts`
- [ ] Adicionar schema ao `contracts/schemas.ts`
- [ ] Criar `utils/test-audience-profiler.ts`
- [ ] Testar: `npm run test:audience-profiler`
- [ ] Documentar em `AUDIENCE_PROFILER_AGENT.md`
- [ ] Validar compilação: `npx tsc --noEmit`

---

## 📚 Fases Subsequentes (Roadmap)

### Fase 4.3 — TrendAnalystAgent
- **Input**: core_problem, segment
- **Output**: Trends com scores
- **Tools**: ["analytics-ga4", "vector-db"]

### Fase 4.4 — BrandStrategistAgent
- **Input**: ICP, trends
- **Output**: Brand positioning statement
- **Tools**: ["vector-db"]

### Fase 4.5 — CreativeDirectorAgent (PARALELA)
- **Input**: ICP, brand strategy
- **Output**: 6 conceitos criativos (2×3 instâncias)
- **Tools**: ["vector-db"]
- **Nota**: Usa ParallelIdeationEngine

### Fase 4.6 — DataAnalystAgent
- **Input**: 6 conceitos
- **Output**: Ranked concepts
- **Tools**: ["bigquery", "analytics-ga4"]

### Fase 4.7 — CopywriterAgent
- **Input**: Conceito vencedor
- **Output**: Copy para cada canal
- **Tools**: ["vector-db"]

### Fase 4.8 — VisualDesignerAgent
- **Input**: Conceito vencedor
- **Output**: Design specs
- **Tools**: ["vector-db", "design-api"]

### Fase 4.9 — MotionDesignerAgent (OPTIONAL)
- **Input**: Design specs
- **Output**: Motion keyframes
- **Tools**: ["vector-db"]

### Fase 4.10 — AdsSpecialistAgent (HITL GATE)
- **Input**: Copy + Creative
- **Output**: Ad campaign
- **Tools**: ["meta-ads-api", "google-ads-api"]
- **Gate**: Human approval required

### Fase 4.11 — GrowthHackerAgent
- **Input**: Winning campaign
- **Output**: Growth experiments
- **Tools**: ["analytics-ga4"]

### Fase 4.12 — AnalyticsAgent
- **Input**: Campaign results
- **Output**: Performance report
- **Tools**: ["bigquery", "analytics-ga4"]

### Fase 4.13 — FeedbackLoopAgent
- **Input**: Performance report
- **Output**: Learnings saved to semantic memory
- **Tools**: ["vector-db"]
- **Action**: saveSemantic() if CTR > 0.03

### Fase 5 — OrchestratorAgent
- **Orchestrates**: Steps 1-7 in sequence
- **Tools**: All
- **Gate**: HITL before deployment

---

## 🔐 Checklist de Segurança (Pre-Implementation)

### Antes de implementar cada agente:

- [ ] **Schema Defined**: Zod schema criado em `contracts/schemas.ts`
- [ ] **Permissions Checked**: `config/permissions.ts` atualizado com tools necessárias
- [ ] **Contract Map Updated**: CONTRACT_MAP[step] aponta para novo schema
- [ ] **Memory Integration**: Decidir se precisa `getMemoryContext()`
- [ ] **HITL Gate**: Decidir se precisa aprovação humana
- [ ] **Tool Access**: Todos os tools declarados têm permissão
- [ ] **Cost Impact**: Estimar token usage e verificar orçamento
- [ ] **Error Handling**: Todos os erros possíveis já estão em `utils/errors.ts`

---

## 📊 Métricas de Qualidade

### Por Agente

| Métrica | Target | Como Medir |
|---------|--------|-----------|
| Compilação TypeScript | 0 erros | `npx tsc --noEmit` |
| Schema Validation | 100% | Teste verifica BriefOutputSchema |
| Auto-correction rate | < 10% | Logs indicam retry attempts |
| Memory hit rate | > 70% | (quando houver histórico) |
| Confidence score | > 0.7 | Output field `confidence` |

### Pipeline Total

| Métrica | Target |
|---------|--------|
| End-to-end latency | < 5 min (7 agentes em série) |
| Error rate | < 1% |
| HITL approval time | < 24h |
| Cost per campaign | < 5% budget |

---

## 🛠️ Troubleshooting

### Erro: "Cannot access abstract property 'role' before initialization"

**Solução**: Chamar `initWorkspace()` no método `run()`, não no construtor.

```typescript
async run(context: CampaignContext) {
  this.initWorkspace();  // ← Aqui, não no constructor
  return super.run(context);
}
```

### Erro: "Zod schema validation failed"

**Solução**: Auto-correction tentará de novo (até 2x). Se falhar 2x, é erro real.

Check:
1. Claude retornou JSON válido?
2. Todos os campos obrigatórios presentes?
3. Tipos dos campos estão corretos? (string vs. number, etc.)

### Erro: "Permission Denied: tool 'X' not allowed for agent 'Y'"

**Solução**: Adicionar tool a `config/permissions.ts`:

```typescript
export const AGENT_PERMISSIONS: Record<string, string[]> = {
  "[AgentName]": ["tool1", "tool2"],  // ← Adicionar tools necessárias
};
```

---

## 💡 Best Practices

### 1. Sempre validar com Zod

```typescript
// ❌ NÃO FAZER
const output = JSON.parse(response);
return output;

// ✅ FAZER (BaseAgent já faz isso)
const output = schema.parse(JSON.parse(response));
return output;
```

### 2. Sempre carregar memória quando relevante

```typescript
// ✅ FAZER
if (!context.memory) {
  context.memory = await this.getMemoryContext(context.brief.goal);
}
// Agora buildUserPrompt() pode usar context.memory.episodic
```

### 3. Sempre definir confidence score

```typescript
// ✅ FAZER
return {
  // ... outros campos
  confidence: 0.88,  // Sempre incluir
};

// ❌ NÃO FAZER
return {
  // ... outros campos
  // confidence omitido
};
```

### 4. Sempre tratar erros gracefully

```typescript
// ✅ FAZER
try {
  const result = await agent.run(context);
} catch (error) {
  if (error instanceof ContractViolationError) {
    console.error("Schema violation:", error.flatError);
  } else if (error instanceof PermissionDeniedError) {
    console.error("Access denied:", error.message);
  }
}
```

---

## 🚀 Próximos Passos Imediatos

### Esta Semana

1. **Implementar AudienceProfilerAgent (Fase 4.2)**
   - Escrever `agents/strategy/audience-profiler.agent.ts` (~120 linhas)
   - Criar schema em `contracts/schemas.ts`
   - Testar com `npm run test:audience-profiler`

2. **Validar compilação**
   ```bash
   npx tsc --noEmit
   ```

3. **Atualizar PROGRESS_REPORT.md** com novo status

### Próxima Semana

4. **Implementar Fase 4.3 & 4.4** (TrendAnalyst, BrandStrategist)
5. **Pipeline 4.2 → 4.3 → 4.4** em série
6. **Testar fluxo de contexto** entre agentes

### Semana 3

7. **Implementar CreativeDirectorAgent (Fase 4.5)**
   - Usar ParallelIdeationEngine existente
   - 3 instâncias em paralelo
   - Consolidar 6 conceitos

---

## 📖 Referências Rápidas

### Arquivo de Schemas
[contracts/schemas.ts](../contracts/schemas.ts)

### Arquivo de Permissions
[config/permissions.ts](../config/permissions.ts)

### Arquivo Base do Agente
[agents/base.agent.ts](../agents/base.agent.ts)

### Sistema de Memória
[memory/memory.manager.ts](../memory/memory.manager.ts)

### Primeiro Agente Implementado
[agents/strategy/brief-interpreter.agent.ts](../agents/strategy/brief-interpreter.agent.ts)

### Test Suite Exemplo
[utils/test-brief-interpreter.ts](../utils/test-brief-interpreter.ts)

---

## ✨ Conclusão

AXODUS Agent Framework está construído com:
- ✅ Camadas de segurança robustas
- ✅ Validação de contrato integrada
- ✅ Auto-correction automática
- ✅ Memory context carregada
- ✅ Cost tracking completo
- ✅ HITL gates onde necessário

**Status**: Pronto para construir agentes especializados seguindo o padrão estabelecido.

