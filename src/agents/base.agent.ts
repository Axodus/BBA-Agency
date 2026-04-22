// ─────────────────────────────────────────────────────────────
// AXODUSBBA — Base Agent (Abstract Class)
// FASE 3: Core orchestration + contract validation + Mock LLM
// ─────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { MessageParam, TextBlock } from "@anthropic-ai/sdk/resources/messages";
import { CampaignContext, AgentOutput, PipelineStep } from "../types/index";
import { IAgent } from "../types/agent.interface";
import { memory } from "../memory/memory.manager";
import {
  validateAgentOutput,
  CONTRACT_MAP,
} from "../contracts/schemas";
import { PermissionDeniedError as PermsDeniedError, canAgentUseTool, createAgentWorkspace, MCPTool } from "../config/permissions";
import { ContractViolationError, AutoCorrectionError, PermissionDeniedError } from "../utils/errors";
import { generateMockAgentPayload } from "../utils/mock-agent";

const MAX_AUTO_CORRECTION_ATTEMPTS = 2;

/**
 * ── BASE AGENT ────────────────────────────────────────────────
 * Implementa:
 * - Validação obrigatória de contratos
 * - Auto-correção em caso de violação
 * - Controle de acesso (permission matrix)
 * - Integração com memory
 * - Suporte a Mock LLM
 * - Rate limiting e cost tracking
 */
export abstract class BaseAgent implements IAgent {
  abstract role: string;
  abstract step: PipelineStep;
  abstract tools: string[];

  protected client?: Anthropic;
  protected model: string = "claude-sonnet-4-20250514";
  protected workspace!: ReturnType<typeof createAgentWorkspace>;
  private contractAttempts = 0;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY && !process.env.USE_MOCK_LLM) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    // workspace será inicializado após role ser definido
  }

  protected initWorkspace(): void {
    if (!this.workspace) {
      this.workspace = createAgentWorkspace(this.role);
    }
  }

  abstract buildSystemPrompt(): string;
  abstract buildUserPrompt(context: CampaignContext): string;

  protected validatePermissions(): void {
    for (const toolStr of this.tools) {
      const tool = toolStr as MCPTool;
      if (!canAgentUseTool(this.role, tool)) {
        throw new PermissionDeniedError(this.role, toolStr);
      }
    }
  }

  async run(context: CampaignContext): Promise<AgentOutput> {
    console.log(`[${this.role}] ► Iniciando step: ${this.step}`);

    try {
      this.validatePermissions();
    } catch (err) {
      console.error(`[${this.role}] ✗ Permissão negada:`, err);
      throw err;
    }

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
      data = generateMockAgentPayload(this.role as any, enrichedContext);
      console.log(`[${this.role}] ✓ Modo mock ativo.`);
    } else {
      try {
        data = await this.callClaude(enrichedContext);
      } catch (err) {
        console.error(`[${this.role}] ✗ Erro ao chamar Claude:`, err);
        throw err;
      }
    }

    const validationResult = this.validateContract(data);
    if (!validationResult.success) {
      try {
        data = await this.autoCorrectOutput(enrichedContext, data, validationResult.error!);
      } catch (err) {
        console.error(`[${this.role}] ✗ Auto-correção falhou:`, err);
        throw err;
      }
    }

    const output: AgentOutput = {
      agentRole: this.role as any,
      step: this.step,
      timestamp: new Date().toISOString(),
      data,
      confidence: (data as any).confidence ?? 0.8,
      nextSteps: Array.isArray((data as any).nextSteps) ? (data as any).nextSteps : undefined,
    };

    console.log(`[${this.role}] ✓ Concluído com confiança: ${output.confidence}`);
    return output;
  }

  private async callClaude(context: CampaignContext): Promise<Record<string, unknown>> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(context);

    const response = await this.client!.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        } as MessageParam,
      ],
    });

    const textBlock = response.content.find((block): block is TextBlock => block.type === "text");
    if (!textBlock) {
      throw new Error("Claude não retornou texto");
    }

    try {
      return JSON.parse(textBlock.text);
    } catch (err) {
      console.warn(`[${this.role}] Tentando extrair JSON de resposta não-estruturada...`);
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw err;
    }
  }

  private validateContract(data: unknown): {
    success: boolean;
    error?: ContractViolationError;
  } {
    const stepKey = this.step as keyof typeof CONTRACT_MAP;
    const schema = CONTRACT_MAP[stepKey];
    if (!schema) {
      return { success: true };
    }

    const result = (schema as any).safeParse(data);
    if (result.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: new ContractViolationError(this.role, this.step, result.error),
      };
    }
  }

  private async autoCorrectOutput(
    context: CampaignContext,
    previousOutput: unknown,
    contractError: ContractViolationError
  ): Promise<Record<string, unknown>> {
    this.contractAttempts++;

    if (this.contractAttempts > MAX_AUTO_CORRECTION_ATTEMPTS) {
      throw new AutoCorrectionError(
        this.role,
        this.step,
        this.contractAttempts,
        MAX_AUTO_CORRECTION_ATTEMPTS,
        contractError
      );
    }

    console.log(
      `[${this.role}] 🔄 Auto-corrigindo attempt ${this.contractAttempts}/${MAX_AUTO_CORRECTION_ATTEMPTS}...`
    );

    const correctionPrompt = `
Seu output anterior virou inválido. Corrija-o para match EXATAMENTE a estrutura JSON abaixo.

Output anterior (inválido):
${JSON.stringify(previousOutput, null, 2)}

Erros encontrados:
${JSON.stringify(contractError.zodError.flatten(), null, 2)}

RESPONDA APENAS COM JSON VÁLIDO. Nenhum texto fora do JSON.
`;

    const response = await this.client!.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: this.buildSystemPrompt() + "\n\nVocê está em modo AUTO-CORREÇÃO. Retorne JSON válido.",
      messages: [
        {
          role: "user",
          content: correctionPrompt,
        } as MessageParam,
      ],
    });

    const textBlock = response.content.find((block): block is TextBlock => block.type === "text");
    if (!textBlock) {
      throw new Error("[Auto-Correction] Claude não retornou texto");
    }

    try {
      return JSON.parse(textBlock.text);
    } catch (err) {
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw err;
    }
  }

  protected async getMemoryContext(query: string): Promise<any> {
    try {
      const winningHooks = await memory.getWinningHooks(5);
      const audienceInsights = await memory.getAudienceInsights("default");

      return {
        similarCampaigns: [],
        winningHooks,
        audienceInsights,
      };
    } catch (err) {
      console.warn(`[${this.role}] ⚠ Não conseguiu carregar memória:`, err);
      return {
        similarCampaigns: [],
        winningHooks: [],
        audienceInsights: [],
      };
    }
  }

  protected async callTool(toolName: MCPTool, params: Record<string, unknown>): Promise<unknown> {
    if (!canAgentUseTool(this.role, toolName)) {
      throw new PermissionDeniedError(this.role, toolName);
    }

    console.log(`[${this.role}] → Chamando tool: ${toolName} com params:`, params);

    return {
      success: true,
      data: {},
    };
  }
}
