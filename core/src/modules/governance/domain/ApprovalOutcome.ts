export const ApprovalOutcome = {
  APPROVED: "APPROVED",
  CONDITIONAL: "CONDITIONAL",
  DEFERRED: "DEFERRED",
  REJECTED: "REJECTED",
  ESCALATED: "ESCALATED"
} as const;
export type ApprovalOutcomeType = typeof ApprovalOutcome[keyof typeof ApprovalOutcome];
