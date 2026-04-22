// ─────────────────────────────────────────────────────────────
// AXODUS — Parallel Ideation Engine
// DIRETRIZ 3: Divergência paralela com 3 instâncias (conservative/balanced/experimental)
// ─────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { CampaignContext, CreativeConcept } from "../../types/index";
import { CostAuditor } from "../../utils/cost-auditor";
import { generateMockAgentPayload } from "../../utils/mock-agent";
import { v4 as uuid } from "uuid";

interface IdeationInstance {
  temperature: number; // top_p
  label: "conservative" | "balanced" | "experimental";
  systemPromptModifier: string;
}

/**
 * ── 3 INSTÂNCIAS PARALELAS ────────────────────────────────────
 * conservative (0.3):  conceitos seguros, alta aderência ao brief, baixo risco
 * balanced (0.7):      equilíbrio criatividade/risco
 * experimental (1.0):  ideias radicais, alto risco/reward, quebra padrões
 */
const IDEATION_INSTANCES: IdeationInstance[] = [
  {
    temperature: 0.3,
    label: "conservative",
    systemPromptModifier:
      "Foque em conceitos SEGUROS que seguem fórmulas já comprovadas. Máxima aderência ao ICP. Mínimo risco.",
  },
  {
    temperature: 0.7,
    label: "balanced",
    systemPromptModifier:
      "Equilíbrio entre inovação e segurança. Conceitos que funcionam mas com um twist criativo.",
  },
  {
    temperature: 1.0,
    label: "experimental",
    systemPromptModifier:
      "Quebra todos os padrões. Conceitos RADICAIS que ninguém espera. Alto risco, alto reward. Vire a mesa.",
  },
];

export class ParallelIdeationEngine {
  private client?: Anthropic;
  private model = "claude-sonnet-4-20250514";
  private costAuditor?: CostAuditor;

  constructor(costAuditor?: CostAuditor) {
    this.costAuditor = costAuditor;
    if (process.env.ANTHROPIC_API_KEY && !process.env.USE_MOCK_LLM) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
  }

  /**
   * ── DIVERGE: Dispara 3 instâncias em paralelo ─────────────
   * Retorna todos os conceitos + organizados por instância
   */
  async diverge(context: CampaignContext): Promise<{
    allConcepts: CreativeConcept[];
    byInstance: Record<string, CreativeConcept[]>;
  }> {
    console.log("[Ideation] 🔀 Disparando 3 instâncias paralelas...\n");

    // Executar em paralelo
    const promises = IDEATION_INSTANCES.map((instance) =>
      this.runInstance(context, instance)
        .then((concepts) => ({ instance: instance.label, concepts, error: null }))
        .catch((error) => ({ instance: instance.label, concepts: [], error }))
    );

    const results = await Promise.all(promises);

    // Consolidar resultados
    const allConcepts: CreativeConcept[] = [];
    const byInstance: Record<string, CreativeConcept[]> = {};

    for (const result of results) {
      if (result.error) {
        console.error(`  ✗ ${result.instance}: ${result.error.message}`);
      } else {
        byInstance[result.instance] = result.concepts;
        allConcepts.push(...result.concepts);
        console.log(`  ✓ ${result.instance}: ${result.concepts.length} conceitos`);
      }
    }

    console.log(`\n[Ideation] ✓ Total: ${allConcepts.length} conceitos para convergência\n`);

    return { allConcepts, byInstance };
  }

