import { BaseAgent } from "../base.agent";
import { CampaignContext } from "../../types";

export class AudienceProfilerAgent extends BaseAgent {
  role = "AudienceProfiler";
  step = "strategy" as const;
  tools = ["meta-api", "analytics"];

  buildSystemPrompt(): string {
    return `Voce e o AudienceProfiler da agencia Axodus.
Construa o ICP com precisao e valide hipoteses com memoria de campanhas anteriores.
Nunca invente fatos sem sinalizar baixa confianca.
Responda sempre em JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `Cliente: ${context.brief.client}
Problema real identificado: ${context.interpretedBrief?.realProblem ?? context.brief.rawText}

Insights de audiencia na memoria:
${context.memory?.audienceInsights.join("\n") || "nenhum"}

Construa o ICP e retorne JSON:
{
  "segment": "string",
  "painPoints": ["string", "string", "string"],
  "language": "string",
  "device": "mobile|desktop|both",
  "platforms": ["string"],
  "timing": "string",
  "buyingTriggers": ["string"],
  "objections": ["string"],
  "confidence": 0.0
}`;
  }
}
