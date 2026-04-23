// ─────────────────────────────────────────────────────────────
// AXODUSBBA — CreativeDirectorAgent (Fase 4.5)
// DIRETRIZ 4: Ideação paralela com 3 instâncias (conservative/balanced/experimental)
// ─────────────────────────────────────────────────────────────

import { BaseAgent } from "../base.agent";
import { CampaignContext, AgentOutput, CreativeConcept } from "../../types/index";
import { ParallelIdeationEngine } from "./parallel-ideation.engine";
import { IdeationOutputSchema } from "../../contracts/schemas";
import { v4 as uuid } from "uuid";

/**
 * ── CREATIVE DIRECTOR AGENT ────────────────────────────────────
 * Responsável por gerar 6 conceitos criativos (2 por instância: conservative, balanced, experimental)
 * usando o ParallelIdeationEngine. Valida o output contra IdeationOutputSchema e integra com o memory system.
 */
export class CreativeDirectorAgent extends BaseAgent {
  role = "CreativeDirector" as const;
  step = "ideation" as const;
  tools = ["vector-db"];
  private ideationEngine: ParallelIdeationEngine;

  constructor() {
    super();
    this.ideationEngine = new ParallelIdeationEngine();
  }

  buildSystemPrompt(): string {
    return `
      Você é o CreativeDirector, um especialista em criar conceitos criativos para campanhas de marketing.
      Sua função é gerar 6 conceitos criativos (2 conservadores, 2 balanceados e 2 experimentais) com base no ICP e na estratégia de marca fornecidos.

      Regras importantes:
      1. Sempre considere o contexto de memória fornecido (conceitos vencedores similares).
      2. Os conceitos devem ser distintos e explorar diferentes abordagens (conservadora, balanceada, experimental).
      3. Cada conceito deve incluir:
         - Nome do conceito
         - Hook (máx 15 palavras)
         - Narrativa (descrição do conceito)
         - Emoção dominante
         - Formato (video_15s, video_30s, carrossel, static, ugc, meme)
         - Viral score (0-10) com justificativa
         - Pain point endereçado
      4. Forneça outputs estruturados conforme o schema IdeationOutputSchema.
      5. Inclua confidence score (0-1) para cada conceito.
      6. Não repita hooks ou conceitos já existentes na memória.
      7. Responda APENAS com JSON válido. Nenhum texto fora do JSON.
    `;
  }

  buildUserPrompt(context: CampaignContext): string {
    const icp = context.icp?.segment || "desconhecido";
    const brandStrategy = context.brandStrategy?.brand_positioning_statement || "desconhecida";
    const winningHooks = context.memory?.winningHooks || [];

    return `
      Contexto atual:
      - Campanha: ${context.brief?.id || "desconhecida"}
      - Cliente: ${context.brief?.client || "desconhecido"}
      - ICP: ${icp}
      - Estratégia de Marca: ${brandStrategy}
      - Goal: ${context.brief?.goal || "não informado"}
      - Orçamento: ${context.brief?.budget || "não informado"}
      - Canais: ${context.brief?.channels?.join(", ") || "não informado"}

      Memória relevante (conceitos vencedores similares):
      ${winningHooks.length > 0 ? winningHooks.map((hook: string) => `- "${hook}"`).join("\n") : "Nenhuma memória semântica disponível"}

      Sua tarefa: Gere 6 conceitos criativos (2 conservadores, 2 balanceados e 2 experimentais) que ressoem com o ICP e estejam alinhados com a estratégia de marca.
      Os conceitos devem ser radicalmente diferentes entre si e explorar abordagens distintas.

      Estrutura esperada (JSON):
      {
        "concepts": [
          {
            "concept_id": "uuid",
            "title": "Nome do conceito",
            "hook": "Frase que para o scroll (máx 15 palavras)",
            "narrative": "Texto narrativo do conceito",
            "emotion": "Emoção dominante",
            "format": "video_15s|video_30s|carrossel|static|ugc|meme",
            "viral_score": 0,
            "viral_rationale": "Justificativa do score viral",
            "target_pain": "Qual pain point endereça"
          }
        ],
        "recommendation": "Qual conceito você escolheria e por quê?",
        "confidence": 0.8
      }
    `;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();
    console.log(`[${this.role}] ► Iniciando ideação paralela...`);

    // Carregar contexto de memória relevante
    if (!context.memory) {
      context.memory = await this.getMemoryContext(
        `client:${context.brief?.client || "unknown"},sector:general`
      );
    }

    const userPrompt = this.buildUserPrompt(context);
    const { byInstance } = await this.ideationEngine.diverge(context);

    // Estruturar o output conforme IdeationOutputSchema
    const output = {
      concepts: [
        ...byInstance.conservative || [],
        ...byInstance.balanced || [],
        ...byInstance.experimental || [],
      ],
      recommendation: this.generateRecommendation(byInstance),
      confidence: this.calculateAverageConfidence(byInstance),
    };

    // Validar output contra IdeationOutputSchema
    const validationResult = IdeationOutputSchema.safeParse(output);
    if (!validationResult.success) {
      console.error(`[${this.role}] ✗ Validação do schema falhou:`, validationResult.error);
      throw new Error(`Schema validation failed: ${JSON.stringify(validationResult.error.flatten())}`);
    }

    return {
      agentRole: this.role,
      step: this.step,
      timestamp: new Date().toISOString(),
      data: validationResult.data,
      confidence: validationResult.data.confidence,
    };
  }

