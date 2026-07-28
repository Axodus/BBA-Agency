import assert from "node:assert/strict";
import test from "node:test";
import { CausationId, CorrelationId } from "../../../src/shared/common/index.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, AuthorityId, DecisionId, EvidenceId, KnowledgeId, MissionId, PolicyId, ReviewConclusionId, ReviewFindingId, ReviewId, ReviewRequestId, ReviewSessionId, TenantId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AssetReference, AssetVersionReference, AuthorityReference, DecisionReference, InstitutionalActorReference, KnowledgeReference, MissionReference, PolicyReference } from "../../../src/shared/references/index.js";
import { Version } from "../../../src/shared/version/Version.js";
import { archiveReview, cancelSession, closeSession, completeReview, createReview, openSession, planSession, recordFinding, startReview } from "../../../src/modules/review/application/index.js";
import { CompletionAuthorization, FindingCategory, FindingSeverity, Review, ReviewOutcome, ReviewScope, ReviewSessionStatus, ReviewStatus, ReviewType, type ArchiveReviewCommand, type CompleteReviewCommand, type CreateReviewCommand, type ReviewAuditInput, type ReviewSnapshot } from "../../../src/modules/review/domain/index.js";
import { InMemoryReviewRepository } from "../../../src/modules/review/infrastructure/index.js";
import type { ReviewAuthorizationResult, ReviewGovernancePort, ReviewMissionPort, ReviewPublicationPort, ReviewReferenceValidationPort, ReviewRepository, ReviewWorkflowPort } from "../../../src/modules/review/ports/index.js";

const now = "2026-07-22T12:00:00.000Z";
const later = "2026-07-22T13:00:00.000Z";
const tenantId = TenantId.from("tenant_review");
const otherTenantId = TenantId.from("tenant_other");
const reviewId = ReviewId.from("review_main");
const requestId = ReviewRequestId.from("review_request_main");
const missionReference = new MissionReference(MissionId.from("mission_review"), tenantId);
const assetReference = new AssetReference(AssetId.from("asset_review"), tenantId);
const versionReference = new AssetVersionReference(AssetId.from("asset_review"), AssetVersionId.from("asset_version_review"), tenantId);
const knowledgeReference = new KnowledgeReference(KnowledgeId.from("knowledge_review"), tenantId);
const policyReference = new PolicyReference(PolicyId.from("policy_review"), tenantId);
const reviewer = new InstitutionalActorReference("human:reviewer", tenantId);

function evidence(suffix: string): readonly EvidenceReference[] {
  return [new EvidenceReference({ evidenceId: EvidenceId.from(`evidence_${suffix}`), source: "review-test", type: "test-record", capturedAt: now })];
}
function lineage(suffix: string): readonly LineageReference[] {
  return [new LineageReference({ sourceId: `review_${suffix}`, targetId: `asset_${suffix}`, relationship: "reviews", declaredAt: now })];
}
function audit(suffix: string, occurredAt = now): ReviewAuditInput {
  return {
    reason: `review ${suffix}`, occurredAt, correlationId: CorrelationId.from(`correlation_${suffix}`),
    causationId: CausationId.from(`causation_${suffix}`), evidence: evidence(suffix), lineage: lineage(suffix)
  };
}
function createCommand(scope = new ReviewScope(tenantId, [assetReference])): CreateReviewCommand {
  return {
    ...audit("create"), reviewId, requestId, tenantId, missionReference, scope, reviewType: ReviewType.TECHNICAL,
    criteria: ["Evidence is complete", "Claims are supported"], requestedBy: reviewer, requestedAt: now,
    dueAt: "2026-07-23T12:00:00.000Z"
  };
}
function authorization(): CompletionAuthorization {
  return new CompletionAuthorization(
    tenantId,
    new DecisionReference(DecisionId.from("decision_review_completion"), tenantId),
    [new AuthorityReference(AuthorityId.from("authority_review"), tenantId)]
  );
}
function sessionCommand(id: string, suffix: string) {
  return { ...audit(suffix), sessionId: ReviewSessionId.from(id), reviewerReferences: [reviewer] };
}
function findingCommand(sessionId: ReviewSessionId, findingId: ReviewFindingId, suffix: string) {
  return {
    ...audit(suffix), sessionId, findingId, category: FindingCategory.ACCURACY, severity: FindingSeverity.HIGH,
    statement: `Finding ${suffix}`, recommendation: `Recommendation ${suffix}`
  };
}
function completeCommand(suffix = "complete"): CompleteReviewCommand {
  return { ...audit(suffix, later), conclusionId: ReviewConclusionId.from(`review_conclusion_${suffix}`), outcome: ReviewOutcome.ACCEPTANCE_RECOMMENDED, rationale: "Closed sessions support acceptance" };
}
function preparedReview(): Review {
  const review = Review.create(createCommand());
  const sessionId = ReviewSessionId.from("review_session_primary");
  review.planSession(sessionCommand(sessionId.toString(), "plan-primary"));
  review.start(audit("start"));
  review.openSession({ ...audit("open-primary"), sessionId });
  review.recordFinding(findingCommand(sessionId, ReviewFindingId.from("review_finding_primary"), "finding-primary"));
  review.closeSession({ ...audit("close-primary"), sessionId });
  return review;
}

