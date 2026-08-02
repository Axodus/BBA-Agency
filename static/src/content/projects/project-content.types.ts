export type ProjectExampleStatus =
  | "PROTOTYPE_BACKED"
  | "ILLUSTRATIVE_PLANNED";

export interface ProjectMaterial {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface ProjectTrustedFact {
  id: string;
  statement: string;
  sourceReference: string;
}

export interface ProjectContext {
  summary: string;
  objectives: string[];
  materials: ProjectMaterial[];
  trustedFacts: ProjectTrustedFact[];
  constraints: string[];
  requiredTerms: string[];
  prohibitedClaims: string[];
  uncertainties: string[];
}

export interface ProjectWorkflowStage {
  order: number;
  id: string;
  label: string;
  objective: string;
  agencyActivity: string;
  customerInvolvement: string;
  agentRoleIds: string[];
  artifactIds: string[];
  humanCheckpoint: boolean;
  decisionId?: string;
}

export interface ProjectAgentRole {
  id: string;
  name: string;
  responsibility: string;
  stageIds: string[];
  artifactIds: string[];
}

export interface ProjectHumanDecision {
  id: string;
  name: string;
  stageId: string;
  purpose: string;
  availableResponses: string[];
  effect: string;
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  description: string;
  purpose: string;
  format: string[];
  requiresApproval: boolean;
  includedInFinalPackage: boolean;
}

export interface ProjectTraceRecord {
  id: string;
  sourceReference: string;
  contextItem: string;
  workflowStageId: string;
  agentRoleId: string;
  artifactId: string;
  artifactVersion: string;
  decisionId: string;
  rationale: string;
}

export interface ProjectRevisionExample {
  title: string;
  request: string;
  reason: string;
  affectedArtifactIds: string[];
  repeatedStageIds: string[];
  preservedArtifactIds: string[];
  resultingVersion: string;
  traceabilityNote: string;
}

export interface ProjectMarkdownSection {
  title: string;
  body: string;
}

export interface ProjectFaqItem {
  question: string;
  answer: string;
}

export interface AgencyProjectContent {
  schemaVersion: string;
  id: string;
  name: string;
  slug: string;
  route: string;
  productId: string;
  productName: string;
  productRoute: string;
  category: string;
  exampleStatus: ProjectExampleStatus;
  packageName: string;
  eyebrow: string;
  headline: string;
  summary: string;
  customerObjective: string;
  customerOutcome: string;
  audience: string[];
  contentLanguage: "English";
  applicationLanguage: "English";
  availability: { label: string; code: ProjectExampleStatus; operationalOnStaticSite: false };
  prototype: { available: boolean; url?: string; disclosure: string };
  seo: { title: string; description: string; canonicalPath: string };
  navigation: { previousProject: string | null; nextProject: string | null };
  relatedProductId: string;
  keywords: string[];
  context: ProjectContext;
  expectedOutcome: { description: string; packageName: string; deliverableIds: string[]; checkpointIds: string[]; knownLimitations: string[] };
  workflow: ProjectWorkflowStage[];
  agentTeam: { status: "PROTOTYPE_IMPLEMENTED" | "CONCEPTUAL"; roles: ProjectAgentRole[] };
  humanDecisions: ProjectHumanDecision[];
  revisionExample: ProjectRevisionExample;
  deliverables: ProjectDeliverable[];
  traceability: ProjectTraceRecord[];
  limitations: string[];
  sections: Record<string, ProjectMarkdownSection>;
  faq: ProjectFaqItem[];
  sourcePath: string;
}
