import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class CopywriterAgent extends BaseAgent {
  role = "Copywriter";
  step = "production" as const;
  tools = ["claude-sonnet", "figma"];

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
Tom recomendado: ${context.constraints?.tone ?? "direto e confiante"}
Canais: ${context.brief.channels?.join(", ") ?? "nao informado"}

Produza copy completo e retorne JSON:
{
  "headline": "string",
  "subheadline": "string",
  "bodyText": "string",
  "cta": "string",
  "videoScript": {
    "hook": "string",
    "problem": "string",
    "solution": "string",
    "cta": "string"
  },
  "socialCaption": "string",
  "adVariants": ["string", "string", "string"],
  "confidence": 0.0
}`;
  }
}
