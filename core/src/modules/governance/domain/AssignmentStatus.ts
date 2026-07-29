export const AssignmentStatus = {
  PROPOSED: "PROPOSED",
  ACTIVE: "ACTIVE",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED"
} as const;
export type AssignmentStatusType = typeof AssignmentStatus[keyof typeof AssignmentStatus];
