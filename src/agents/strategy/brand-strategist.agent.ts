// ─────────────────────────────────────────────────────────────
// AXODUS — Brand Strategist Agent
// FASE 4.4: Traduz ICP + trends em posicionamento acionavel
// ─────────────────────────────────────────────────────────────

import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types/index";

/**
 * ── BRAND STRATEGIST AGENT ────────────────────────────────
 * Função: transformar audience + trends em posicionamento,
 * mensagem central e pilares para creative/copy.
 */
export class BrandStrategistAgent extends BaseAgent {
  role = "BrandStrategist";
  step = "branding" as const;
  tools = ["vector-db"];

  buildSystemPrompt(): string {
    return `Voce e o BrandStrategist da agencia Axodus.
Sua unica funcao e transformar ICP + trends em um posicionamento claro e acionavel.

OBJETIVO:
1. Definir uma frase de posicionamento que conecte problema, audiencia e diferenciacao
2. Traduzir esse posicionamento em proposta de valor clara
3. Escolher pilares de mensagem que guiem creative e copy
4. Listar provas e argumentos que sustentam a promessa
5. Recomendar o melhor angulo de CTA para este ICP

REGRAS CRITICAS:
- Nao escreva branding generico, aspiracional ou vago
- O posicionamento precisa ser especifico para o contexto desta campanha
- Cada pilar de mensagem precisa ser util para o time criativo operar
- Diferenciais precisam ser defendiveis, nao slogans vazios
- Use linguagem proxima do ICP, nao linguagem institucional

ESTRUTURA DE RESPOSTA OBRIGATORIA:
{
  "brand_positioning_statement": "string",
  "value_proposition": "string",
  "differentiators": ["string", "string"],
  "messaging_pillars": ["string", "string", "string"],
  "proof_points": ["string", "string"],
  "recommended_cta_angle": "string",
  "confidence": 0.0-1.0
}

RESPONDA APENAS COM JSON VALIDO.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    const brief = context.brief;
    const icp = context.icp as any;
    const interpreted = context.interpretedBrief as any;
    const trends = context.trends ?? [];

    const trendLines =
      trends.length > 0
        ? trends
            .map(
              (trend) =>
                `- ${trend.name} | score ${trend.relevance_score}/10 | oportunidade: ${trend.opportunity}`
            )
            .join("\n")
        : "Nenhum trend estruturado disponivel.";

    return `CONTEXTO:
Cliente: ${brief.client}
Objetivo: ${brief.goal}
Core problem: ${interpreted?.core_problem ?? "NAO INFORMADO"}
Segment: ${icp?.segment ?? "NAO INFORMADO"}
Pain points:
${icp?.pain_points?.map((pain: string) => `- ${pain}`).join("\n") ?? "NAO INFORMADO"}

LANGUAGE PROFILE:
${icp?.language_profile ?? icp?.language ?? "NAO INFORMADO"}

TRENDS RELEVANTES:
${trendLines}

INSTRUCOES:
1. Crie um posicionamento para esta campanha, nao para a marca inteira em abstrato
2. Reflita o problema real e a tensao principal do ICP
3. Construa pilares de mensagem usaveis por CreativeDirector e Copywriter
4. Liste provas que reduzam risco percebido
5. Recomende um CTA angle coerente com a maturidade do ICP

RESPONDA APENAS COM JSON VALIDO.`;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();

    if (!context.memory) {
      try {
        const icpSegment = context.icp?.segment ?? context.brief.client;
        context.memory = await this.getMemoryContext(icpSegment);
      } catch (err) {
        console.warn(`[${this.role}] Nao conseguiu carregar memoria de apoio:`, err);
        context.memory = {
          similarCampaigns: [],
          winningHooks: [],
          audienceInsights: [],
        };
      }
    }

    return super.run(context);
  }
}
