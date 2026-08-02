export const ReviewStatus = {
  PROPOSED: "PROPOSED",
  IN_REVIEW: "IN_REVIEW",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
} as const;
export type ReviewStatusType = typeof ReviewStatus[keyof typeof ReviewStatus];

export const ReviewSessionStatus = {
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED"
} as const;
export type ReviewSessionStatusType = typeof ReviewSessionStatus[keyof typeof ReviewSessionStatus];

export const ReviewType = {
  CLAIMS: "CLAIMS",
  EDITORIAL: "EDITORIAL",
  TECHNICAL: "TECHNICAL",
  BRAND: "BRAND",
  DISCLOSURE: "DISCLOSURE",
  COMPLIANCE: "COMPLIANCE",
  SECURITY: "SECURITY",
  GENERAL: "GENERAL"
} as const;
export type ReviewTypeValue = typeof ReviewType[keyof typeof ReviewType];

export const FindingCategory = {
  CONSISTENCY: "CONSISTENCY",
  QUALITY: "QUALITY",
  COMPLIANCE: "COMPLIANCE",
  ACCURACY: "ACCURACY",
  GOVERNANCE: "GOVERNANCE",
  SECURITY: "SECURITY",
  OTHER: "OTHER"
} as const;
export type FindingCategoryValue = typeof FindingCategory[keyof typeof FindingCategory];

export const FindingSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const;
export type FindingSeverityValue = typeof FindingSeverity[keyof typeof FindingSeverity];

export const ReviewOutcome = {
  ACCEPTANCE_RECOMMENDED: "ACCEPTANCE_RECOMMENDED",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  REJECTION_RECOMMENDED: "REJECTION_RECOMMENDED",
  DEFERRED: "DEFERRED",
  ESCALATION_RECOMMENDED: "ESCALATION_RECOMMENDED",
  REFUSED: "REFUSED",
  ADDITIONAL_EVIDENCE_REQUIRED: "ADDITIONAL_EVIDENCE_REQUIRED",
  INCONCLUSIVE: "INCONCLUSIVE"
} as const;
export type ReviewOutcomeValue = typeof ReviewOutcome[keyof typeof ReviewOutcome];