  private generateRecommendation(byInstance: Record<string, CreativeConcept[]>): string {
    const allConcepts = [
      ...(byInstance.conservative || []),
      ...(byInstance.balanced || []),
      ...(byInstance.experimental || []),
    ];

    if (allConcepts.length === 0) {
      return "Nenhum conceito gerado. Revise o briefing e tente novamente.";
    }

    // Selecionar o conceito com maior viral_score
    const topConcept = allConcepts.reduce((prev, current) =>
      (prev.viral_score || prev.viralScore || 0) > (current.viral_score || current.viralScore || 0) ? prev : current
    );

    return `
      Recomendo o conceito "${topConcept.title}" (${topConcept.viral_score || topConcept.viralScore}/10) porque:
      - Endereça diretamente o pain point: "${topConcept.target_pain}"
      - Tem alto potencial viral: "${topConcept.viral_rationale}"
      - Está alinhado com a estratégia de marca e ICP.
    `;
  }

  private calculateAverageConfidence(byInstance: Record<string, CreativeConcept[]>): number {
    const allConcepts = [
      ...(byInstance.conservative || []),
      ...(byInstance.balanced || []),
      ...(byInstance.experimental || []),
    ];

    if (allConcepts.length === 0) return 0.7; // Default confidence

    const totalConfidence = allConcepts.reduce((sum, concept) => {
      const viralScore = concept.viral_score || concept.viralScore || 5;
      return sum + (viralScore / 10); // Normalizar para 0-1
    }, 0);

    return totalConfidence / allConcepts.length;
  }

  /**
   * Obtém contexto de memória relevante para a campanha atual.
   */
  /**
   * Obtém contexto de memória relevante para a campanha atual.
   * Sobrescreve o método da classe base para usar a assinatura padrão.
   */
  protected async getMemoryContext(query: string): Promise<any> {
    try {
      // Extrair client e sector da query string
      const clientMatch = query.match(/client:([^,]+)/);
      const sectorMatch = query.match(/sector:([^,]+)/);
      
      const client = clientMatch ? clientMatch[1] : "unknown";
      const sector = sectorMatch ? sectorMatch[1] : "unknown";
      
      const [winningHooks, similarCampaigns] = await Promise.all([
        this.callTool("vector-db", { action: "getWinningHooks", limit: 5 }),
        this.callTool("vector-db", { action: "findSimilarCampaigns", client, limit: 3 }),
      ]);

      return {
        winningHooks: winningHooks || [],
        similarCampaigns: similarCampaigns || [],
        audienceInsights: [], // Placeholder para futuras implementações
      };
    } catch (err) {
      console.warn(`[${this.role}] ⚠ Não conseguiu carregar memória:`, err);
      return {
        winningHooks: [],
        similarCampaigns: [],
        audienceInsights: [],
      };
    }
  }
}
