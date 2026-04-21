import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class BriefInterpreterAgent extends BaseAgent {
  role = "BriefInterpreter";
  step = "interpret" as const;
  tools = ["notion-mcp"];

  buildSystemPrompt(): string {
    return `Voce e o BriefInterpreter da agencia Axodus.
Sua unica funcao e pegar um briefing bruto e extrair:
1. O problema real
2. O objetivo mensuravel
3. As restricoes
4. O que nao esta sendo dito

Responda sempre em JSON valido e sem texto fora do JSON.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `Briefing recebido:
---
Cliente: ${context.brief.client}
Objetivo declarado: ${context.brief.goal}
Texto bruto: ${context.brief.rawText}
Orcamento: ${context.brief.budget ?? "nao informado"}
Canais: ${context.brief.channels?.join(", ") ?? "nao informado"}
---

Campanhas similares na memoria:
${
  context.memory?.similarCampaigns
    .map((campaign) => `- Hook: "${campaign.hook}" | CTR: ${campaign.ctr}`)
    .join("\n") ?? "nenhuma"
}

Retorne JSON:
{
  "realProblem": "string",
  "measurableGoal": { "metric": "string", "target": "string", "timeframe": "string" },
  "constraints": { "budget": 0, "channels": ["string"], "tone": "string", "deadline": "string|null" },
  "hiddenInsights": ["string"],
  "confidence": 0.0,
  "nextSteps": ["string"]
}`;
  }
}
