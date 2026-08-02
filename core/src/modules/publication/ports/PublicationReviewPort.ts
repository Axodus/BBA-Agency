import type { EvidenceReference } from "../../../shared/evidence/EvidenceReference.js";
import type { ReviewReference } from "../../../shared/references/index.js";
import type { EligibilityResultType } from "../domain/PublicationTypes.js";

export interface PublicationReviewEligibilityResult {
  readonly status: EligibilityResultType;
  readonly reviewReference: ReviewReference;
  readonly reviewConclusionId: string;
  readonly validatedAt: string;
  readonly evidence: readonly EvidenceReference[];
  readonly reason?: string;
}

export interface PublicationReviewPort {
  validatePublicationEligibility(input: { readonly reviewReference: ReviewReference; readonly reason: string }): Promise<PublicationReviewEligibilityResult>;
}
