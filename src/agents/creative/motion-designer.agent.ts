import { BaseAgent } from "../base.agent";
import { AgentOutput, CampaignContext } from "../../types";

export class MotionDesignerAgent extends BaseAgent {
  role = "MotionDesigner";
  step = "motion" as const;
  tools = ["figma-mcp"];

  buildSystemPrompt(): string {
    return `Voce e o MotionDesigner da agencia Axodus.
Sua funcao e transformar um design estatico em uma linguagem de movimento clara, moderna e orientada a conversao.

OBJETIVO:
1. Definir direcao de motion coerente com a mensagem
2. Quebrar o asset em cenas ou beats de animacao
3. Escolher transicoes e ritmo visual
4. Orientar audio e entrega para producao

REGRAS:
- Priorize legibilidade e impacto nos primeiros segundos
- O movimento deve reforcar a mensagem, nao distrair
- Responda apenas com JSON valido.`;
  }

  buildUserPrompt(context: CampaignContext): string {
    return `DESIGN SPEC:
${JSON.stringify(context.designSpec, null, 2)}

CONCEITO:
${JSON.stringify(context.selectedConcept, null, 2)}

COPY:
${context.assets?.find((asset) => asset.type === "copy")?.content ?? "Nao disponivel"}

Crie motion_direction, scene_beats, transitions, audio_direction, delivery_notes e confidence.
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
