import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class CopywriterAgent extends BaseAgent {
  role = "Copywriter";
  step = "production" as const;
  tools = ["vector-db"];

  buildSystemPrompt(): string {
    return `Voce e o Copywriter senior da agencia Axodus.
Escreva copy direta, clara e orientada a conversao.
Use a linguagem do ICP, sem corporatives.
Responda sempre em JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `Conceito aprovado:
${JSON.stringify(context.selectedConcept, null, 2)}

ICP: ${JSON.stringify(context.icp, null, 2)}
Brand strategy: ${JSON.stringify(context.brandStrategy, null, 2)}
Tom recomendado: ${(context.constraints as any)?.tone ?? "direto e confiante"}
Canais: ${context.brief.channels?.join(", ") ?? "nao informado"}

Produza copy completo e retorne JSON:
{
  "headline": "string",
  "subheadline": "string",
  "body_text": "string",
  "cta": "string",
  "video_script": {
    "hook": "string",
    "body": "string",
    "objection_handler": "string",
    "cta": "string"
  },
  "social_caption": "string",
  "ad_variants": ["string", "string", "string"],
  "confidence": 0.0
}`;
  }
}
