// ─────────────────────────────────────────────────────────────
// AXODUS — Trend Analyst Agent
// FASE 4.3: Identifica trends relevantes para o problema + segment
// ─────────────────────────────────────────────────────────────

import { BaseAgent } from "../base.agent";
import { CampaignContext, AgentOutput } from "../../types/index";
import { v4 as uuid } from "uuid";

/**
 * ── TREND ANALYST AGENT ─────────────────────────────────────
 * Função: Identificar trends relevantes para o segment + core_problem
 *
 * INPUT: core_problem + segment (do BriefInterpreter + AudienceProfiler)
 * OUTPUT: Trends com relevância scores, oportunidades, riscos
 *
 * Regra: Trends devem ser ESPECÍFICOS ao context, não genéricos
 */
export class TrendAnalystAgent extends BaseAgent {
  role = "TrendAnalyst";
  step = "trends" as const;
  tools = ["analytics-ga4", "vector-db"];

  /**
   * ── SYSTEM PROMPT ────────────────────────────────────────
   * Define o contexto e regras para Claude identificar trends
   */
  buildSystemPrompt(): string {
    return `Você é o TrendAnalyst da agência Axodus.
Sua ÚNICA função é identificar trends RELEVANTES para o contexto específico (problema + segment).

OBJETIVO:
1. Identificar 2-5 trends que estão crescendo e impactando o segment
2. Avaliar relevância de CADA trend para resolver o problema específico
3. Descrever COMO aproveitar cada trend (não apenas "está em alta")
4. Alertar sobre armadilhas e trends saturados
5. Encontrar COMBINAÇÕES de trends (synergy)

REGRAS CRÍTICAS:
- Nunca liste trends genéricos ("social media é importante")
- Sempre cite dados ou observações que fundamentem o trend (exemplo: "Short-form video cresceu 300% no TikTok em 2025")
- Associe trend AO PROBLEMA: não é "AI está em alta" mas "AI reduz tempo de onboarding em 60%"
- Diferencie: trend emergente vs consolidado vs saturado
- Scores DEVEM SER JUSTIFICADOS (0-10 scale)

TREND ANATOMY (obrigatório):
- Name: Formato "categoria: descrição" (ex: "Video Format: TikTok-style shorts")
- Description: 1-2 sentenças claras
- Relevance Score: 0-10 com justificativa numérica
- Opportunity: Como usar este trend para VENDER
- Risk: O que pode dar errado (ou null se sem risco)
- Timeline: Quando está em pico (agora? próximos 3 meses?)

CONFIDENCE:
- Alta (>0.8) se trends são óbvios e bem-documentados
- Média (0.6-0.8) se requer validação com dados
- Baixa (<0.6) se especulação ou trends muito emergentes

ESTRUTURA DE RESPOSTA OBRIGATÓRIA (JSON válido):
{
  "trends": [
    {
      "trend_id": "uuid",
      "name": "string: nome do trend",
      "description": "string: descrição clara",
      "relevance_score": 0-10,
      "relevance_rationale": "string: por que é relevante",
      "opportunity": "string: como aproveitar",
      "risk": "string ou null",
      "expected_timeline": "string: quando está em pico"
    }
    ... (mínimo 2 trends, máximo 5)
  ],
  "primary_trend": "string: qual é o main trend",
  "killer_combo": "string (optional): combinação sinérgica",
  "warnings": ["string": trends a evitar ou saturados],
  "confidence": 0.0-1.0
}

NENHUM TEXTO FORA DO JSON. Retorne APENAS JSON válido.`;
  }