test("Review owns one stable request and an immutable normalized scope", () => {
  const scope = new ReviewScope(tenantId, [policyReference, assetReference, knowledgeReference, versionReference]);
  const review = Review.create(createCommand(scope));
  assert.equal(review.status, ReviewStatus.PROPOSED);
  assert.notEqual(review.id.toString(), review.request.id.toString());
  assert.equal(review.request.reviewId.equals(review.id), true);
  assert.equal(review.request.id.equals(requestId), true);
  assert.equal(review.scope.targets.length, 4);
  assert.equal(Object.isFrozen(review.scope), true);
  assert.equal(Object.isFrozen(review.request), true);
  assert.throws(() => new ReviewScope(tenantId, []), /at least one reference/u);
  assert.throws(() => new ReviewScope(tenantId, [assetReference, assetReference]), /must be unique/u);
  assert.throws(() => new ReviewScope(tenantId, [new AssetReference(AssetId.from("asset_other"), otherTenantId)]), /Tenant boundary/u);
});

test("Review sessions protect lifecycle and permit only one ACTIVE session", () => {
  const review = Review.create(createCommand());
  const first = ReviewSessionId.from("review_session_first");
  const second = ReviewSessionId.from("review_session_second");
  review.planSession(sessionCommand(first.toString(), "plan-first"));
  review.planSession(sessionCommand(second.toString(), "plan-second"));
  review.start(audit("start-sessions"));
  review.openSession({ ...audit("open-first"), sessionId: first });
  assert.throws(() => review.openSession({ ...audit("open-second"), sessionId: second }), /Only one/u);
  assert.throws(() => review.recordFinding(findingCommand(second, ReviewFindingId.from("review_finding_inactive"), "inactive")), /ACTIVE/u);
  review.closeSession({ ...audit("close-first"), sessionId: first });
  review.openSession({ ...audit("open-second-after"), sessionId: second });
  assert.equal(review.sessions.find((item) => item.id.equals(second))?.status, ReviewSessionStatus.ACTIVE);
});

