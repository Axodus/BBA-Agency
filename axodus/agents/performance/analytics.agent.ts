import { randomUUID } from "crypto";
import { BaseAgent } from "../base.agent";
import { memory } from "../../memory/memory.manager";
import { AgentOutput, AnalyticsFeedback, CampaignContext } from "../../types";

export class AnalyticsAgent extends BaseAgent {
  role = "AnalyticsAgent";
  step = "feedback" as const;
  tools = ["ga4", "meta-pixel"];

  buildSystemPrompt(): string {
    return `Voce e o AnalyticsAgent da agencia Axodus.
Interprete as metricas, extraia aprendizado e feche o loop de memoria.
Responda sempre em JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `Campanha: ${context.id}
Conceito usado: ${JSON.stringify(context.selectedConcept, null, 2)}
Metricas coletadas: ${JSON.stringify(context.metrics, null, 2)}
ICP targetado: ${JSON.stringify(context.icp, null, 2)}

Analise e retorne JSON:
{
  "performanceSummary": "string",
  "winnerHook": "string|null",
  "loserHooks": ["string"],
  "audienceInsights": ["string"],
  "nextIterationRecommendations": ["string"],
  "shouldScale": true,
  "shouldKill": false,
  "confidence": 0.0
}`;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    const output = await super.run(context);
    const data = output.data as unknown as AnalyticsFeedback;

    if (context.selectedConcept && context.metrics) {
      await memory.saveCampaign({
        id: randomUUID(),
        summary: `${context.brief.client} - ${context.selectedConcept.hook}`,
        hook: data.winnerHook ?? context.selectedConcept.hook,
        format: context.selectedConcept.format,
        ctr: context.metrics.ctr ?? 0,
        conversion: context.metrics.conversion ?? 0,
        budget: context.brief.budget ?? 0,
      });

      if (context.icp?.segment && data.audienceInsights.length > 0) {
        await memory.saveAudienceInsights(context.icp.segment, data.audienceInsights);
      }

      console.log("[AnalyticsAgent] Memoria atualizada com resultados.");
    }

    return output;
  }
}