  /**
   * ── USER PROMPT ──────────────────────────────────────────
   * Estrutura core_problem + segment + contexto para análise
   */
  buildUserPrompt(context: CampaignContext): string {
    const brief = context.brief;
    const interpreted = context.interpretedBrief as any;
    const icp = context.icp as any;
    const memory = context.memory;

    // Recuperar trends similares da memória (para comparação)
    const similarContext =
      memory?.similarCampaigns && memory.similarCampaigns.length > 0
        ? `Campanhas similares no histórico:\n${memory.similarCampaigns
            .map((c: any) => `- "${c.client}" resolveu problema similar com trends: ${c.trends || "N/A"}`)
            .join("\n")}`
        : "Nenhuma campanha similar no histórico.";

    // Se houver hooks vencedores, mencionem contexto de trends
    const winningHooks =
      memory?.winningHooks && memory.winningHooks.length > 0
        ? `Hooks que funcionaram bem:\n${memory.winningHooks
            .map((h: any) => `- "${h.hook}" (CTR: ${h.ctr}, formato: ${h.format})`)
            .join("\n")}`
        : "Nenhum hook histórico disponível.";

    return `CONTEXTO DO PROBLEMA E AUDIENCE:
═══════════════════════════════════════════════════════════

PROBLEMA CORE:
${interpreted?.core_problem || "NÃO INFORMADO"}

OBJETIVO:
${interpreted?.measurable_goal ? `${(interpreted.measurable_goal as any).metric} → ${(interpreted.measurable_goal as any).target} em ${(interpreted.measurable_goal as any).timeframe}` : "NÃO INFORMADO"}

SEGMENT ALVO:
${icp?.segment || "NÃO INFORMADO"}

LANGUAGE & DEVICE:
${icp?.language_profile || "NÃO INFORMADO"} | Device: ${icp?.device || "NÃO INFORMADO"}

PLATAFORMAS:
${icp?.platforms ? (icp.platforms as string[]).join(", ") : "NÃO INFORMADO"}

PAIN POINTS DO SEGMENT:
${icp?.pain_points ? (icp.pain_points as string[]).map((pp) => `• ${pp}`).join("\n") : "NÃO INFORMADO"}

CONTEXTO DA MEMÓRIA:
───────────────────────────────────────────────────────────
${similarContext}

${winningHooks}

INSTRUÇÕES:
1. Baseado no problema + segment acima, identifique 2-5 trends RELEVANTES
2. Cada trend deve estar CONECTADO ao problema (não genérico)
3. Avalie relevância de 0-10 com justificativa numérica
4. Descreva como aproveitar cada trend para VENDER
5. Identifique riscos ou armadilhas
6. Encontre uma "killer combo" de trends sinérgicos, se possível
7. Liste trends a EVITAR (saturados ou contraproducentes)
8. Confidence: alta se baseado em dados, baixa se especulação

EXEMPLO de trend BOAS (não use, apenas referência):
✓ "Short-form video adoption in B2B": Crescimento 300% em vídeos <1min no LinkedIn 2024-2025
✓ "UGC (User-Generated Content) over Brand Content": 80% das gerações confia mais em UGC que ads
✓ "Niche Community Marketing": Migração de broad audiences para micro-comunidades específicas

EXEMPLO de trend RUINS (evitar):
✗ "Social media is important" (genérico)
✗ "People like visuals" (óbvio)
✗ "Mobile first" (consolidado, não trend)

RESPONDA APENAS COM JSON VÁLIDO:`;
  }

  /**
   * ── OVERRIDE: run() com inicialização de workspace ────────
   */
  async run(context: CampaignContext): Promise<AgentOutput> {
    // Initialize workspace (evita erro de abstract property no constructor)
    this.initWorkspace();

    // Memória: carregar contexto para análise
    if (!context.memory) {
      try {
        const interpreted = context.interpretedBrief as any;
        const icp = context.icp as any;
        const searchQuery = String(interpreted?.core_problem || icp?.segment || context.brief.goal);
        context.memory = await this.getMemoryContext(searchQuery);
      } catch (err) {
        console.warn(
          `[${this.role}] ⚠ Não conseguiu carregar memória para contexto:`,
          err
        );
        context.memory = {
          similarCampaigns: [],
          winningHooks: [],
          audienceInsights: [],
        };
      }
    }

    // Executar lógica padrão do BaseAgent
    return super.run(context);
  }
}
