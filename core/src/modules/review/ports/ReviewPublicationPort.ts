import type { ReviewConclusionId } from "../../../shared/identity/index.js";
import type { ReviewReference } from "../../../shared/references/index.js";
import type { ReviewOutcomeValue } from "../domain/ReviewTypes.js";

export interface ReviewPublicationPort {
  notifyReviewOutcomeAvailable(input: { readonly review: ReviewReference; readonly conclusionId: ReviewConclusionId; readonly outcome: ReviewOutcomeValue }): Promise<void>;
}
