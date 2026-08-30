export type ProductAvailability =
  | "PROTOTYPE_AVAILABLE"
  | "PLANNED"
  | "CONCEPT_PREVIEW";

export interface ProductAvailabilityContent {
  label: string;
  code: ProductAvailability;
  operationalOnStaticSite: false;
}

export interface ProductSeoContent {
  title: string;
  description: string;
  canonicalPath: string;
}

export interface ProductNavigationContent {
  previousProduct: string | null;
  nextProduct: string | null;
}

export interface ProductWorkflowStage {
  order: number;
  id: string;
  label: string;
  customerRole: string;
  agencyRole: string;
  checkpoint: boolean;
  expectedOutput: string;
}

export interface ProductAgentRole {
  id: string;
  name: string;
  responsibility: string;
  stage: string;
}

export interface ProductDeliverable {
  id: string;
  name: string;
  description: string;
  format: string[];
  requiresApproval: boolean;
}

export type MarkdownInline =
  | { type: "text"; value: string }
  | { type: "emphasis"; value: string }
  | { type: "strong"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

export type MarkdownBlock =
  | { type: "paragraph"; content: MarkdownInline[] }
  | { type: "list"; ordered: boolean; items: MarkdownInline[][] }
  | { type: "blockquote"; content: MarkdownInline[] }
  | { type: "table"; headers: MarkdownInline[][]; rows: MarkdownInline[][][] };

export interface ProductContentSection {
  title: string;
  blocks: MarkdownBlock[];
}

export interface ProductFaqItem {
  question: string;
  answer: MarkdownBlock[];
}

export interface ProductMarkdownSections {
  overview: ProductContentSection;
  problem: ProductContentSection;
  audience: ProductContentSection;
  customerInputs: ProductContentSection;
  agencyWork: ProductContentSection;
  productWorkflow: ProductContentSection;
  agentTeam: ProductContentSection;
  humanReview: ProductContentSection;
  customerReceives: ProductContentSection;
  exampleProject: ProductContentSection;
  qualityTraceability: ProductContentSection;
  limitations: ProductContentSection;
  availability: ProductContentSection;
  platformRelationship: ProductContentSection;
  faq: ProductFaqItem[];
}

export interface AgencyProductContent {
  schemaVersion: string;
  id: string;
  name: string;
  category: string;
  slug: string;
  route: string;
  routeSegment: string;
  status: ProductAvailability;
  prototypeUrl?: string;
  prototypeDisclosure?: string;
  eyebrow: string;
  headline: string;
  summary: string;
  customerProblem: string;
  customerOutcome: string;
  primaryAudience: string[];
  contentLanguage: string;
  applicationLanguage: string;
  availability: ProductAvailabilityContent;
  seo: ProductSeoContent;
  navigation: ProductNavigationContent;
  relatedProducts: string[];
  keywords: string[];
  workflow: ProductWorkflowStage[];
  agentTeam: ProductAgentRole[];
  agentTeamStatus: "PROTOTYPE_IMPLEMENTED" | "CONCEPTUAL";
  deliverables: ProductDeliverable[];
  sections: ProductMarkdownSections;
  sourcePath: string;
}