test("cancelled session Findings remain auditable but do not contribute to conclusion", () => {
  const review = preparedReview();
  const cancelledSessionId = ReviewSessionId.from("review_session_cancelled");
  const cancelledFindingId = ReviewFindingId.from("review_finding_cancelled");
  review.planSession(sessionCommand(cancelledSessionId.toString(), "plan-cancelled"));
  review.openSession({ ...audit("open-cancelled"), sessionId: cancelledSessionId });
  review.recordFinding(findingCommand(cancelledSessionId, cancelledFindingId, "finding-cancelled"));
  review.cancelSession({ ...audit("cancel-session"), sessionId: cancelledSessionId });
  review.complete(completeCommand(), authorization());
  assert.equal(review.status, ReviewStatus.COMPLETED);
  assert.ok(review.conclusion);
  assert.deepEqual(review.conclusion.contributingSessionIds.map(String), ["review_session_primary"]);
  assert.deepEqual(review.conclusion.consideredFindingIds.map(String), ["review_finding_primary"]);
  assert.equal(review.sessions.find((item) => item.id.equals(cancelledSessionId))?.findings[0]?.id.equals(cancelledFindingId), true);
  assert.equal(Object.isFrozen(review.conclusion), true);
  assert.equal(Reflect.set(review.conclusion, "rationale", "changed"), false);
});

test("Review completion and archive enforce lifecycle and explicit authorization data", () => {
  const review = Review.create(createCommand());
  const sessionId = ReviewSessionId.from("review_session_pending");
  review.planSession(sessionCommand(sessionId.toString(), "plan-pending"));
  review.start(audit("start-pending"));
  assert.throws(() => review.complete(completeCommand("too-early"), authorization()), /PLANNED or ACTIVE/u);
  review.openSession({ ...audit("open-empty"), sessionId });
  review.closeSession({ ...audit("close-empty"), sessionId });
  review.complete({ ...completeCommand("inconclusive"), outcome: ReviewOutcome.INCONCLUSIVE }, authorization());
  assert.equal(review.conclusion?.consideredFindingIds.length, 0);
  review.archive(audit("archive", later), authorization());
  assert.equal(review.status, ReviewStatus.ARCHIVED);
  assert.equal(review.domainEvents.at(-1)?.toJSON().type, "ReviewArchived");
  assert.throws(() => review.archive(audit("archive-again", later), authorization()), /cannot archive/u);
});

test("all Review outcomes remain non-binding conclusion values", () => {
  for (const [index, outcome] of Object.values(ReviewOutcome).entries()) {
    const review = preparedReview();
    review.complete({
      ...completeCommand(`outcome-${index}`), outcome,
      conclusionId: ReviewConclusionId.from(`review_conclusion_outcome-${index}`)
    }, authorization());
    assert.equal(review.conclusion?.outcome, outcome);
    assert.equal("approval" in (review.conclusion ?? {}), false);
  }
});

test("snapshots and serialization deterministically preserve Review state", () => {
  const review = preparedReview();
  review.complete(completeCommand("snapshot"), authorization());
  const snapshot = review.toSnapshot();
  assert.equal(Object.isFrozen(snapshot), true);
  const restored = Review.rehydrate(snapshot);
  assert.deepEqual(restored.toSnapshot(), snapshot);
  assert.equal(restored.serialize(), review.serialize());
  const parsed = JSON.parse(review.serialize()) as ReviewSnapshot;
  assert.deepEqual(Review.rehydrate(parsed).toSnapshot(), snapshot);
  assert.equal(restored.domainEvents.length, 0);
});

test("Review events preserve audit metadata for every mutation", () => {
  const review = preparedReview();
  review.complete(completeCommand("events"), authorization());
  const types = review.domainEvents.map((event) => event.toJSON().type);
  assert.deepEqual(types, ["ReviewCreated", "ReviewSessionPlanned", "ReviewStarted", "ReviewSessionOpened", "ReviewFindingRecorded", "ReviewSessionClosed", "ReviewCompleted"]);
  for (const event of review.domainEvents) {
    const json = event.toJSON();
    assert.equal(json.tenantId, tenantId.toString());
    assert.equal(typeof json.correlationId, "string");
    assert.ok(Array.isArray(json.evidenceIds));
    assert.ok(Array.isArray(json.lineage));
  }
});

