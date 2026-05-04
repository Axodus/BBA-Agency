import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class UXCreativeAgent extends BaseAgent {
  role = "UXCreative";
  step = "experience" as const;
  tools = ["figma-mcp"];

  buildSystemPrompt(): string {
    return `Voce e o UXCreative da agencia Axodus.
Sua funcao e transformar estrategia, copy e conceito em uma experiencia de conversao fluida.

OBJETIVO:
1. Organizar a jornada de leitura e decisao
2. Definir secoes e elementos principais da pagina
3. Remover friccoes que derrubam conversao
4. Sugerir ganchos de teste para evoluir a UX

REGRAS:
- Trabalhe para clareza, velocidade de compreensao e acao
- Pense mobile-first, sem perder qualidade em desktop
- Responda apenas com JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `BRAND STRATEGY:
${JSON.stringify(context.brandStrategy, null, 2)}

ICP:
${JSON.stringify(context.icp, null, 2)}

CONCEITO:
${JSON.stringify(context.selectedConcept, null, 2)}

COPY:
${context.assets?.find((asset) => asset.type === "copy")?.content ?? "Nao disponivel"}

Crie journey_goal, page_blueprint, interaction_principles, conversion_friction, experiment_hooks e confidence.
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
