# AUDIENCE PROFILER AGENT — Fase 4.2

**Status**: ✅ Implementado | ✅ Compilando | ⏳ Próximo: TrendAnalystAgent (Fase 4.3)

## 🎯 Objetivo

Transformar um **problema identificado** em um **perfil de cliente ideal (ICP)** com detalhes comportamentais e psicográficos.

**Input**: `core_problem` (do BriefInterpreterAgent)  
**Output**: `ICPOutputSchema` com persona específica, pain points, device, platforms, timing, triggers, objections

## 📐 Arquitetura

```
BriefInterpreterAgent
      ↓
   (core_problem identificado)
      ↓
AudienceProfilerAgent
      ↓
   (ICP estruturado)
      ↓
TrendAnalystAgent (Próxima)
```

## 🔧 Implementação

### Arquivo: `agents/strategy/audience-profiler.agent.ts`

```typescript
export class AudienceProfilerAgent extends BaseAgent {
  role = "AudienceProfiler";
  step = "strategy" as const;
  tools = ["analytics-ga4", "meta-pixel", "vector-db"];

  buildSystemPrompt(): string {
    // Define como Claude deve criar personas específicas (não genéricas)
  }

  buildUserPrompt(context: CampaignContext): string {
    // Estrutura core_problem + contexto de cliente para análise
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();
    // Carrega memória com ICPs similares
    if (!context.memory) {
      const searchQuery = String(interpreted?.core_problem || context.brief.goal);
      context.memory = await this.getMemoryContext(searchQuery);
    }
    return super.run(context);
  }
}
```

## 📊 Schema: ICPOutputSchema

**Arquivo**: `contracts/schemas.ts` (já definido)

```typescript
ICPOutputSchema = z.object({
  audience_id: z.string().uuid(),
  segment: z.string().describe("Cargo + setor + tamanho empresa"),
  pain_points: z.array(z.string()).min(2),
  language_profile: z.string().describe("Como essa persona fala"),
  device: z.enum(["mobile", "desktop", "both"]),
  platforms: z.array(z.string()).min(1),
  timing: z.string().describe("Quando está online/receptiva"),
  buying_triggers: z.array(z.string()),
  objections: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});
```

## 🧪 Teste

### Como Executar

```bash
# Pre-requisito: Memory seed
npm run memory:init

# Executar teste
npm run test:audience
```

**Tempo esperado**: 20-30 segundos

### Saída Esperada

```
╔═══════════════════════════════════════════════════════════╗
║     TEST: AudienceProfilerAgent (Fase 4.2)                ║
╚═══════════════════════════════════════════════════════════╝

✓ BriefInterpreter concluído
  • core_problem: "Onboarding complexo desestimula agências..."
  • confidence: 0.88

✓ AudienceProfiler concluído

[VALIDATION] Validando ICPOutputSchema...
✓ Schema validation PASSED

📊 RESULTADO: ICP ESTRUTURADO

📌 BRIEF INTERPRETADO:
   Problem: Onboarding intimidador para agências criativas
   Goal: conversão → 15% em 30 dias

👥 PERSONA IDENTIFICADA:
   Segment: Donos de agências criativas (5-30 pessoas) com experiência em Figma/Asana
   Language: Casual, tech-savvy, pragmático

💔 PAIN POINTS:
   • Documentação complexa e pouco intuitiva
   • Medo de complexidade técnica ("Não tenho dev")

📱 COMPORTAMENTO:
   Device: both
   Platforms: LinkedIn, Google, Slack, Product Hunt
   Timing: Segunda-quinta, 9-11 e 15-17

🔥 BUYING TRIGGERS:
   • Demo de automação pronta em <5min
   • Comparação explícita: "3x mais rápido que Zapier"

🚧 OBJECTIONS TO OVERCOME:
   • Preço (comparar valor vs Make)
   • Integração com Figma/Asana (showcase)

📊 Confidence: 0.92

✅ TEST PASSED — AudienceProfilerAgent working correctly!
```

## 🏗️ Fluxo de Implementação

### Fase 4.2: AudienceProfiler ✅
- ✅ Arquivo criado: `agents/strategy/audience-profiler.agent.ts`
- ✅ Schema ICPOutputSchema já definido
- ✅ Teste criado: `utils/test-audience-profiler.ts`
- ✅ Script npm: `npm run test:audience`
- ✅ Compilação TypeScript: PASSED

### Próxima: Fase 4.3 — TrendAnalystAgent
- Arquivo: `agents/strategy/trend-analyst.agent.ts`
- Input: `core_problem`, `segment`
- Output: Trends com relevância scores
- Tools: `["analytics-ga4", "vector-db"]`

## 🔐 Segurança

### Permission Checks (já configurado)

