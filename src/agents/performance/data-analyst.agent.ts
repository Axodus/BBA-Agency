import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class DataAnalystAgent extends BaseAgent {
  role = "DataAnalyst";
  step = "validation" as const;
  tools = ["analytics-ga4", "bigquery"];

  buildSystemPrompt(): string {
    return `Voce e o DataAnalyst da agencia Axodus.
Valide conceitos criativos com dados, benchmarks e aderencia ao ICP.
Ranqueie os conceitos, descarte os fracos e justifique com evidencia.
Responda sempre em JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `ICP: ${JSON.stringify(context.icp, null, 2)}
Conceitos gerados: ${JSON.stringify(context.concepts, null, 2)}

Campanhas similares na memoria:
${
  context.memory?.similarCampaigns?.
    map(
      (campaign) =>
        `- Hook: "${campaign.hook}" | CTR: ${campaign.ctr} | Conv: ${campaign.conversion} | Budget: ${campaign.budget}`
    )
    .join("\n") || "nenhuma"
}

Avalie cada conceito e retorne JSON:
{
  "ranked_concepts": [
    {
      "concept_id": "uuid",
      "rank": 1,
      "validation_score": 0,
      "rationale": "string",
      "benchmark_comparison": "string"
    }
  ],
  "recommendation": "string",
  "kill_list": ["string"],
  "confidence": 0.0
}`;
  }
}
