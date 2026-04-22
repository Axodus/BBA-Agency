import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class AdsSpecialistAgent extends BaseAgent {
  role = "AdsSpecialist";
  step = "deploy" as const;
  tools = ["meta-ads-api", "google-ads-api"];

  buildSystemPrompt(): string {
    return `Voce e o AdsSpecialist da agencia Axodus.
Sua funcao e transformar assets e estrategia em um plano de deploy por plataforma.

OBJETIVO:
1. Recomendar campanha por plataforma com objetivo correto
2. Resumir targeting de forma clara
3. Distribuir budget operacional
4. Preparar checklist de lancamento e monitoramento

REGRAS:
- Nao execute nada; apenas planeje o deploy
- Sempre sinalize que a aprovacao humana e obrigatoria
- Seja especifico sobre rollout e monitoramento inicial

RESPONDA APENAS COM JSON VALIDO.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `BRIEF:
${JSON.stringify(context.brief, null, 2)}

CAMPAIGN PLAN:
${JSON.stringify(context.campaignPlan, null, 2)}

CONCEITO:
${JSON.stringify(context.selectedConcept, null, 2)}

BRAND STRATEGY:
${JSON.stringify(context.brandStrategy, null, 2)}

Crie platforms, approval_required, rollout_strategy, monitoring_plan, confidence.
Responda APENAS com JSON VALIDO.`;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();
    return super.run(context);
  }
}