```typescript
// config/permissions.ts
AudienceProfiler: ["analytics-ga4", "meta-pixel", "vector-db"]
```

### Auto-Correction Integrada

Se output violar `ICPOutputSchema`:
1. Tentativa 1: Envia erro de schema para Claude
2. Tentativa 2: Insiste em campo faltante
3. Se falhar 2x: Erro registrado com diagnostics

### Memory Integration

Carrega ICPs similares para comparação:
- Episodic: "donos de agência" no histórico
- Semantic: Personas com alta performance (CTR > 3%)

## 💡 Padrão: Persona ESPECÍFICA vs Genérica

### ❌ ERRADO (Genérico)

```json
{
  "segment": "Pequenos empresários",
  "language": "Profissional",
  "timing": "Durante o dia"
}
```

### ✅ CORRETO (Específico)

```json
{
  "segment": "Donos de agência criativa (5-30 pessoas) que usam Figma/Asana e têm medo de complexidade técnica",
  "language": "Casual, tech-savvy, usa gírias como 'fazer um MVP', 'escalar', 'automação sem código'",
  "timing": "Segunda-quinta, 09:00-11:00 no LinkedIn (networking), 14:00-16:00 respondendo emails"
}
```

## 📈 Métricas de Qualidade

| Métrica | Target | Status |
|---------|--------|--------|
| Compilação TypeScript | 0 erros | ✅ PASSED |
| Schema Validation | 100% | ✅ (ICPOutputSchema) |
| Confidence Score | > 0.7 | ✅ Testado |
| Memory Hit Rate | > 70% | ⏳ (quando houver histórico) |

## 🚀 Como Usar em Pipeline

### Orquestrador (ainda não implementado)

```typescript
// Quando OrchestratorAgent estiver pronto:
const orchestrator = new Orchestrator();

const result = await orchestrator.run({
  brief: { /* ... */ },
  // Internamente:
  // 1. BriefInterpreter → core_problem
  // 2. AudienceProfiler → ICP
  // 3. TrendAnalyst → Trends
  // 4. ...etc
});
```

### Manual (para testes)

```typescript
const briefInterpreter = new BriefInterpreterAgent();
const audienceProfiler = new AudienceProfilerAgent();

// Passo 1: Interpretar
const briefOutput = await briefInterpreter.run(context);
context.interpretedBrief = briefOutput.data;

// Passo 2: Criar ICP
const icpOutput = await audienceProfiler.run(context);
context.icp = icpOutput.data;

// Usar ICP nos próximos agentes
const trendOutput = await trendAnalyst.run(context);
```

## 🐛 Troubleshooting

### Erro: "Schema validation FAILED"

**Solução**: Claude não retornou todos os campos obrigatórios

1. Verificar se `confidence` está entre 0-1
2. Verificar se `pain_points` tem mínimo 2 itens
3. Verificar se `platforms` é array não-vazio
4. Se após auto-correction ainda falha: aumentar `MAX_AUTO_CORRECTION_ATTEMPTS`

### Erro: "Property does not exist on type 'CampaignRecord'"

**Solução**: Memory context não tem campos esperados

- Verificar `memory.similarCampaigns` está populada
- Verificar seed data iniciada: `npm run memory:init`
- Validar ChromaDB + MongoDB estão rodando

### Persona muito genérica

**Solução**: Prompt system precisa ser mais específico

Aumentar detalhes em `buildSystemPrompt()`:
- Adicionar exemplos de personas NÃO-aceitas (❌ genéricas)
- Adicionar exemplos de personas aceitas (✅ específicas)
- Pedire Claude cite "nome da persona" na descrição

## 📚 Referências Relacionadas

- [BriefInterpreterAgent](BRIEF_INTERPRETER_AGENT.md) — Agente anterior (Fase 4.1)
- [EXAMPLES.md](EXAMPLES.md) — Exemplos práticos de ICP
- [AGENT_IMPLEMENTATION_KB.md](AGENT_IMPLEMENTATION_KB.md) — Template de implementação
- [contracts/schemas.ts](contracts/schemas.ts#L36) — ICPOutputSchema definição

## ✨ O Que Aprendemos

1. **Personas específicas > genéricas** — "Donos de agência com <5 devs" é melhor que "Pequenos empresários"
2. **Pain points contextualizados** — Devem se relacionar ao problema real, não ser genéricos
3. **Memory helps** — Carregar ICPs similares amplifica insights
4. **Device é contextual** — Donos de agência podem estar "both" (mobile para Slack, desktop para estratégia)
5. **Timing é crítico** — Não é só "quando usam". É "quando estão **receptivos**"

---

**Status**: 🟢 Pronto para próxima fase (4.3 — TrendAnalystAgent)
