# BriefInterpreterAgent — Fase 4.1

## Visão Geral

O **BriefInterpreterAgent** é o primeiro agente especializado implementado da arquitetura AXODUS. Sua função é transformar briefings brutos (textos descritivos) em interpretações estruturadas que alimentam todo o pipeline de criação de campanhas.

**Status**: ✅ Implementado e compilando  
**Localização**: `agents/strategy/brief-interpreter.agent.ts`  
**Classe Base**: `BaseAgent`  
**Role**: `"BriefInterpreter"`  
**Step**: `"interpret"`  
**Tools**: `["notion-mcp"]`

---

## Arquitetura

```
INPUT (Brief Bruto)
    ↓
BriefInterpreterAgent
    ├─ buildSystemPrompt()        ← Instruções para Claude
    ├─ buildUserPrompt()          ← Brief + contexto de memória
    └─ run()                      ← Executa com init de workspace
    ↓
CONTRACT VALIDATION (Zod)
    ├─ BriefOutputSchema
    ├─ Auto-correction (2 tentativas)
    └─ Audit trail
    ↓
OUTPUT (Interpreted Brief)
    {
      "core_problem": "string",
      "target_audience_id": "uuid",
      "measurable_goal": { metric, target, timeframe },
      "brand_voice_constraints": ["string"],
      "hidden_insights": ["string"],
      "confidence": 0.0-1.0
    }
```

---

## Função Principal

### Transformação: Sintoma → Problema Real

O agente extrai 4 camadas de insight do brief:

| Camada | O que busca | Exemplo |
|--------|------------|---------|
| 🎯 **Core Problem** | O problema REAL (não o sintoma) | Cliente: "aumentar vendas"<br/>→ Real: "Visitantes não entendem o valor oferecido" |
| 📊 **Measurable Goal** | Métrica + target + timeframe | "Aumentar conversão em 15% em 30 dias" |
| 🎨 **Constraints** | Restrições de tom, canal, budget | "Falar como expert, sem corporativês" |
| 💡 **Hidden Insights** | O que não foi dito explicitamente | "Cliente tem 40% do público no LinkedIn" |

---

## Como Usar

### Teste Rápido

```bash
npm run test:brief
```

Output esperado:
```
╔════════════════════════════════════════════════════════════╗
║  AXODUS — BriefInterpreterAgent Test                       ║
╚════════════════════════════════════════════════════════════╝

[Setup] Inicializando memória...
✓ Memória carregada

[Agent] Instância criada: BriefInterpreter

[Execution] Executando BriefInterpreterAgent...

═══════════════════════════════════════════════════════════

🎯 CORE PROBLEM:
   "Visitantes não entendem o diferencial da plataforma..."

📊 MEASURABLE GOAL:
   Metric: conversão
   Target: +15%
   Timeframe: 30 dias

... (+ constraints + insights + validation) ...

✅ TEST PASSED — BriefInterpreterAgent working correctly!
```

### Uso Programático

```typescript
import { BriefInterpreterAgent } from "./agents/strategy/brief-interpreter.agent.ts";
import { memory } from "./memory/memory.manager.ts";

// 1. Inicializar
await memory.init();
const agent = new BriefInterpreterAgent();

// 2. Preparar contexto
const context: CampaignContext = {
  id: uuid(),
  brief: {
    id: uuid(),
    client: "MyCompany",
    goal: "conversion",
    rawText: "Queremos... (texto bruto do cliente)",
    budget: 10000,
    deadline: "2026-05-05",
    channels: ["linkedin", "google-ads"]
  },
  memory: undefined // Será carregada pelo agente
};

// 3. Executar
const output = await agent.run(context);

// 4. Acessar resultado
console.log(output.data.core_problem);      // string
console.log(output.data.measurable_goal);   // { metric, target, timeframe }
console.log(output.confidence);             // 0-1 (nível de confiança)
```

---

## Camadas de Segurança em Ação

### 1️⃣ Permission Check
```
Agent role: "BriefInterpreter"
Tools approved: ["notion-mcp"]
✓ Allowed to call notion-mcp only
✗ Cannot call meta-ads-api, google-ads-api, etc.
```

### 2️⃣ Contract Validation (Zod)
```
OUTPUT DO CLAUDE (JSON)
    ↓
BriefOutputSchema.safeParse()
    ├─ ✓ PASS → Retorna output
    └─ ✗ FAIL → Tenta auto-correction
        ├─ Tentativa 1 → Se passar, fim
        └─ Tentativa 2 → Se falhar, ContractViolationError
```

### 3️⃣ Memory Integration
```
buildUserPrompt() carrega:
  • Briefings similares (para contexto)
  • Hooks vencedores (para inspiração)
  • Audience insights (para comparação)
```

