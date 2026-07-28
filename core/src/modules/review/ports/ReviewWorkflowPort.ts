import type { ReviewOutcomeValue } from "../domain/ReviewTypes.js";
import type { MissionReference, ReviewReference } from "../../../shared/references/index.js";

export interface ReviewWorkflowPort {
  notifyReviewStarted(input: { readonly review: ReviewReference; readonly mission: MissionReference }): Promise<void>;
  notifyReviewCompleted(input: { readonly review: ReviewReference; readonly mission: MissionReference; readonly outcome: ReviewOutcomeValue }): Promise<void>;
}
