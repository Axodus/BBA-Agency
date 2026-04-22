// ─────────────────────────────────────────────────────────────
// AXODUS — Audience Profiler Agent
// FASE 4.2: Constrói ICP (Ideal Customer Profile) baseado em core_problem
// ─────────────────────────────────────────────────────────────

import { BaseAgent } from "../base.agent";
import { CampaignContext, AgentOutput } from "../../types/index";
import { v4 as uuid } from "uuid";

/**
 * ── AUDIENCE PROFILER AGENT ─────────────────────────────────
 * Função: Criar perfil detalhado de ICP a partir do problema identificado
 *
 * INPUT: core_problem (do BriefInterpreter)
 * OUTPUT: ICP com segment, painPoints, language, device, platforms, timing, triggers, objections
 *
 * Regra: Infira persona específica (nome, cargo, contexto) — não genérica
 */
export class AudienceProfilerAgent extends BaseAgent {
  role = "AudienceProfiler";
  step = "strategy" as const;
  tools = ["analytics-ga4", "meta-pixel", "vector-db"];

  /**
   * ── SYSTEM PROMPT ────────────────────────────────────────
   * Define o contexto e regras para Claude construir ICP
   */
  buildSystemPrompt(): string {
    return `Você é o AudienceProfiler da agência Axodus.
Sua ÚNICA função é transformar um problema identificado em um perfil detalhado de cliente ideal (ICP).

OBJETIVO:
1. Criar uma persona ESPECÍFICA (não genérica) baseada no problema
2. Detalhar pain points que essa persona enfrenta
3. Definir como essa persona FALA (language profile)
4. Identificar quando e onde essa pessoa consome conteúdo
5. Descrever o que DISPARA a decisão de compra
6. Listar objeções comuns que precisam ser superadas

PERSONA ESPECÍFICA (NÃO genérica):
❌ ERRADO: "Pequenos empresários"
✅ CERTO: "Donos de agência digital com 5-20 pessoas, que estão crescendo mas sofrem com CRM desorganizado"

REGRAS CRÍTICAS:
- Sempre crie uma persona NOMEÁVEL e VISUALIZÁVEL
- Pain points devem ser específicos ao contexto do problema (não genéricos)
- Language profile deve refletir como essa pessoa FALA (gírias, termos técnicos, etc)
- Device e platforms devem ser baseados em comportamento dessa persona (não assumir "todos usam mobile")
- Timing deve ser específico ("Segunda-feira pela manhã no LinkedIn durante café" vs "qualquer hora")
- Buying triggers devem ser sinais reais que disparam ação (não genérico "preço")
- Confidence: alta se persona é CLARA (>0.8), média se requer validação (0.6-0.8), baixa se muita especulação (<0.6)

ESTRUTURA DE RESPOSTA OBRIGATÓRIA (JSON válido):
{
  "audience_id": "uuid",
  "segment": "string: descrição específica da persona + contexto",
  "pain_points": ["string": mínimo 2, específicos ao problema"],
  "language_profile": "string: como essa pessoa fala (tom, gírias, termos, estilo)",
  "device": "enum: 'mobile'|'desktop'|'both'",
  "platforms": ["string": onde essa persona consome conteúdo regularmente],
  "timing": "string: quando essa pessoa está online/receptiva (dia/hora/contexto)",
  "buying_triggers": ["string": sinais que disparam decisão de compra"],
  "objections": ["string": objeções comuns que precisam ser superadas],
  "confidence": 0.0-1.0
}

NENHUM TEXTO FORA DO JSON. Retorne APENAS JSON válido.`;
  }

  /**
   * ── USER PROMPT ──────────────────────────────────────────
   * Estrutura o core_problem + contexto para análise de audience
   */
  buildUserPrompt(context: CampaignContext): string {
    const brief = context.brief;
    const interpreted = context.interpretedBrief as any;
    const memory = context.memory;

    // Recuperar ICPs similares da memória (para comparação)
    const similarContext =
      memory?.similarCampaigns && memory.similarCampaigns.length > 0
        ? `ICPs de campanhas similares:\n${memory.similarCampaigns
            .map(
              (c: any) =>
                `- Cliente: "${c.client}", Periodo: ${c.period || "N/A"}`
            )
            .join("\n")}`
        : "Nenhum ICP similar na memória.";

    // Se houver insights ocultos, use-os
    const hiddenInsights =
      interpreted && interpreted.hidden_insights && interpreted.hidden_insights.length > 0
        ? `Insights Ocultos Identificados:\n${interpreted.hidden_insights.map((i: string) => `- ${i}`).join("\n")}`
        : "";

    return `PROBLEMA IDENTIFICADO (CORE_PROBLEM):
═══════════════════════════════════════════════════════════

Problema: ${interpreted?.core_problem || "NÃO INFORMADO"}
Meta Mensurável: ${interpreted?.measurable_goal ? `${(interpreted.measurable_goal as any).metric} → ${(interpreted.measurable_goal as any).target} em ${(interpreted.measurable_goal as any).timeframe}` : "NÃO INFORMADA"}
Restrições: ${interpreted?.brand_voice_constraints ? (interpreted.brand_voice_constraints as string[]).join(", ") : "NÃO INFORMADAS"}

${hiddenInsights}

CONTEXTO DO CLIENTE:
───────────────────────────────────────────────────────────
Cliente: ${brief.client}
Orçamento: ${brief.budget ? `R$ ${brief.budget}` : "NÃO INFORMADO"}
Canais Preferidos: ${brief.channels && brief.channels.length > 0 ? brief.channels.join(", ") : "NÃO INFORMADO"}
Deadline: ${brief.deadline || "NÃO INFORMADO"}

CONTEXTO DA MEMÓRIA:
───────────────────────────────────────────────────────────
${similarContext}

INSTRUÇÕES:
1. Baseado no problema identificado, crie uma persona ESPECÍFICA e NOMEÁVEL
2. Detale pain points que essa persona enfrenta RELACIONADOS ao problema
3. Defina como essa persona fala (tom, gírias, termos técnicos específicos)
4. Identifique o device PRIMARY (mobile/desktop) e contexto de uso
5. Liste plataformas onde essa persona consome conteúdo (LinkedIn, Instagram, Google, etc)
6. Especifique QUANDO essa persona está online e receptiva (dia da semana + hora)
7. Descreva o que realmente DISPARA a decisão de compra para essa persona
8. Liste objeções comuns que precisam ser endereçadas
9. Confidence: alta se persona é CLARA e bem-definida, baixa se especulação

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
        const searchQuery = String(interpreted?.core_problem || context.brief.goal);
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
