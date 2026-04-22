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
 * ── BrandStrategist Output ─────────────────────────────────
 * Traduz ICP + trends em posicionamento acionavel para criacao
 */
export const BrandStrategistOutputSchema = z.object({
  brand_positioning_statement: z
    .string()
    .min(20)
    .describe("Frase clara de posicionamento da marca para este contexto"),
  value_proposition: z
    .string()
    .min(20)
    .describe("Promessa principal de valor em linguagem do ICP"),
  differentiators: z
    .array(z.string())
    .min(2)
    .describe("Diferenciais competitivos que sustentam o posicionamento"),
  messaging_pillars: z
    .array(z.string())
    .min(3)
    .describe("3-5 pilares de mensagem para guiar creative/copy"),
  proof_points: z
    .array(z.string())
    .min(2)
    .describe("Evidencias ou argumentos para sustentar a promessa"),
  recommended_cta_angle: z
    .string()
    .min(10)
    .describe("Angulo de CTA mais aderente a este ICP"),
  confidence: z.number().min(0).max(1),
});

/**
 * ── CampaignPlanner Output ─────────────────────────────────
 * Distribui canais, sequência de lançamento e métricas operacionais
 */
export const CampaignPlannerOutputSchema = z.object({
  channel_plan: z.array(
    z.object({
      channel: z.string(),
      objective: z.string(),
      budget_allocation_pct: z.number().min(0).max(100),
      primary_message: z.string(),
    })
  ).min(1),
  timeline: z.array(z.string()).min(2),
  launch_sequence: z.array(z.string()).min(2),
  success_metrics: z.array(z.string()).min(2),
  risks: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

/**
 * ── VisualDesigner Output ──────────────────────────────────
 * Traduz conceito + copy em sistema visual e blueprints
 */
export const VisualDesignerOutputSchema = z.object({
  creative_direction: z.string().min(20),
  visual_system: z.object({
    palette: z.array(z.string()).min(2),
    typography: z.array(z.string()).min(1),
    imagery_style: z.string(),
    composition_rules: z.array(z.string()).min(2),
  }),
  asset_blueprints: z.array(
    z.object({
      asset_type: z.string(),
      purpose: z.string(),
      layout_notes: z.string(),
    })
  ).min(1),
  production_notes: z.array(z.string()).min(2),
  confidence: z.number().min(0).max(1),
});

/**
 * ── MotionDesigner Output ───────────────────────────────────
 * Traduz design em direção de movimento e key moments
 */
export const MotionDesignerOutputSchema = z.object({
  motion_direction: z.string().min(20),
  scene_beats: z.array(
    z.object({
      timestamp: z.string(),
      visual: z.string(),
      animation: z.string(),
      objective: z.string(),
    })
  ).min(2),
  transitions: z.array(z.string()).min(2),
  audio_direction: z.string().min(10),
  delivery_notes: z.array(z.string()).min(2),
  confidence: z.number().min(0).max(1),
});

/**
 * ── UXCreative Output ───────────────────────────────────────
 * Organiza a experiência de conversão e remove fricção
 */
export const UXCreativeOutputSchema = z.object({
  journey_goal: z.string().min(20),
  page_blueprint: z.array(
    z.object({
      section: z.string(),
      objective: z.string(),
      primary_element: z.string(),
      interaction_note: z.string(),
    })
  ).min(3),
  interaction_principles: z.array(z.string()).min(2),
  conversion_friction: z.array(z.string()).min(2),
  experiment_hooks: z.array(z.string()).min(2),
  confidence: z.number().min(0).max(1),
});

/**
 * ── AdsSpecialist Output ───────────────────────────────────
 * Define rollout por plataforma antes da execução real
 */
export const AdsSpecialistOutputSchema = z.object({
  platforms: z.array(
    z.object({
      platform: z.string(),
      campaign_objective: z.string(),
      targeting_summary: z.string(),
      budget: z.number().min(0),
      launch_checklist: z.array(z.string()).min(2),
    })
  ).min(1),
  approval_required: z.boolean(),
  rollout_strategy: z.string().min(20),
  monitoring_plan: z.array(z.string()).min(2),
  confidence: z.number().min(0).max(1),
});

/**
 * ── GrowthHacker Output ────────────────────────────────────
 * Prioriza experimentos de crescimento pós-lançamento
 */
export const GrowthHackerOutputSchema = z.object({
  experiments: z.array(
    z.object({
      name: z.string(),
      hypothesis: z.string(),
      metric: z.string(),
      expected_impact: z.string(),
      effort: z.enum(["low", "medium", "high"]),
    })
  ).min(2),
  prioritization_rationale: z.string().min(20),
  next_optimization_window: z.string().min(5),
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
  branding: BrandStrategistOutputSchema,
  planning: CampaignPlannerOutputSchema,
  ideation: IdeationOutputSchema,
  validation: ValidationOutputSchema,
  production: CopyOutputSchema,
  design: VisualDesignerOutputSchema,
  motion: MotionDesignerOutputSchema,
  experience: UXCreativeOutputSchema,
  feedback: FeedbackOutputSchema,
  deploy: AdsSpecialistOutputSchema,
  optimization: GrowthHackerOutputSchema,
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
