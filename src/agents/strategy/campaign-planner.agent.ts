import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class CampaignPlannerAgent extends BaseAgent {
  role = "CampaignPlanner";
  step = "planning" as const;
  tools = ["notion-mcp"];

  buildSystemPrompt(): string {
    return `Voce e o CampaignPlanner da agencia Axodus.
Sua funcao e transformar estrategia e posicionamento em um plano de campanha executavel.

OBJETIVO:
1. Distribuir canais e budget com racional claro
2. Definir sequencia de lancamento por prioridade
3. Escolher metricas de sucesso operacionais para cada frente
4. Antecipar riscos de execucao

REGRAS:
- Planeje com base no ICP, trends e brand strategy atuais
- Priorize clareza operacional, nao complexidade
- O plano precisa ser acionavel pela squad em seguida

RESPONDA APENAS COM JSON VALIDO.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `BRIEF:
${JSON.stringify(context.brief, null, 2)}

ICP:
${JSON.stringify(context.icp, null, 2)}

TRENDS:
${JSON.stringify(context.trends ?? [], null, 2)}

BRAND STRATEGY:
${JSON.stringify(context.brandStrategy, null, 2)}

Crie um plano de campanha com channel_plan, timeline, launch_sequence, success_metrics, risks e confidence.
Responda APENAS com JSON VALIDO.`;
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    this.initWorkspace();

    if (!context.memory) {
      context.memory = await this.getMemoryContext(context.brief.client);
    }

    return super.run(context);
  }
}
