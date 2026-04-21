import Anthropic from "@anthropic-ai/sdk";
import { MessageParam, TextBlock } from "@anthropic-ai/sdk/resources/messages";
import { appEnv } from "../config/env";
import { memory } from "../memory/memory.manager";
import { IAgent } from "../types/agent.interface";
import { AgentOutput, AgentRole, CampaignContext, PipelineStep } from "../types";
import { generateMockAgentPayload } from "../utils/mock-agent";

export abstract class BaseAgent implements IAgent {
  abstract role: string;
  abstract step: PipelineStep;
  abstract tools: string[];
  protected client?: Anthropic;
  protected model = appEnv.anthropicModel;

  abstract buildSystemPrompt(): string;
  abstract buildUserPrompt(context: CampaignContext): string;

  constructor() {
    if (appEnv.anthropicApiKey && !appEnv.useMockLlm) {
      this.client = new Anthropic({ apiKey: appEnv.anthropicApiKey });
    }
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    console.log(`[${this.role}] Iniciando...`);

    await memory.init();
    const similarCampaigns = await memory.findSimilarCampaigns(context.brief.rawText, 3);
    const winningHooks = await memory.getWinningHooks();
    const audienceInsights = context.icp ? await memory.getAudienceInsights(context.icp.segment) : [];

    const enrichedContext: CampaignContext = {
      ...context,
      memory: { similarCampaigns, winningHooks, audienceInsights },
    };

    let data: Record<string, unknown>;

    if (!this.client) {
      data = generateMockAgentPayload(this.role as AgentRole, enrichedContext);
      console.log(`[${this.role}] Modo mock ativo.`);
    } else {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        system: this.buildSystemPrompt(),
        messages: [
          {
            role: "user",
            content: this.buildUserPrompt(enrichedContext),
          } as MessageParam,
        ],
      });

      const raw = response.content
        .filter((block): block is TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();

      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        data = { raw };
      }
    }

    const output: AgentOutput = {
      agentRole: this.role as AgentRole,
      step: this.step,
      timestamp: new Date().toISOString(),
      data,
      confidence: typeof data.confidence === "number" ? data.confidence : 0.8,
      nextSteps: Array.isArray(data.nextSteps) ? (data.nextSteps as string[]) : undefined,
    };

    console.log(`[${this.role}] Concluido. Confianca: ${output.confidence}`);
    return output;
  }
}
