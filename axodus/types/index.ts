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
  | "ideation"
  | "validation"
  | "production"
  | "deploy"
  | "feedback";

export type CampaignGoal = "conversion" | "branding" | "traffic" | "retention";

export interface Brief {
  id: string;
  client: string;
  goal: CampaignGoal;
  rawText: string;
  budget?: number;
  deadline?: string;
  channels?: string[];
}

export interface AgentOutput<TData = Record<string, unknown>> {
  agentRole: AgentRole;
  step: PipelineStep;
  timestamp: string;
  data: TData;
  confidence: number;
  nextSteps?: string[];
}

export interface CampaignConstraints {
  budget: number | null;
  channels: string[];
  tone: string;
  deadline: string | null;
}

export interface InterpretedBrief {
  realProblem: string;
  measurableGoal: {
    metric: string;
    target: string;
    timeframe: string;
  };
  constraints: CampaignConstraints;
  hiddenInsights: string[];
  confidence: number;
  nextSteps: string[];
}

export interface ICPProfile {
  segment: string;
  painPoints: string[];
  language: string;
  device: "mobile" | "desktop" | "both";
  platforms: string[];
  timing: string;
}

export interface AudienceProfile extends ICPProfile {
  buyingTriggers: string[];
  objections: string[];
  confidence: number;
}

export interface CreativeConcept {
  id: string;
  title: string;
  hook: string;
  narrative: string;
  emotion: string;
  format: string;
  viralScore: number;
  validationScore?: number;
  viralRationale?: string;
  targetPain?: string;
}

export interface ValidatedConcept {
  conceptId: string;
  rank: number;
  predictedCTR: string;
  icpAdherence: number;
  viralPotential: number;
  benchmarkComparison: string;
  risks: string[];
  validationScore: number;
}

export interface ValidationSummary {
  rankedConcepts: ValidatedConcept[];
  recommendation: string;
  killList: string[];
  confidence: number;
}

export interface CopyBundle {
  headline: string;
  subheadline: string;
  bodyText: string;
  cta: string;
  videoScript: {
    hook: string;
    problem: string;
    solution: string;
    cta: string;
  };
  socialCaption: string;
  adVariants: string[];
  confidence: number;
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

export interface CampaignRecord {
  id: string;
  hook: string;
  format: string;
  ctr: number;
  conversion: number;
  budget: number;
  embedding?: number[];
}

export interface MemorySnapshot {
  similarCampaigns: CampaignRecord[];
  winningHooks: string[];
  audienceInsights: string[];
}

export interface AnalyticsFeedback {
  performanceSummary: string;
  winnerHook: string | null;
  loserHooks: string[];
  audienceInsights: string[];
  nextIterationRecommendations: string[];
  shouldScale: boolean;
  shouldKill: boolean;
  confidence: number;
}

export interface CampaignContext {
  id: string;
  brief: Brief;
  interpretedBrief?: InterpretedBrief;
  constraints?: CampaignConstraints;
  icp?: AudienceProfile;
  concepts?: CreativeConcept[];
  validation?: ValidationSummary;
  selectedConcept?: CreativeConcept;
  assets?: Asset[];
  metrics?: CampaignMetrics;
  memory?: MemorySnapshot;
  feedback?: AnalyticsFeedback;
}
