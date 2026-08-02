import type { ReviewOutcomeValue } from "../domain/ReviewTypes.js";
import type { TenantId } from "../../../shared/identity/index.js";
import type { AuthorityReference, DecisionReference, ReviewReference } from "../../../shared/references/index.js";

export type ReviewAuthorizationResult =
  | { readonly status: "AUTHORIZED"; readonly decisionReference: DecisionReference; readonly authorityReferences: readonly AuthorityReference[] }
  | { readonly status: "REJECTED"; readonly reason?: string };

export interface ReviewGovernancePort {
  authorizeCompletion(input: { readonly tenantId: TenantId; readonly target: ReviewReference; readonly outcome: ReviewOutcomeValue; readonly reason: string }): Promise<ReviewAuthorizationResult>;
  authorizeArchive(input: { readonly tenantId: TenantId; readonly target: ReviewReference; readonly reason: string }): Promise<ReviewAuthorizationResult>;
}
