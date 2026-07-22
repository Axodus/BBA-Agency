export const PublicationStatus = Object.freeze({
  DRAFT: "DRAFT",
  READY: "READY",
  AUTHORIZED_FOR_CONNECTOR: "AUTHORIZED_FOR_CONNECTOR",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED"
} as const);
export type PublicationStatusType = typeof PublicationStatus[keyof typeof PublicationStatus];

export const PublicationResult = Object.freeze({ SUCCESS: "SUCCESS", FAILED: "FAILED", PARTIAL: "PARTIAL" } as const);
export type PublicationResultType = typeof PublicationResult[keyof typeof PublicationResult];

export const PublicationRecordResult = Object.freeze({ SUCCESS: "SUCCESS", FAILED: "FAILED" } as const);
export type PublicationRecordResultType = typeof PublicationRecordResult[keyof typeof PublicationRecordResult];

export const EligibilityResult = Object.freeze({ ELIGIBLE: "ELIGIBLE", NOT_ELIGIBLE: "NOT_ELIGIBLE" } as const);
export type EligibilityResultType = typeof EligibilityResult[keyof typeof EligibilityResult];
