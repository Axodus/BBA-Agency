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
  | "ideation"
  | "validation"
  | "production"
  | "deploy"
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
  concepts?: CreativeConcept[];
  selectedConcept?: CreativeConcept;
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
