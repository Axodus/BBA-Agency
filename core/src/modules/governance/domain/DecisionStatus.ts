export const DecisionStatus = {
  PROPOSED: "PROPOSED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FINALIZED: "FINALIZED"
} as const;
export type DecisionStatusType = typeof DecisionStatus[keyof typeof DecisionStatus];