### 4️⃣ Cost Tracking
```
Cada chamada Claude é registrada:
  - Input tokens: X
  - Output tokens: Y
  - Custo: (X + Y*5) * (0.003 USD/1k) * 5.5 = R$
```

---

## Exemplo de Entrada/Saída

### Input

```
Cliente: TechCorp SaaS
Goal: conversion
Budget: R$ 10.000
Channels: LinkedIn, Google Ads
Deadline: 2 semanas

Brief Text:
"Somos uma SaaS de gestão de projetos. Estamos tendo dificuldade 
em converter visitantes do site em clientes pagos. Nosso target são 
gerentes de projeto em empresas de 50-500 pessoas.

O problema é que muitos visitantes não entendem o valor que 
oferecemos. Queremos um copy que transmita 'simplicidade' e 
'economiza tempo'."
```

### Output

```json
{
  "core_problem": "Visitantes não conseguem inferir o ROI da plataforma — falta proposição de valor clara em landing page",
  
  "target_audience_id": "550e8400-e29b-41d4-a716-446655440000",
  
  "measurable_goal": {
    "metric": "conversão",
    "target": "15%",
    "timeframe": "30 dias"
  },
  
  "brand_voice_constraints": [
    "Profesional mas acessível (não corporativês)",
    "Foco em ROI/eficiência (não features)",
    "Ênfase em tempo economizado"
  ],
  
  "hidden_insights": [
    "Target é decision-maker — precisa de dados/proof de conceito",
    "Landing page atual não está convertendo → UI/UX é problema?",
    "Menciona 'simplicidade' 2x → pain point principal: complexidade"
  ],
  
  "confidence": 0.82
}
```

---

## Fluxo Completo no Pipeline

```
PIPELINE ORCHESTRATOR
    │
    ├─→ [STEP 1: INTERPRET]
    │       └─ BriefInterpreterAgent ← VOCÊ ESTÁ AQUI
    │          Interpretação bruta
    │
    ├─→ [STEP 2: STRATEGY]
    │       ├─ AudienceProfilerAgent
    │       └─ BrandStrategistAgent
    │
    ├─→ [STEP 3: IDEATION (PARALELA)]
    │       ├─ CreativeDirector (conservative)
    │       ├─ CreativeDirector (balanced)
    │       └─ CreativeDirector (experimental)
    │
    ├─→ [STEP 4: VALIDATION]
    │       └─ DataAnalystAgent (ranqueia conceitos)
    │
    ├─→ [STEP 5: PRODUCTION]
    │       ├─ CopywriterAgent
    │       └─ VisualDesignerAgent
    │
    ├─→ [STEP 6: DEPLOYMENT]
    │       └─ AdsSpecialistAgent (com HITL approval)
    │
    └─→ [STEP 7: FEEDBACK]
            └─ AnalyticsAgent (fecha o loop de aprendizado)
```

---

## Próximos Agentes (Fase 4.2+)

### Fase 4.2 — AudienceProfilerAgent
Constrói o ICP (Ideal Customer Profile) baseado no core_problem identificado

### Fase 4.3 — CreativeDirectorAgent
Gera múltiplos conceitos criativos (3 paralelos com divergência)

### Fase 4.4 — DataAnalystAgent
Valida e ranqueia conceitos usando dados reais da memória

---

## Debugging & Troubleshooting

### Problema: Confiança muito baixa (< 0.6)
**Solução**: Brief faltando informações críticas  
→ Validar com cliente antes de passar para próximos passos

### Problema: Contract Validation Error
**Solução**: Claude não retornou JSON válido  
→ BaseAgent tenta auto-correction automaticamente  
→ Se falhar, revise o systemPrompt

### Problema: Permission Denied
**Solução**: Agent tentou acessar tool não autorizada  
→ Verificar `AGENT_PERMISSIONS` em `config/permissions.ts`

---

## Relacionado

- **Base Class**: [agents/base.agent.ts](../agents/base.agent.ts)
- **Schema Validation**: [contracts/schemas.ts](../contracts/schemas.ts) → `BriefOutputSchema`
- **Permissions**: [config/permissions.ts](../config/permissions.ts) → `BriefInterpreter` entry
- **Memory Integration**: [memory/memory.manager.ts](../memory/memory.manager.ts)
- **Test**: [utils/test-brief-interpreter.ts](../utils/test-brief-interpreter.ts)

---

**Status**: ✅ Implementado | ✅ Compilando | ⏳ Próximo: AudienceProfilerAgent

*BriefInterpreterAgent v1.0 — First specialized agent of AXODUS pipeline*
