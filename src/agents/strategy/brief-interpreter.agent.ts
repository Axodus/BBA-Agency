// ─────────────────────────────────────────────────────────────
// AXODUS — Brief Interpreter Agent
// FASE 4.1: Extrai problema real, meta mensurável, restrições do brief bruto
// ─────────────────────────────────────────────────────────────

import { BaseAgent } from "../base.agent";
import { CampaignContext, AgentOutput } from "../../types/index";
import { v4 as uuid } from "uuid";

/**
 * ── BRIEF INTERPRETER AGENT ─────────────────────────────────
 * Função: Interpretar briefing bruto e extrair insights críticos
 *
 * INPUT: Brief com texto descriptivo
 * OUTPUT: core_problem, measurable_goal, constraints, hidden_insights
 *
 * Regra: Nunca assuma — se não está no brief, sinaliza com confiança baixa
 */
export class BriefInterpreterAgent extends BaseAgent {
  role = "BriefInterpreter";
  step = "interpret" as const;
  tools = ["notion-mcp"];

  /**
   * ── SYSTEM PROMPT ────────────────────────────────────────
   * Define o contexto e regras para Claude interpretar o brief
   */
  buildSystemPrompt(): string {
    return `Você é o BriefInterpreter da agência Axodus.
Sua ÚNICA função é transformar briefings BRUTOS em interpretações estruturadas.

OBJETIVO:
1. Identificar o PROBLEMA REAL (não o sintoma que o cliente descreveu)
2. Extrair o OBJETIVO MENSURÁVEL com métrica + target + timeframe
3. Listar AS RESTRIÇÕES (orçamento, canais, prazo, tom de voz)
4. Inferir O QUE NÃO ESTÁ SENDO DITO (insights críticos não óbvios)

REGRAS CRÍTICAS:
- Nunca INVENTE informações não presentes no brief
- Se falta dado essencial, use confiança BAIXA (< 0.7) e sinaliza na mensagem
- Diferencie sempre: sintoma vs problema real
- Busque a verdade escondida atrás do pedido do cliente
- Seja cético com métricas vagas ("aumentar vendas" ≠ "aumentar conversão em 15% em 30 dias")

ESTRUTURA DE RESPOSTA OBRIGATÓRIA (JSON válido):
{
  "core_problem": "string (10+ caracteres): o problema REAL identificado",
  "target_audience_id": "uuid: ID de referência",
  "measurable_goal": {
    "metric": "string: CTR|conversão|engagement|retention|awareness",
    "target": "string: número com unidade (ex: '15%', '1000 leads')",
    "timeframe": "string: '30 dias', '1 trimestre', etc"
  },
  "brand_voice_constraints": ["string": restrições de tom (formal|casual|técnico|etc)"],
  "hidden_insights": ["string": inferências não óbvias"],
  "confidence": 0.0-1.0
}

NENHUM TEXTO FORA DO JSON. Retorne APENAS JSON válido.`;
  }

  /**
   * ── USER PROMPT ──────────────────────────────────────────
   * Estrutura o brief bruto + contexto para análise
   */
  buildUserPrompt(context: CampaignContext): string {
    const brief = context.brief;
    const memory = context.memory;

    // Recuperar briefings similares da memória (para comparação)
    const similarContext =
      memory?.similarCampaigns && memory.similarCampaigns.length > 0
        ? `Briefings similares anteriores:\n${memory.similarCampaigns
            .map(
              (c) =>
                `- Cliente anterior: "${c.hook}" no formato ${c.format} (CTR: ${c.ctr})`
            )
            .join("\n")}`
        : "Nenhum briefing similar na memória.";

    return `BRIEFING RECEBIDO:
═══════════════════════════════════════════════════════════

Cliente: ${brief.client}
Objetivo Declarado: ${brief.goal}
Orçamento: ${brief.budget ? `R$ ${brief.budget}` : "NÃO INFORMADO"}
Canais Solicitados: ${brief.channels && brief.channels.length > 0 ? brief.channels.join(", ") : "NÃO INFORMADO"}
Deadline: ${brief.deadline || "NÃO INFORMADO"}

TEXTO DO BRIEF (BRUTO):
───────────────────────────────────────────────────────────
${brief.rawText}
───────────────────────────────────────────────────────────

CONTEXTO DA MEMÓRIA:
───────────────────────────────────────────────────────────
${similarContext}

INSTRUÇÕES:
1. Analise o texto acima com ceticismo saudável
2. Identifique o problema REAL (talvez não seja o que o cliente acha)
3. Extraia meta mensurável (ou sinaliza confiança baixa se vaga)
4. Liste restrições explícitas e implícitas
5. Infira insights não-óbvios (por que o cliente está aqui REALMENTE?)
6. Confidence: alta se tudo claro (>0.8), média se precisa validação (0.6-0.8), baixa se muitas lacunas (<0.6)

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
        context.memory = await this.getMemoryContext(context.brief.goal);
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
