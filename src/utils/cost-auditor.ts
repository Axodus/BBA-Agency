// ─────────────────────────────────────────────────────────────
// AXODUS — Cost Auditor (Token Budget Guard)
// DIRETRIZ 6: Previne gastar mais em tokens do que a campanha vale
// ─────────────────────────────────────────────────────────────

import { CostSummary, TokenUsage } from "../types/index";
import { CostExceededError } from "./errors";

/**
 * ── PRICING (Claude Sonnet 4 — atualizar conforme API) ──────
 * Valores em USD (converter para BRL com taxa)
 */
const PRICING = {
  input_per_1k_tokens: 0.003, // USD
  output_per_1k_tokens: 0.015, // USD
  usd_to_brl: 5.5, // Taxa de câmbio
};

/**
 * ── COST AUDITOR ──────────────────────────────────────────
 * Rastreia uso de tokens e previne estouro de budget
 */
export class CostAuditor {
  private usageLog: (TokenUsage & { cost_usd: number; cost_brl: number })[] = [];
  private campaignBudget: number; // em BRL
  private maxTokenCostRatio: number; // máximo % do budget em tokens
  private totalTokensCost: { usd: number; brl: number } = { usd: 0, brl: 0 };

  constructor(campaignBudgetBRL: number, maxRatio: number = 0.05) {
    this.campaignBudget = campaignBudgetBRL;
    this.maxTokenCostRatio = maxRatio;
  }

  /**
   * ── RECORD USAGE ──────────────────────────────────────────
   * Registra uso de tokens de um agente e valida budget
   */
  record(usage: TokenUsage): void {
    const costUSD = this.calculateCostUSD(usage.input_tokens, usage.output_tokens);
    const costBRL = costUSD * PRICING.usd_to_brl;

    this.usageLog.push({
      ...usage,
      cost_usd: costUSD,
      cost_brl: costBRL,
    });

    this.totalTokensCost.usd += costUSD;
    this.totalTokensCost.brl += costBRL;

    // Validação
    const ratio = this.totalTokensCost.brl / this.campaignBudget;
    console.log(
      `[CostAuditor] ${usage.agent} @ ${usage.step}: ${usage.input_tokens + usage.output_tokens} tokens (~R$ ${costBRL.toFixed(2)})`
    );

    if (ratio > this.maxTokenCostRatio) {
      const message = `Token cost exceeded ${(this.maxTokenCostRatio * 100).toFixed(1)}% of budget (${(ratio * 100).toFixed(1)}% used)`;
      console.error(`[CostAuditor] 🚨 ${message}`);
      throw new CostExceededError(
        this.totalTokensCost.brl,
        this.campaignBudget * this.maxTokenCostRatio,
        ratio
      );
    }

    // Warning if approaching threshold
    if (ratio > this.maxTokenCostRatio * 0.8) {
      console.warn(
        `[CostAuditor] ⚠️  Approaching cost limit: ${(ratio * 100).toFixed(1)}% of budget`
      );
    }
  }

  /**
   * ── CALCULATE COST USD ────────────────────────────────────
   */
  private calculateCostUSD(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000) * PRICING.input_per_1k_tokens;
    const outputCost = (outputTokens / 1000) * PRICING.output_per_1k_tokens;
    return inputCost + outputCost;
  }

  /**
   * ── GET REPORT ─────────────────────────────────────────
   */
  getReport(): string {
    const lines: string[] = [];
    lines.push("\n╔════════════════════════════════════════════════════════════╗");
    lines.push("║               AXODUS — Cost Audit Report                  ║");
    lines.push("╠════════════════════════════════════════════════════════════╣");

    // Summary by agent
    const byAgent = new Map<string, { tokens: number; cost_brl: number }>();
    for (const entry of this.usageLog) {
      const key = entry.agent;
      const existing = byAgent.get(key) ?? { tokens: 0, cost_brl: 0 };
      existing.tokens += entry.input_tokens + entry.output_tokens;
      existing.cost_brl += entry.cost_brl;
      byAgent.set(key, existing);
    }

    for (const [agent, data] of byAgent) {
      lines.push(`║  ${agent.padEnd(20)} | ${data.tokens.toString().padEnd(8)} tokens | R$ ${data.cost_brl.toFixed(2).padStart(8)}`);
    }

    lines.push("╠════════════════════════════════════════════════════════════╣");
    lines.push(`║  TOTAL: R$ ${this.totalTokensCost.brl.toFixed(2).padStart(8)} (~USD ${this.totalTokensCost.usd.toFixed(2)})`);

    const ratioPercent = (this.totalTokensCost.brl / this.campaignBudget) * 100;
    const budgetRemaining = this.campaignBudget - this.totalTokensCost.brl;
    const status =
      ratioPercent > this.maxTokenCostRatio * 100 ? "🚨 EXCEEDED" : ratioPercent > 80 ? "⚠️  WARNING" : "✓ OK";

    lines.push(`║  Campaign Budget: R$ ${this.campaignBudget.toFixed(2)}`);
    lines.push(`║  Token Cost Ratio: ${ratioPercent.toFixed(1)}% ${status}`);
    lines.push(`║  Remaining Budget: R$ ${budgetRemaining.toFixed(2)}`);
    lines.push("╚════════════════════════════════════════════════════════════╝\n");

    return lines.join("\n");
  }

  /**
   * ── GET SUMMARY (estruturado) ──────────────────────────
   */
  summary(): CostSummary {
    const totalInputTokens = this.usageLog.reduce((sum, u) => sum + u.input_tokens, 0);
    const totalOutputTokens = this.usageLog.reduce((sum, u) => sum + u.output_tokens, 0);
    const ratio = this.totalTokensCost.brl / this.campaignBudget;

    let status: "safe" | "warning" | "exceeded" = "safe";
    if (ratio > this.maxTokenCostRatio) {
      status = "exceeded";
    } else if (ratio > this.maxTokenCostRatio * 0.8) {
      status = "warning";
    }

    return {
      totalInputTokens,
      totalOutputTokens,
      estimatedCostUSD: this.totalTokensCost.usd,
      estimatedCostBRL: this.totalTokensCost.brl,
      ratioOfBudget: ratio,
      status,
    };
  }

  /**
   * ── VALIDATE REMAINING BUDGET ─────────────────────────
   */
  hasRemainingBudget(additionalTokens: number = 1000): boolean {
    const estimatedAdditionalCost = (additionalTokens / 1000) * (PRICING.input_per_1k_tokens + PRICING.output_per_1k_tokens) * PRICING.usd_to_brl;
    const newTotal = this.totalTokensCost.brl + estimatedAdditionalCost;
    const newRatio = newTotal / this.campaignBudget;
    return newRatio <= this.maxTokenCostRatio;
  }

  /**
   * ── GET LOG (para auditoria) ──────────────────────────
   */
  getLog() {
    return [...this.usageLog];
  }
}