  /**
   * ── RUN INSTANCE: Executa uma instância com top_p específica ─
   */
  private async runInstance(
    context: CampaignContext,
    instance: IdeationInstance
  ): Promise<CreativeConcept[]> {
    if (!this.client) {
      return this.runMockInstance(context, instance);
    }

    const systemPrompt = this.buildSystemPrompt(instance);
    const userPrompt = this.buildPrompt(context, instance);

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        temperature: instance.temperature as any,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      // Extract JSON
      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Claude não retornou texto");
      }

      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Não conseguiu extrair JSON da resposta");
      }

      const raw = JSON.parse(jsonMatch[0]);
      const concepts = (raw.concepts ?? []) as any[];
      this.recordUsage(instance, response.usage?.input_tokens ?? 0, response.usage?.output_tokens ?? 0);

      // Validar e mapear para CreativeConcept
      return concepts
        .map((c) => ({
          id: c.concept_id ?? uuid(),
          concept_id: c.concept_id ?? uuid(),
          title: c.title ?? `Conceito ${instance.label}`,
          hook: c.hook ?? "",
          narrative: c.narrative ?? "",
          emotion: c.emotion ?? "neutral",
          format: c.format ?? "static",
          viralScore: c.viral_score ?? 5,
          viral_score: c.viral_score ?? 5,
          validationScore: 0, // será preenchido pelo DataAnalyst
          validation_score: 0,
          target_pain: c.target_pain ?? "",
          temperature_used: instance.temperature,
          viral_rationale: c.viral_rationale ?? "",
        }))
        .slice(0, 2); // Máx 2 por instância (total: 6)
    } catch (err) {
      throw new Error(`[${instance.label}] ${(err as Error).message}`);
    }
  }

  private runMockInstance(
    context: CampaignContext,
    instance: IdeationInstance
  ): CreativeConcept[] {
    const payload = generateMockAgentPayload("CreativeDirector", context);
    const concepts = ((payload.concepts as CreativeConcept[] | undefined) ?? []).slice(0, 2);
    const labelOffset =
      instance.label === "conservative" ? 0 : instance.label === "balanced" ? 1 : 2;

    const output = concepts.map((concept, index) => ({
      ...concept,
      id: uuid(),
      concept_id: uuid(),
      title: `${concept.title} [${instance.label}]`,
      viralScore: Math.max(0, Math.min(10, (concept.viralScore ?? concept.viral_score ?? 5) - 0.3 + labelOffset * 0.2 + index * 0.1)),
      viral_score: Math.max(0, Math.min(10, (concept.viral_score ?? concept.viralScore ?? 5) - 0.3 + labelOffset * 0.2 + index * 0.1)),
      temperature_used: instance.temperature,
    }));

    const inputTokens = Math.max(1, Math.ceil((this.buildSystemPrompt(instance) + this.buildPrompt(context, instance)).length / 4));
    const outputTokens = Math.max(1, Math.ceil(JSON.stringify(output).length / 4));
    this.recordUsage(instance, inputTokens, outputTokens);

    return output;
  }

  private recordUsage(
    instance: IdeationInstance,
    input_tokens: number,
    output_tokens: number
  ): void {
    if (!this.costAuditor) {
      return;
    }

    this.costAuditor.record({
      agent: `ParallelIdeation:${instance.label}`,
      step: "ideation",
      input_tokens,
      output_tokens,
    });
  }

  /**
   * ── SYSTEM PROMPT ────────────────────────────────────────
   */
  private buildSystemPrompt(instance: IdeationInstance): string {
    return `Você é um Creative Director da agência Axodus.
Sua função: gerar conceitos criativos para campanhas de marketing.

MODO ATIVO: ${instance.label.toUpperCase()}
${instance.systemPromptModifier}

REGRAS OBRIGATÓRIAS:
1. Gere EXATAMENTE 2 conceitos RADICALMENTE diferentes entre si
2. Cada conceito precisa: hook (máx 15 palavras), narrativa, emoção, formato, viral_score (0-10)
3. Responda APENAS em JSON válido
4. Nenhum texto fora do JSON

ESTRUTURA DE CADA CONCEITO:
{
  "title": "Nome do conceito",
  "hook": "Frase que para o scroll (máx 15 palavras)",
  "narrative": "Texto narrativo do conceito",
  "emotion": "Emoção dominante",
  "format": "video_15s|video_30s|carrossel|static|ugc|meme",
  "viral_score": 0-10,
  "viral_rationale": "Por que esse score?",
  "target_pain": "Qual pain point endereça"
}`;
  }

  /**
   * ── USER PROMPT ──────────────────────────────────────────
   */
  private buildPrompt(context: CampaignContext, instance: IdeationInstance): string {
    const brief = context.brief;
    const icp = context.icp;
    const memory = context.memory;

    return `BRIEFING:
Cliente: ${brief.client}
Goal: ${brief.goal}
Orçamento: ${brief.budget ?? "não informado"} 
Canais: ${brief.channels?.join(", ") ?? "não informado"}

ICP:
${JSON.stringify(icp, null, 2)}

MEMÓRIA (hooks vencedores anteriormente):
${memory?.winningHooks?.map((h: string) => `- "${h}"`).join("\n") ?? "Nenhum — primeira campanha"}

INSTRUÇÃO:
Gere 2 conceitos no modo ${instance.label.toUpperCase()}.
${instance.label === "conservative" ? "Maximizar aderência e ROI comprovado." : ""}
${instance.label === "experimental" ? "Quebrar padrões. Ser radical. Surpreender." : ""}

Responda APENAS com JSON (estrutura array de conceitos):
{ "concepts": [...] }`;
  }
}
