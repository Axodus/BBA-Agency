// ─────────────────────────────────────────────────────────────
// AXODUS — Data Contract Schemas (Zod)
// DIRETRIZ 1: Previne "alucinações em cascata"
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

/**
 * ── BriefInterpreter Output ──────────────────────────────────────
 * Interpreta o brief bruto e extrai:
 * - O PROBLEMA REAL (não o sintoma)
 * - OBJETIVO MENSURÁVEL (com métrica)
 * - AS RESTRIÇÕES (orçamento, canal, prazo, tom)
 * - O QUE NÃO ESTÁ SENDO DITO (inferências críticas)
 */
export const BriefOutputSchema = z.object({
  core_problem: z.string().min(10).describe("O problema real identificado no briefing"),
  target_audience_id: z.string().uuid().describe("ID de referência do público-alvo"),
  measurable_goal: z.object({
    metric: z.string().describe("Métrica de sucesso (CTR, conversão, etc)"),
    target: z.string().describe("Alvo numérico ou qualitativo"),
    timeframe: z.string().describe("Prazo para atingir a meta"),
  }),
  brand_voice_constraints: z
    .array(z.string())
    .min(1)
    .describe("Restrições de tom e voz da marca"),
  hidden_insights: z.array(z.string()).describe("Inferências críticas não ditas no brief"),
  confidence: z.number().min(0).max(1).describe("Confiança da interpretação (0-1)"),
});

/**
 * ── AudienceProfiler Output (ICP) ─────────────────────────────
 * Construir o ICP (Ideal Customer Profile) com precisão
 */
