export type BbaGovernanceStatus = "planning" | "review-ready" | "under-review" | "compliant" | "restricted" | "deprecated" | "suspended";
export type BbaConstitutionalStanding = "compliant" | "under-review" | "restricted" | "pending";
export type BbaPublicReputationRisk = "low" | "medium" | "high";

export type BbaServiceCategory =
  | "Branding"
  | "Advertising"
  | "DAO Growth"
  | "Governance Communication"
  | "Product Launch"
  | "Creative Production"
  | "Business Consulting"
  | "Web3 Positioning"
  | "Strategic Partnerships";

export interface BbaService {
  id: string;
  title: string;
  slug: string;
  category: BbaServiceCategory;
  subcategory: string;
  description: string;
  shortDescription: string;
  governanceStatus: BbaGovernanceStatus;
  constitutionalStanding: BbaConstitutionalStanding;
  pricingModel: string;
  deliveryModel: string;
  targetAudience: string[];
  treasuryCompatible: boolean;
  active: boolean;
  maturity: string;
  institutionalCategory: string;
  publicReputationRisk: BbaPublicReputationRisk;
  createdAt: string;
  updatedAt: string;
}

export interface BbaCampaign {
  id: string;
  title: string;
  type: string;
  status: "planning" | "active" | "paused" | "completed" | "under-review";
  clientId: string;
  ecosystemLinked: boolean;
  governanceValidated: boolean;
  constitutionalStanding: BbaConstitutionalStanding | "restricted";
  objective: string;
  channels: string[];
  metrics: Record<string, string | number>;
  budgetModel: string;
  treasuryExposure: string;
  publicReputationRisk: BbaPublicReputationRisk;
  complianceRisks: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
}

export type BbaClientPartnerType =
  | "DAO"
  | "Company"
  | "Internal Axodus Nucleus"
  | "Educational Partner"
  | "Strategic Partner"
  | "Governance Partner";

export interface BbaClientPartner {
  id: string;
  name: string;
  type: BbaClientPartnerType;
  governanceStanding: BbaConstitutionalStanding | "restricted";
  constitutionalBound: boolean;
  partnershipLevel: string;
  servicesActive: string[];
  treasuryCompatible: boolean;
  riskScore: number;
  description: string;
}

export interface BbaProposal {
  id: string;
  clientId: string;
  title: string;
  scope: string;
  status: "draft" | "review-ready" | "under-review" | "approved" | "blocked";
  governanceReviewRequired: boolean;
  treasuryReviewRequired: boolean;
  operationalComplexity: "low" | "medium" | "high";
  publicReputationRisk: BbaPublicReputationRisk;
  deliveryEstimate: string;
  createdAt: string;
}

export interface BbaWorkflow {
  id: string;
  title: string;
  phase: "intake" | "analysis" | "validation" | "approval" | "delivery" | "monitoring";
  assignedAgents: string[];
  governanceStatus: BbaGovernanceStatus;
  operationalRisk: BbaPublicReputationRisk;
  blockers: string[];
  validationRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BbaBrandAsset {
  id: string;
  title: string;
  type: "logo" | "identity-system" | "guidelines" | "campaign-visuals" | "institutional-kit" | "public-materials";
  format: string;
  owner: string;
  status: "draft" | "review-ready" | "under-review" | "approved" | "deprecated";
  governanceStatus: BbaGovernanceStatus;
  constitutionalStanding: BbaConstitutionalStanding;
  publicReputationRisk: BbaPublicReputationRisk;
  usageContext: string[];
  updatedAt: string;
}

export interface BbaInstitutionalChannel {
  id: string;
  title: string;
  type: "website" | "social-media" | "community" | "newsletter" | "events" | "partners" | "launches" | "public-campaigns";
  status: "active" | "planned" | "paused" | "review-gated";
  owner: string;
  governanceStatus: BbaGovernanceStatus;
  audience: string;
  publicReputationRisk: BbaPublicReputationRisk;
  complianceNotes: string[];
}

export interface BbaDeliverable {
  id: string;
  title: string;
  type: "landing-page" | "pitch-deck" | "campaign-kit" | "social-pack" | "press-release" | "proposal-document" | "launch-report";
  status: "planned" | "in-progress" | "review-ready" | "under-review" | "approved" | "blocked";
  campaignId: string;
  clientId: string;
  governanceReviewRequired: boolean;
  publicReputationRisk: BbaPublicReputationRisk;
  dueDate: string;
}
