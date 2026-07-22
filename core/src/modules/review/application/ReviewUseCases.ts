import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { ReviewId, TenantId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ArchiveReviewCommand, CancelSessionCommand, CloseSessionCommand, CompleteReviewCommand, CreateReviewCommand, OpenSessionCommand, PlanSessionCommand, RecordFindingCommand, StartReviewCommand } from "../domain/ReviewCommands.js";
import { CompletionAuthorization } from "../domain/ReviewConclusion.js";
import { Review } from "../domain/Review.js";
import type { ReviewGovernancePort, ReviewMissionPort, ReviewPublicationPort, ReviewReferenceValidationPort, ReviewRepository, ReviewWorkflowPort } from "../ports/index.js";

async function requireReview(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId): Promise<Review> {
  const review = await repository.findById(tenantId, reviewId);
  if (review === null) throw new InvariantViolation("Review was not found", { reviewId: reviewId.toString() });
  return review;
}

async function validateScope(port: ReviewReferenceValidationPort, review: Review): Promise<void> {
  for (const reference of review.scope.targets) {
    if (reference instanceof AssetVersionReference) await port.validateAssetVersionReference(reference);
    else if (reference instanceof AssetReference) await port.validateAssetReference(reference);
    else if (reference instanceof KnowledgeReference) await port.validateKnowledgeReference(reference);
    else if (reference instanceof PolicyReference) await port.validatePolicyReference(reference);
  }
}

export async function createReview(repository: ReviewRepository, mission: ReviewMissionPort, references: ReviewReferenceValidationPort, command: CreateReviewCommand): Promise<Review> {
  if (await repository.exists(command.tenantId, command.reviewId)) throw new InvariantViolation("Review already exists");
  await mission.validateMissionReference(command.missionReference);
  if (!await mission.missionAllowsReview(command.missionReference)) throw new InvariantViolation("Mission does not allow Review");
  const review = Review.create(command);
  await validateScope(references, review);
  await repository.save(review, Version.initial());
  return review;
}

export async function startReview(repository: ReviewRepository, mission: ReviewMissionPort, references: ReviewReferenceValidationPort, workflow: ReviewWorkflowPort, tenantId: TenantId, reviewId: ReviewId, command: StartReviewCommand): Promise<Review> {
  const review = await requireReview(repository, tenantId, reviewId);
  await mission.validateMissionReference(review.missionReference);
  if (!await mission.missionAllowsReview(review.missionReference)) throw new InvariantViolation("Mission no longer allows Review");
  await validateScope(references, review);
  const expectedVersion = review.version;
  review.start(command);
  await repository.save(review, expectedVersion);
  await workflow.notifyReviewStarted({ review: review.reference, mission: review.missionReference });
  return review;
}

async function mutate(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, mutation: (review: Review) => void): Promise<Review> {
  const review = await requireReview(repository, tenantId, reviewId);
  const expectedVersion = review.version;
  mutation(review);
  await repository.save(review, expectedVersion);
  return review;
}

export async function planSession(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, command: PlanSessionCommand): Promise<Review> {
  return mutate(repository, tenantId, reviewId, (review) => review.planSession(command));
}
export async function openSession(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, command: OpenSessionCommand): Promise<Review> {
  return mutate(repository, tenantId, reviewId, (review) => review.openSession(command));
}
export async function recordFinding(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, command: RecordFindingCommand): Promise<Review> {
  return mutate(repository, tenantId, reviewId, (review) => review.recordFinding(command));
}
export async function closeSession(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, command: CloseSessionCommand): Promise<Review> {
  return mutate(repository, tenantId, reviewId, (review) => review.closeSession(command));
}
export async function cancelSession(repository: ReviewRepository, tenantId: TenantId, reviewId: ReviewId, command: CancelSessionCommand): Promise<Review> {
  return mutate(repository, tenantId, reviewId, (review) => review.cancelSession(command));
}

export async function completeReview(repository: ReviewRepository, governance: ReviewGovernancePort, workflow: ReviewWorkflowPort, publication: ReviewPublicationPort, tenantId: TenantId, reviewId: ReviewId, command: CompleteReviewCommand): Promise<Review> {
  const review = await requireReview(repository, tenantId, reviewId);
  const result = await governance.authorizeCompletion({ tenantId, target: review.reference, outcome: command.outcome, reason: command.reason });
  if (result.status === "REJECTED") throw new InvariantViolation("Review completion was rejected by Governance", { reason: result.reason ?? "not provided" });
  const authorization = new CompletionAuthorization(tenantId, result.decisionReference, result.authorityReferences);
  const expectedVersion = review.version;
  review.complete(command, authorization);
  await repository.save(review, expectedVersion);
  await workflow.notifyReviewCompleted({ review: review.reference, mission: review.missionReference, outcome: command.outcome });
  await publication.notifyReviewOutcomeAvailable({ review: review.reference, conclusionId: command.conclusionId, outcome: command.outcome });
  return review;
}

export async function archiveReview(repository: ReviewRepository, governance: ReviewGovernancePort, tenantId: TenantId, reviewId: ReviewId, command: ArchiveReviewCommand): Promise<Review> {
  const review = await requireReview(repository, tenantId, reviewId);
  const result = await governance.authorizeArchive({ tenantId, target: review.reference, reason: command.reason });
  if (result.status === "REJECTED") throw new InvariantViolation("Review archive was rejected by Governance", { reason: result.reason ?? "not provided" });
  const expectedVersion = review.version;
  review.archive(command, new CompletionAuthorization(tenantId, result.decisionReference, result.authorityReferences));
  await repository.save(review, expectedVersion);
  return review;
}
