import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { AuthorityReference, DecisionReference, PublicationReference } from "../../../shared/references/index.js";
import type { TenantId } from "../../../shared/identity/index.js";
import type { PublicationEligibility } from "../domain/PublicationEligibility.js";

export interface PublicationAuthorizationResult {
  readonly status: "AUTHORIZED" | "REJECTED";
  readonly decisionReference?: DecisionReference;
  readonly authorityReferences?: readonly AuthorityReference[];
  readonly authorizedAt?: string;
  readonly evidence?: readonly EvidenceReference[];
  readonly reason?: string;
}

export interface PublicationGovernancePort {
  authorizePublication(input: { readonly tenantId: TenantId; readonly publication: PublicationReference; readonly eligibility: PublicationEligibility; readonly reason: string }): Promise<PublicationAuthorizationResult>;
  authorizeArchive(input: { readonly tenantId: TenantId; readonly publication: PublicationReference; readonly reason: string }): Promise<PublicationAuthorizationResult>;
}
