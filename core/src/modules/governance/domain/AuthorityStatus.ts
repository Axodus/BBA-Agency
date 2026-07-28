export const AuthorityStatus = {
  PROPOSED: "PROPOSED",
  ACTIVE: "ACTIVE",
  UNDER_REVIEW: "UNDER_REVIEW",
  UPDATED: "UPDATED",
  RETIRED: "RETIRED"
} as const;
export type AuthorityStatusType = typeof AuthorityStatus[keyof typeof AuthorityStatus];
export function isAuthorityStatus(value: string): value is AuthorityStatusType {
  return Object.values(AuthorityStatus).includes(value as AuthorityStatusType);
}