test("in-memory repository returns reconstructed snapshots and enforces optimistic concurrency", async () => {
  const repository = new InMemoryReviewRepository();
  const review = Review.create(createCommand());
  await repository.save(review, Version.initial());
  const first = await repository.findById(tenantId, reviewId);
  const second = await repository.findById(tenantId, reviewId);
  assert.ok(first && second);
  first.planSession(sessionCommand("review_session_concurrency_a", "concurrency-a"));
  second.planSession(sessionCommand("review_session_concurrency_b", "concurrency-b"));
  await repository.save(first, Version.from(1));
  await assert.rejects(repository.save(second, Version.from(1)), ConcurrencyConflict);
  assert.notEqual(first, await repository.findById(tenantId, reviewId));
  await assert.rejects(repository.findById(otherTenantId, reviewId), /Tenant boundary/u);
});

class Ports implements ReviewMissionPort, ReviewReferenceValidationPort, ReviewGovernancePort, ReviewWorkflowPort, ReviewPublicationPort {
  public calls: string[] = [];
  public authorization: ReviewAuthorizationResult = {
    status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_port"), tenantId),
    authorityReferences: [new AuthorityReference(AuthorityId.from("authority_port"), tenantId)]
  };
  public workflowFailure: Error | null = null;
  public async validateMissionReference(): Promise<void> { this.calls.push("mission:validate"); }
  public async missionAllowsReview(): Promise<boolean> { this.calls.push("mission:allows"); return true; }
  public async validateAssetReference(): Promise<void> { this.calls.push("reference:asset"); }
  public async validateAssetVersionReference(): Promise<void> { this.calls.push("reference:asset-version"); }
  public async validateKnowledgeReference(): Promise<void> { this.calls.push("reference:knowledge"); }
  public async validatePolicyReference(): Promise<void> { this.calls.push("reference:policy"); }
  public async authorizeCompletion(): Promise<ReviewAuthorizationResult> { this.calls.push("governance:complete"); return this.authorization; }
  public async authorizeArchive(): Promise<ReviewAuthorizationResult> { this.calls.push("governance:archive"); return this.authorization; }
  public async notifyReviewStarted(): Promise<void> { this.calls.push("workflow:started"); }
  public async notifyReviewCompleted(): Promise<void> { this.calls.push("workflow:completed"); if (this.workflowFailure !== null) throw this.workflowFailure; }
  public async notifyReviewOutcomeAvailable(): Promise<void> { this.calls.push("publication:outcome"); }
}

async function prepareRepository(repository: ReviewRepository, ports: Ports): Promise<void> {
  await createReview(repository, ports, ports, createCommand(new ReviewScope(tenantId, [assetReference, versionReference, knowledgeReference, policyReference])));
  await planSession(repository, tenantId, reviewId, sessionCommand("review_session_application", "app-plan"));
  await startReview(repository, ports, ports, ports, tenantId, reviewId, audit("app-start"));
  const sessionId = ReviewSessionId.from("review_session_application");
  await openSession(repository, tenantId, reviewId, { ...audit("app-open"), sessionId });
  await recordFinding(repository, tenantId, reviewId, findingCommand(sessionId, ReviewFindingId.from("review_finding_application"), "app-finding"));
  await closeSession(repository, tenantId, reviewId, { ...audit("app-close"), sessionId });
}

test("application validates references, saves before notifications and exposes non-binding outcome", async () => {
  const repository = new InMemoryReviewRepository();
  const ports = new Ports();
  await prepareRepository(repository, ports);
  const command = completeCommand("application");
  await completeReview(repository, ports, ports, ports, tenantId, reviewId, command);
  assert.deepEqual(ports.calls.slice(0, 6), ["mission:validate", "mission:allows", "reference:asset-version", "reference:asset", "reference:knowledge", "reference:policy"]);
  assert.deepEqual(ports.calls.slice(-3), ["governance:complete", "workflow:completed", "publication:outcome"]);
  const stored = await repository.findById(tenantId, reviewId);
  assert.equal(stored?.status, ReviewStatus.COMPLETED);
  assert.equal(stored?.conclusion?.outcome, ReviewOutcome.ACCEPTANCE_RECOMMENDED);
});