export const ICPOutputSchema = z.object({
  audience_id: z.string().uuid(),
  segment: z.string().describe("Cargo + setor + tamanho empresa"),
  pain_points: z.array(z.string()).min(2).describe("Mínimo 2 pain points"),
  language_profile: z.string().describe("Como essa persona fala (gírias, termos)"),
  device: z.enum(["mobile", "desktop", "both"]),
  platforms: z.array(z.string()).min(1).describe("Plataformas onde consome"),
  timing: z.string().describe("Quando essa pessoa consome conteúdo"),
  buying_triggers: z.array(z.string()).describe("O que dispara decisão de compra"),
  objections: z.array(z.string()).describe("Objeções comuns a superar"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── Creative Concept (do CreativeDirector) ─────────────────────
 * Um conceito criativo único com hook, narrativa, emoção, formato
 */
export const CreativeConceptSchema = z.object({
  concept_id: z.string().uuid(),
  title: z.string().describe("Nome do conceito"),
  hook: z.string().max(100).describe("Hook para parar o scroll (0-3s)"),
  narrative: z.string().min(20).describe("Narrativa do conceito"),
  emotion: z.string().describe("Emoção dominante (humor, medo, esperança, etc)"),
  format: z.enum(["video_15s", "video_30s", "carrossel", "static", "ugc", "meme"]),
  viral_score: z.number().min(0).max(10).describe("Score estimado de viralidade"),
  viral_rationale: z.string().describe("Justificativa do score viral"),
  target_pain: z.string().describe("Pain point que este conceito endereça"),
  temperature_used: z.number().optional().describe("top_p usado na geração"),
});

/**
 * ── CreativeDirector Output (Ideation) ────────────────────────
 * Múltiplos conceitos divergentes (nunca variações do mesmo)
 */
export const IdeationOutputSchema = z.object({
  concepts: z
    .array(CreativeConceptSchema)
    .min(3)
    .describe("Mínimo 3 conceitos radicalmente diferentes"),
  recommendation: z.string().describe("Qual conceito você escolheria e por quê"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── DataAnalyst Output (Validation) ──────────────────────────
 * Valida conceitos com dados reais (benchmark com campanhas similares)
 */
export const ValidationOutputSchema = z.object({
  ranked_concepts: z
    .array(
      z.object({
        concept_id: z.string().uuid(),
        rank: z.number().min(1).describe("Posição no ranking"),
        validation_score: z.number().min(0).max(10),
        rationale: z.string().describe("Por que este conceito vence/perde"),
        benchmark_comparison: z
          .string()
          .describe("Como se compara a campanhas similares no histórico"),
      })
    )
    .min(1),
  recommendation: z.string().describe("Qual aprovar para produção, com justificativa de dados"),
  kill_list: z.array(z.string()).describe("Conceitos para descartar e motivo"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── Copywriter Output (Production) ────────────────────────────
 * Copy completo para todos os canais: headline, body, CTA, roteiro, social
 */
export const CopyOutputSchema = z.object({
  headline: z.string().max(80).describe("Headline primária (máx 10 palavras)"),
  subheadline: z.string().describe("Subtítulo"),
  body_text: z.string().describe("Body copy (2-3 parágrafos)"),
  cta: z.string().max(30).describe("Call-to-action com verbo de ação"),
  video_script: z.object({
    hook: z.string().describe("0-3s: primeiros segundos que param o scroll"),
    body: z.string().describe("3-15s: core message do vídeo"),
    objection_handler: z.string().optional().describe("15-20s: superar objeção"),
    cta: z.string().describe("20-30s: chamada final para ação"),
  }),
  social_caption: z.string().describe("Caption para Instagram/LinkedIn/Twitter"),
  ad_variants: z.array(z.string()).min(2).describe("Mínimo 2 variações de copy para A/B"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── AnalyticsAgent Output (Feedback Loop) ────────────────────
 * Fecha o loop: o que aprendemos? O que muda na próxima iteração?
 */
export const FeedbackOutputSchema = z.object({
  performance_summary: z.string().describe("Resumo de performance (CTR, Conv, ROI)"),
  winner_hook: z.string().nullable().describe("Hook que mais converteu"),
  loser_hooks: z.array(z.string()).describe("Hooks que floparam"),
  audience_insights: z.array(z.string()).describe("Novos insights sobre o público"),
  next_iteration_recommendations: z.array(z.string()).describe("Recomendações para próxima campanha"),
  should_scale: z.boolean().describe("Vale a pena escalar este conceito?"),
  should_kill: z.boolean().describe("Deve matar e voltar à ideação?"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── TrendAnalyst Output ──────────────────────────────────────
 * Identifica trends relevantes para o segment + core_problem
 */
export const TrendAnalystOutputSchema = z.object({
  trends: z
    .array(
      z.object({
        trend_id: z.string().uuid(),
        name: z.string().describe("Nome do trend (ex: 'Short-form video dominance')"),
        description: z.string().describe("Descrição clara do trend"),
        relevance_score: z.number().min(0).max(10).describe("Quão relevante para este segment (0-10)"),
        relevance_rationale: z.string().describe("Por que é relevante para esse segment"),
        opportunity: z.string().describe("Como aproveitar este trend para vender"),
        risk: z.string().nullable().describe("Risco ou armadilha deste trend"),
        expected_timeline: z.string().describe("Quando este trend está em pico de relevância"),
      })
    )
    .min(2)
    .describe("Mínimo 2 trends, máximo 5"),
  primary_trend: z.string().describe("Qual trend está mais alinhado com o objective"),
  killer_combo: z.string().optional().describe("Combinação de 2-3 trends que poderiam criar sinergia"),
  warnings: z.array(z.string()).describe("Trends saturados ou armadilhas a evitar"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── Contract Validation Map ──────────────────────────────────
 * Mapa step → schema para validação automática no BaseAgent
 */
export const CONTRACT_MAP = {
  interpret: BriefOutputSchema,
  strategy: ICPOutputSchema,
  trends: TrendAnalystOutputSchema,
  ideation: IdeationOutputSchema,
  validation: ValidationOutputSchema,
  production: CopyOutputSchema,
  feedback: FeedbackOutputSchema,
} as const;

export type ContractMap = typeof CONTRACT_MAP;

/**
 * ── Errors & Diagnostics ─────────────────────────────────────
 * Custom errors para diagnósticos mais claros
 */
export class ContractViolationError extends Error {
  public readonly zodError: any;
  public readonly agent: string;
  public readonly step: string;

  constructor(agent: string, step: string, zodError: any) {
    const message = `[CONTRACT VIOLATION] Agent: ${agent} | Step: ${step}\n${JSON.stringify(zodError.flatten(), null, 2)}`;
    super(message);
    this.name = "ContractViolationError";
    this.agent = agent;
    this.step = step;
    this.zodError = zodError;
  }
}

/**
 * ── Validator Helper ─────────────────────────────────────────
 * Função de conveniência para validar output de agente
 */
export function validateAgentOutput(
  step: keyof typeof CONTRACT_MAP,
  data: unknown
): { success: boolean; data?: any; error?: ContractViolationError } {
  const schema = CONTRACT_MAP[step];
  if (!schema) {
    return { success: true, data }; // Step sem schema = passa
  }

  const result = (schema as any).safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: new ContractViolationError("Unknown", step, result.error) };
  }
}
