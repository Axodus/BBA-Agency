import { z } from "zod";

export const BbaGovernanceStatusSchema = z.enum([
  "planning",
  "review-ready",
  "under-review",
  "compliant",
  "restricted",
  "deprecated",
  "suspended",
]);

export const BbaConstitutionalStandingSchema = z.enum(["compliant", "under-review", "restricted", "pending"]);
export const BbaPublicReputationRiskSchema = z.enum(["low", "medium", "high"]);

export const BbaServiceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.enum([
    "Branding",
    "Advertising",
    "DAO Growth",
    "Governance Communication",
    "Product Launch",
    "Creative Production",
    "Business Consulting",
    "Web3 Positioning",
    "Strategic Partnerships",
  ]),
  subcategory: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  governanceStatus: BbaGovernanceStatusSchema,
  constitutionalStanding: BbaConstitutionalStandingSchema,
  pricingModel: z.string().min(1),
  deliveryModel: z.string().min(1),
  targetAudience: z.array(z.string()).min(1),
  treasuryCompatible: z.boolean(),
  active: z.boolean(),
  maturity: z.string().min(1),
  institutionalCategory: z.string().min(1),
  publicReputationRisk: BbaPublicReputationRiskSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const BbaCampaignSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  status: z.enum(["planning", "active", "paused", "completed", "under-review"]),
  clientId: z.string().min(1),
  ecosystemLinked: z.boolean(),
  governanceValidated: z.boolean(),
  constitutionalStanding: BbaConstitutionalStandingSchema,
  objective: z.string().min(1),
  channels: z.array(z.string()).min(1),
  metrics: z.record(z.string(), z.union([z.string(), z.number()])),
  budgetModel: z.string().min(1),
  treasuryExposure: z.string().min(1),
  publicReputationRisk: BbaPublicReputationRiskSchema,
  complianceRisks: z.array(z.string()),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  createdAt: z.string().min(1),
});

export const BbaClientPartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "DAO",
    "Company",
    "Internal Axodus Nucleus",
    "Educational Partner",
    "Strategic Partner",
    "Governance Partner",
  ]),
  governanceStanding: BbaConstitutionalStandingSchema,
  constitutionalBound: z.boolean(),
  partnershipLevel: z.string().min(1),
  servicesActive: z.array(z.string()),
  treasuryCompatible: z.boolean(),
  riskScore: z.number().min(0).max(100),
  description: z.string().min(1),
});

export const BbaProposalSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
  title: z.string().min(1),
  scope: z.string().min(1),
  status: z.enum(["draft", "review-ready", "under-review", "approved", "blocked"]),
  governanceReviewRequired: z.boolean(),
  treasuryReviewRequired: z.boolean(),
  operationalComplexity: z.enum(["low", "medium", "high"]),
  publicReputationRisk: BbaPublicReputationRiskSchema,
  deliveryEstimate: z.string().min(1),
  createdAt: z.string().min(1),
});

export const BbaWorkflowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  phase: z.enum(["intake", "analysis", "validation", "approval", "delivery", "monitoring"]),
  assignedAgents: z.array(z.string()).min(1),
  governanceStatus: BbaGovernanceStatusSchema,
  operationalRisk: BbaPublicReputationRiskSchema,
  blockers: z.array(z.string()),
  validationRequired: z.boolean(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const BbaBrandAssetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["logo", "identity-system", "guidelines", "campaign-visuals", "institutional-kit", "public-materials"]),
  format: z.string().min(1),
  owner: z.string().min(1),
  status: z.enum(["draft", "review-ready", "under-review", "approved", "deprecated"]),
  governanceStatus: BbaGovernanceStatusSchema,
  constitutionalStanding: BbaConstitutionalStandingSchema,
  publicReputationRisk: BbaPublicReputationRiskSchema,
  usageContext: z.array(z.string()).min(1),
  updatedAt: z.string().min(1),
});

export const BbaInstitutionalChannelSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["website", "social-media", "community", "newsletter", "events", "partners", "launches", "public-campaigns"]),
  status: z.enum(["active", "planned", "paused", "review-gated"]),
  owner: z.string().min(1),
  governanceStatus: BbaGovernanceStatusSchema,
  audience: z.string().min(1),
  publicReputationRisk: BbaPublicReputationRiskSchema,
  complianceNotes: z.array(z.string()),
});

export const BbaDeliverableSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["landing-page", "pitch-deck", "campaign-kit", "social-pack", "press-release", "proposal-document", "launch-report"]),
  status: z.enum(["planned", "in-progress", "review-ready", "under-review", "approved", "blocked"]),
  campaignId: z.string().min(1),
  clientId: z.string().min(1),
  governanceReviewRequired: z.boolean(),
  publicReputationRisk: BbaPublicReputationRiskSchema,
  dueDate: z.string().min(1),
});

export const BbaNucleusSchema = z.object({
  services: z.array(BbaServiceSchema),
  campaigns: z.array(BbaCampaignSchema),
  clientPartners: z.array(BbaClientPartnerSchema),
  proposals: z.array(BbaProposalSchema),
  workflows: z.array(BbaWorkflowSchema),
  brandAssets: z.array(BbaBrandAssetSchema),
  institutionalChannels: z.array(BbaInstitutionalChannelSchema),
  deliverables: z.array(BbaDeliverableSchema),
});
