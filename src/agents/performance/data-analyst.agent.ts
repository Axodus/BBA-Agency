import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class DataAnalystAgent extends BaseAgent {
  role = "DataAnalyst";
  step = "validation" as const;
  tools = ["analytics", "bigquery"];

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
  "rankedConcepts": [
    {
      "conceptId": "string",
      "rank": 1,
      "predictedCTR": "string",
      "icpAdherence": 0,
      "viralPotential": 0,
      "benchmarkComparison": "string",
      "risks": ["string"],
      "validationScore": 0
    }
  ],
  "recommendation": "string",
  "killList": ["string"],
  "confidence": 0.0
}`;
  }
}
