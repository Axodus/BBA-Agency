import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class VisualDesignerAgent extends BaseAgent {
  role = "VisualDesigner";
  step = "design" as const;
  tools = ["figma-mcp", "vector-db"];

  buildSystemPrompt(): string {
    return `Voce e o VisualDesigner da agencia Axodus.
Sua funcao e traduzir conceito, copy e estrategia em um sistema visual pronto para producao.

OBJETIVO:
1. Definir direcao criativa visual
2. Escolher palette, tipografia e estilo de imagem
3. Especificar blueprints de assets por formato
4. Deixar notas claras para producao

REGRAS:
- Mantenha coerencia com o brand positioning
- O output deve orientar design real, nao descrever mood abstrato

RESPONDA APENAS COM JSON VALIDO.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    const copyAsset = context.assets?.find((asset) => asset.type === "copy");
    return `BRAND STRATEGY:
${JSON.stringify(context.brandStrategy, null, 2)}

CONCEITO:
${JSON.stringify(context.selectedConcept, null, 2)}

COPY:
${copyAsset?.content ?? "Nao disponivel"}

Defina creative_direction, visual_system, asset_blueprints, production_notes e confidence.
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