test("failure before save persists nothing and performs no notifications", async () => {
  const repository = new InMemoryReviewRepository();
  const ports = new Ports();
  await prepareRepository(repository, ports);
  ports.calls = [];
  ports.authorization = { status: "REJECTED", reason: "authority missing" };
  await assert.rejects(completeReview(repository, ports, ports, ports, tenantId, reviewId, completeCommand("rejected")), /rejected by Governance/u);
  const stored = await repository.findById(tenantId, reviewId);
  assert.equal(stored?.status, ReviewStatus.IN_REVIEW);
  assert.deepEqual(ports.calls, ["governance:complete"]);
});

class FailingSaveRepository implements ReviewRepository {
  public constructor(private readonly delegate: ReviewRepository) {}
  public async save(): Promise<void> { throw new Error("save failed"); }
  public findById(tenant: TenantId, id: ReviewId) { return this.delegate.findById(tenant, id); }
  public exists(tenant: TenantId, id: ReviewId) { return this.delegate.exists(tenant, id); }
}

test("save failure performs no notification and leaves stored state unchanged", async () => {
  const base = new InMemoryReviewRepository();
  const ports = new Ports();
  await prepareRepository(base, ports);
  ports.calls = [];
  await assert.rejects(completeReview(new FailingSaveRepository(base), ports, ports, ports, tenantId, reviewId, completeCommand("save-failure")), /save failed/u);
  assert.deepEqual(ports.calls, ["governance:complete"]);
  assert.equal((await base.findById(tenantId, reviewId))?.status, ReviewStatus.IN_REVIEW);
});

test("post-save notification failure keeps mutation persisted and remains visible", async () => {
  const repository = new InMemoryReviewRepository();
  const ports = new Ports();
  await prepareRepository(repository, ports);
  ports.calls = [];
  ports.workflowFailure = new Error("workflow notification failed");
  await assert.rejects(completeReview(repository, ports, ports, ports, tenantId, reviewId, completeCommand("notification-failure")), /notification failed/u);
  assert.deepEqual(ports.calls, ["governance:complete", "workflow:completed"]);
  assert.equal((await repository.findById(tenantId, reviewId))?.status, ReviewStatus.COMPLETED);
});

test("ArchiveReview requires completed state and Governance authorization", async () => {
  const repository = new InMemoryReviewRepository();
  const ports = new Ports();
  await prepareRepository(repository, ports);
  const archiveCommand: ArchiveReviewCommand = audit("archive-use-case", later);
  await assert.rejects(archiveReview(repository, ports, tenantId, reviewId, archiveCommand), /cannot archive/u);
  await completeReview(repository, ports, ports, ports, tenantId, reviewId, completeCommand("before-archive"));
  ports.authorization = { status: "REJECTED", reason: "retention hold" };
  await assert.rejects(archiveReview(repository, ports, tenantId, reviewId, archiveCommand), /rejected by Governance/u);
  assert.equal((await repository.findById(tenantId, reviewId))?.status, ReviewStatus.COMPLETED);
  ports.authorization = {
    status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_archive"), tenantId),
    authorityReferences: [new AuthorityReference(AuthorityId.from("authority_archive"), tenantId)]
  };
  await archiveReview(repository, ports, tenantId, reviewId, archiveCommand);
  assert.equal((await repository.findById(tenantId, reviewId))?.status, ReviewStatus.ARCHIVED);
});

test("cancelSession supports planned sessions before Review starts", async () => {
  const repository = new InMemoryReviewRepository();
  const ports = new Ports();
  await createReview(repository, ports, ports, createCommand());
  const sessionId = ReviewSessionId.from("review_session_prestart_cancel");
  await planSession(repository, tenantId, reviewId, sessionCommand(sessionId.toString(), "prestart-plan"));
  await cancelSession(repository, tenantId, reviewId, { ...audit("prestart-cancel"), sessionId });
  assert.equal((await repository.findById(tenantId, reviewId))?.sessions[0]?.status, ReviewSessionStatus.CANCELLED);
});
