import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class CreativeDirectorAgent extends BaseAgent {
  role = "CreativeDirector";
  step = "ideation" as const;
  tools = ["vector-db"];

  buildSystemPrompt(): string {
    return `Voce e o Creative Director da agencia Axodus.
Gere multiplos conceitos de campanha realmente divergentes.
Cada conceito precisa de hook, narrativa, emocao, formato e score de viralidade com justificativa.
Use o posicionamento de marca como filtro para decidir o angulo criativo.
Baseie-se nos hooks vencedores da memoria, mas sem repetir.
Responda sempre em JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `ICP definido: ${JSON.stringify(context.icp, null, 2)}
Brand strategy: ${JSON.stringify(context.brandStrategy, null, 2)}
Trends relevantes: ${JSON.stringify(context.trends ?? [], null, 2)}
Cliente: ${context.brief.client}
Goal: ${context.brief.goal}
Orcamento: ${context.brief.budget ?? "nao informado"}
Canais: ${context.brief.channels?.join(", ") ?? "nao informado"}

Hooks vencedores da memoria:
${context.memory?.winningHooks?.map((hook) => `- "${hook}"`).join("\n") || "nenhum"}

Gere 4 conceitos completamente diferentes e retorne JSON:
{
  "concepts": [
    {
      "title": "string",
      "concept_id": "uuid",
      "hook": "string",
      "narrative": "string",
      "emotion": "string",
      "format": "video_15s|video_30s|carrossel|static|ugc|meme",
      "viral_score": 0,
      "viral_rationale": "string",
      "target_pain": "string"
    }
  ],
  "recommendation": "string",
  "confidence": 0.0
}`;
  }
}
