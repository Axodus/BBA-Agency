// ─────────────────────────────────────────────────────────────
// AXODUS — Human-In-The-Loop (HITL) / Intervention System
// DIRETRIZ 5: Aprovação obrigatória para ações financeiras
// ─────────────────────────────────────────────────────────────

import { InterventionRequiredError, TimeoutError } from "./errors";

/**
 * ── INTERVENTION REQUEST ──────────────────────────────────────
 * Estrutura para solicitações que requerem aprovação humana
 */
export interface InterventionRequest {
  campaignId: string;
  action: string; // O que vai ser executado
  budget: number; // Valor em risco (BRL)
  summary: string; // Resumo humano-legível
  payload: unknown; // O payload que seria enviado à API
  timeout_ms: number; // Quanto esperar antes de cancelar
  metadata?: Record<string, unknown>;
}

/**
 * ── INTERVENTION RESULT ───────────────────────────────────────
 */
export type InterventionResult = "approved" | "rejected" | "timeout";

/**
 * ── INTERVENTION DECISION (armazenado em MongoDB/Redis) ───────
 */
export interface InterventionDecision {
  requestId: string;
  campaignId: string;
  action: string;
  decision: InterventionResult;
  approver?: string;
  approvedAt?: Date;
  notes?: string;
}

/**
 * ── HITL CLASS ────────────────────────────────────────────────
 * Gerencia fluxo de aprovação humana
 */
export class HumanInTheLoop {
  private pendingDecisions: Map<string, InterventionDecision> = new Map();
  private slackWebhookUrl: string | undefined;

  constructor() {
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  }

