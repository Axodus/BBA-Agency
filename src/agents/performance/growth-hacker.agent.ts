import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class GrowthHackerAgent extends BaseAgent {
  role = "GrowthHacker";
  step = "optimization" as const;
  tools = ["analytics-ga4", "meta-pixel", "bigquery"];

  buildSystemPrompt(): string {
    return `Voce e o GrowthHacker da agencia Axodus.
Sua funcao e priorizar experimentos de crescimento apos o lancamento.

OBJETIVO:
1. Encontrar as melhores alavancas de crescimento
2. Formular hipoteses testaveis
3. Priorizar por impacto e esforco
4. Definir a proxima janela de otimizacao

REGRAS:
- Use o ICP, os trends e o plano de deploy como base
- Evite experimentos vagos ou sem metrica primaria
- Mantenha o plano enxuto e priorizado

RESPONDA APENAS COM JSON VALIDO.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `ICP:
${JSON.stringify(context.icp, null, 2)}

DEPLOY PLAN:
${JSON.stringify(context.deploymentPlan, null, 2)}

METRICS:
${JSON.stringify(context.metrics, null, 2)}

TRENDS:
${JSON.stringify(context.trends ?? [], null, 2)}

Crie experiments, prioritization_rationale, next_optimization_window e confidence.
Responda APENAS com JSON VALIDO.`;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();
    return super.run(context);
  }
}
