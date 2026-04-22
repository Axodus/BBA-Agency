// ─────────────────────────────────────────────────────────────
// AXODUS TYPES — Core Data Contracts
// ─────────────────────────────────────────────────────────────

export type AgentRole =
  | "BriefInterpreter"
  | "TrendAnalyst"
  | "BrandStrategist"
  | "AudienceProfiler"
  | "CampaignPlanner"
  | "CreativeDirector"
  | "Copywriter"
  | "VisualDesigner"
  | "MotionDesigner"
  | "UXCreative"
  | "GrowthHacker"
  | "AdsSpecialist"
  | "DataAnalyst"
  | "AnalyticsAgent";

export type PipelineStep =
  | "input"
  | "interpret"
  | "strategy"
  | "trends"
  | "branding"
  | "planning"
  | "ideation"
  | "validation"
  | "production"
  | "design"
  | "motion"
  | "experience"
  | "deploy"
  | "optimization"
  | "feedback";

export interface Brief {
  id: string;
  client: string;
  goal: "conversion" | "branding" | "traffic" | "retention";
  rawText: string;
  budget?: number;
  deadline?: string;
  channels?: string[];
}

export interface AgentOutput {
  agentRole: AgentRole;
  step: PipelineStep;
  timestamp: string;
  data: Record<string, unknown>;
  confidence: number; // 0-1
  nextSteps?: string[];
}

export interface CampaignContext {
  id: string;
  brief: Brief;
  icp?: ICPProfile;
  trends?: TrendInsight[];
  brandStrategy?: BrandStrategy;
  campaignPlan?: CampaignPlan;
  concepts?: CreativeConcept[];
  selectedConcept?: CreativeConcept;
  designSpec?: DesignSpec;
  motionSpec?: MotionSpec;
  uxPlan?: UXCreativeSpec;
  deploymentPlan?: DeploymentPlan;
  growthExperiments?: GrowthExperimentPlan;
  assets?: Asset[];
  metrics?: CampaignMetrics;
  memory?: MemorySnapshot;
  interpretedBrief?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
}

export interface ICPProfile {
  audience_id?: string;
  segment: string;
  painPoints?: string[];
  pain_points?: string[];
  language: string;
  language_profile?: string;
  device: "mobile" | "desktop" | "both";
  platforms: string[];
  timing: string;
  buyingTriggers?: string[];
  buying_triggers?: string[];
  objections?: string[];
  confidence?: number;
}

export interface TrendInsight {
  trend_id: string;
  name: string;
  description: string;
  relevance_score: number;
  relevance_rationale: string;
  opportunity: string;
  risk: string | null;
  expected_timeline: string;
}

export interface BrandStrategy {
  brand_positioning_statement: string;
  value_proposition: string;
  differentiators: string[];
  messaging_pillars: string[];
  proof_points: string[];
  recommended_cta_angle: string;
  confidence: number;
}

export interface CampaignPlan {
  channel_plan: Array<{
    channel: string;
    objective: string;
    budget_allocation_pct: number;
    primary_message: string;
  }>;
  timeline: string[];
  launch_sequence: string[];
  success_metrics: string[];
  risks: string[];
  confidence: number;
}

export interface CreativeConcept {
  id: string;
  concept_id?: string;
  title: string;
  hook: string;
  narrative: string;
  emotion: string;
  format: "video_15s" | "video_30s" | "carrossel" | "static" | "ugc" | "meme" | string;
  viralScore?: number;
  viral_score?: number;
  validationScore?: number;
  validation_score?: number;
  target_pain?: string;
  temperature_used?: number;
  viral_rationale?: string;
}

export interface Asset {
  type: "copy" | "image" | "video" | "landing" | "ad";
  content: string;
  url?: string;
  figmaId?: string;
}

export interface DesignSpec {
  creative_direction: string;
  visual_system: {
    palette: string[];
    typography: string[];
    imagery_style: string;
    composition_rules: string[];
  };
  asset_blueprints: Array<{
    asset_type: string;
    purpose: string;
    layout_notes: string;
  }>;
  production_notes: string[];
  confidence: number;
}

export interface MotionSpec {
  motion_direction: string;
  scene_beats: Array<{
    timestamp: string;
    visual: string;
    animation: string;
    objective: string;
  }>;
  transitions: string[];
  audio_direction: string;
  delivery_notes: string[];
  confidence: number;
}

export interface UXCreativeSpec {
  journey_goal: string;
  page_blueprint: Array<{
    section: string;
    objective: string;
    primary_element: string;
    interaction_note: string;
  }>;
  interaction_principles: string[];
  conversion_friction: string[];
  experiment_hooks: string[];
  confidence: number;
}

export interface DeploymentPlan {
  platforms: Array<{
    platform: string;
    campaign_objective: string;
    targeting_summary: string;
    budget: number;
    launch_checklist: string[];
  }>;
  approval_required: boolean;
  rollout_strategy: string;
  monitoring_plan: string[];
  confidence: number;
}

export interface GrowthExperimentPlan {
  experiments: Array<{
    name: string;
    hypothesis: string;
    metric: string;
    expected_impact: string;
    effort: "low" | "medium" | "high";
  }>;
  prioritization_rationale: string;
  next_optimization_window: string;
  confidence: number;
}

export interface CampaignMetrics {
  ctr?: number;
  conversion?: number;
  retention?: number;
  spend?: number;
  roas?: number;
}

export interface MemorySnapshot {
  similarCampaigns?: CampaignRecord[];
  winningHooks?: string[];
  audienceInsights?: string[];
}

export interface CampaignRecord {
  id: string;
  hook: string;
  format: string;
  ctr: number;
  conversion: number;
  budget: number;
  embedding?: number[];
  summary?: string;
  sector?: string;
}

// Token Usage for Cost Control
export interface TokenUsage {
  agent: string;
  step: PipelineStep;
  input_tokens: number;
  output_tokens: number;
}

// Cost Auditor Summary
export interface CostSummary {
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostUSD: number;
  estimatedCostBRL: number;
  ratioOfBudget: number;
  status: "safe" | "warning" | "exceeded";
}