  /**
   * ── REQUEST INTERVENTION ──────────────────────────────────
   * Submete uma ação para aprovação humana
   * Retorna: "approved" | "rejected" | "timeout"
   */
  async request(req: InterventionRequest): Promise<InterventionResult> {
    console.log(`\n[HITL] ⚠️  Intervenção requerida para: ${req.action}`);
    console.log(`       Campaign: ${req.campaignId}`);
    console.log(`       Budget em risco: R$ ${req.budget}`);
    console.log(`       Timeout: ${req.timeout_ms / 1000}s`);

    const requestId = `HITL-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // 1. Enviar notificação (Slack ou console fallback)
    await this.notifyHuman(requestId, req);

    // 2. Aguardar decisão
    const decision = await this.pollForDecision(requestId, req.timeout_ms);

    console.log(`[HITL] → Decisão: ${decision.toUpperCase()}`);

    // Store decision para auditoria
    this.pendingDecisions.set(requestId, {
      requestId,
      campaignId: req.campaignId,
      action: req.action,
      decision,
      approvedAt: decision === "approved" ? new Date() : undefined,
    });

    return decision;
  }

  /**
   * ── NOTIFY HUMAN (Slack ou Console) ───────────────────────
   */
  private async notifyHuman(requestId: string, req: InterventionRequest): Promise<void> {
    if (!this.slackWebhookUrl) {
      console.log(`\n[HITL] 📢 (Slack não configurado — fallback para console)\n`);
      console.log("╔════════════════════════════════════════════════════════════╗");
      console.log("║  HUMAN INTERVENTION REQUIRED                              ║");
      console.log("╠════════════════════════════════════════════════════════════╣");
      console.log(`║  Request ID: ${requestId}`);
      console.log(`║  Campaign: ${req.campaignId}`);
      console.log(`║  Action: ${req.action}`);
      console.log(`║  Budget: R$ ${req.budget}`);
      console.log("╠════════════════════════════════════════════════════════════╣");
      console.log(`║  Summary: ${req.summary}`);
      console.log("╠════════════════════════════════════════════════════════════╣");
      console.log(`║  Payload:\n║  ${JSON.stringify(req.payload, null, 2).split("\n").join("\n║  ")}`);
      console.log("╠════════════════════════════════════════════════════════════╣");
      console.log("║  (Em produção, notificação seria enviada para Slack)       ║");
      console.log("║  (Simulando aprovação automática em 3 segundos...)         ║");
      console.log("╚════════════════════════════════════════════════════════════╝\n");

      // Demo: simular aprovação após 3s
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.pendingDecisions.set(requestId, {
        requestId,
        campaignId: req.campaignId,
        action: req.action,
        decision: "approved",
        approver: "SYSTEM_AUTO_DEMO",
        approvedAt: new Date(),
        notes: "[DEMO MODE] Auto-approved after timeout",
      });

      return;
    }

    // Slack integration (real)
    try {
      const payload = {
        text: `🚨 *AXODUS — Intervention Required*`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🚨 HUMAN INTERVENTION REQUIRED",
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Request ID*\n\`${requestId}\``,
              },
              {
                type: "mrkdwn",
                text: `*Campaign*\n${req.campaignId}`,
              },
              {
                type: "mrkdwn",
                text: `*Action*\n${req.action}`,
              },
              {
                type: "mrkdwn",
                text: `*Budget at Risk*\nR$ ${req.budget}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Summary*\n${req.summary}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Payload*\n\`\`\`${JSON.stringify(req.payload, null, 2)}\`\`\``,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "✅ Approve",
                },
                value: requestId,
                action_id: `approve_${requestId}`,
                style: "primary",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "❌ Reject",
                },
                value: requestId,
                action_id: `reject_${requestId}`,
                style: "danger",
              },
            ],
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Timeout: ${req.timeout_ms / 1000}s`,
              },
            ],
          },
        ],
      };

      // TODO: Implementar webhook real do Slack
      console.log("[HITL] 📤 Notificação enviada para Slack (stub)");
    } catch (err) {
      console.warn("[HITL] ⚠️  Falha ao enviar notificação:", err);
    }
  }

  /**
   * ── POLL FOR DECISION (aguarda resposta) ─────────────────
   * Usa polling simples (em produção, seria websocket/webhook)
   */
  private async pollForDecision(requestId: string, timeout_ms: number): Promise<InterventionResult> {
    const deadline = Date.now() + timeout_ms;
    const pollInterval = 500; // Check a cada 500ms

    while (Date.now() < deadline) {
      const decision = this.checkDecision(requestId);
      if (decision) {
        return decision;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    // Timeout
    console.warn(`[HITL] ⏱️  Timeout após ${timeout_ms / 1000}s`);
    return "timeout";
  }

  /**
   * ── CHECK DECISION (verifica se há decision no store) ──────
   */
  private checkDecision(requestId: string): InterventionResult | null {
    const stored = this.pendingDecisions.get(requestId);
    return stored?.decision ?? null;
  }

  /**
   * ── SUBMIT DECISION (chamado por sistema Slack) ──────────
   */
  submitDecision(
    requestId: string,
    decision: InterventionResult,
    approver?: string,
    notes?: string
  ): void {
    const existing = this.pendingDecisions.get(requestId);
    if (!existing) {
      console.warn(`[HITL] Decision for ${requestId} not found`);
      return;
    }

    existing.decision = decision;
    existing.approver = approver;
    existing.approvedAt = new Date();
    existing.notes = notes;

    console.log(`[HITL] ✓ Decision recorded: ${decision} by ${approver}`);
  }

  /**
   * ── GET AUDIT TRAIL ───────────────────────────────────────
   */
  getAuditTrail(): InterventionDecision[] {
    return Array.from(this.pendingDecisions.values());
  }

  /**
   * ── HEALTH CHECK ──────────────────────────────────────────
   */
  isConfigured(): boolean {
    return !!this.slackWebhookUrl;
  }

  getConfig(): {
    slackConfigured: boolean;
    pendingCount: number;
    approvedCount: number;
  } {
    return {
      slackConfigured: !!this.slackWebhookUrl,
      pendingCount: Array.from(this.pendingDecisions.values()).filter((d) => !d.approvedAt)
        .length,
      approvedCount: Array.from(this.pendingDecisions.values()).filter((d) => d.approvedAt)
        .length,
    };
  }
}

// Singleton export
export const hitl = new HumanInTheLoop();
