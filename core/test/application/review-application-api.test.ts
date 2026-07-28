import assert from "node:assert/strict";
import { test } from "node:test";
import { ReviewApplicationApi } from "../../src/application/bindings/ReviewApplicationApi.js";
import { createReviewBindings } from "../../src/application/bindings/ReviewBindings.js";
import type { ReviewDependencies } from "../../src/application/bindings/ReviewBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import { AuthorityId, DecisionId, TenantId } from "../../src/shared/identity/index.js";
import { AuthorityReference, DecisionReference } from "../../src/shared/references/index.js";
import type { ApplicationCommandContext, ReviewCommandRequestDto } from "../../src/application/dto/ApplicationContext.js";
const deps = { mission: {}, references: {}, governance: {}, workflow: {}, publication: {} } as ReviewDependencies;
test("Review exposes nine commands and one query", () => { assert.deepEqual(Object.keys(createReviewBindings(deps)).sort(), ["archiveReview", "cancelSession", "closeSession", "completeReview", "createReview", "getReview", "openSession", "planSession", "recordFinding", "startReview"]); });
test("Review requires all cross-context collaborators", () => { assert.throws(() => createReviewBindings({ ...deps, publication: undefined } as unknown as ReviewDependencies), /collaborators are required/u); });

const tenantId = "tenant_review_api"; const now = "2026-07-28T14:00:00.000Z"; const tenant = TenantId.from(tenantId);
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_review_api" }, correlationId: "correlation_review_api", causationId: "causation_review_api" };
const audit = { occurredAt: now, evidence: [{ evidenceId: "evidence_review_api", source: "review-api-test", type: "fixture", capturedAt: now }], lineage: [{ sourceId: "asset_review_api", targetId: "review_api", relationship: "reviews", declaredAt: now }] };
const collaborators: ReviewDependencies = { mission: { validateMissionReference: async () => undefined, missionAllowsReview: async () => true }, references: { validateAssetReference: async () => undefined, validateAssetVersionReference: async () => undefined, validateKnowledgeReference: async () => undefined, validatePolicyReference: async () => undefined }, governance: { authorizeCompletion: async () => ({ status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_review_api"), tenant), authorityReferences: [new AuthorityReference(AuthorityId.from("authority_review_api"), tenant)] }), authorizeArchive: async () => ({ status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_review_archive_api"), tenant), authorityReferences: [new AuthorityReference(AuthorityId.from("authority_review_api"), tenant)] }) }, workflow: { notifyReviewStarted: async () => undefined, notifyReviewCompleted: async () => undefined }, publication: { notifyReviewOutcomeAvailable: async () => undefined } };
function command(key: string, payload: Record<string, unknown> = {}): ReviewCommandRequestDto { return { idempotencyKey: key, reason: key, targetId: "review_api", payload: { ...audit, ...payload } }; }

test("Review executes nine commands and its query through M12", async () => {
  const provider = new ReferencePersistenceProvider(); const api = new ReviewApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider)), collaborators);
  const create = command("create-review", { reviewId: "review_api", requestId: "review_request_api", missionReference: { id: "mission_review_api", tenantId }, scope: { tenantId, targets: [{ kind: "asset", reference: { id: "asset_review_api", tenantId } }] }, reviewType: "TECHNICAL", criteria: ["Evidence is complete"], requestedBy: { reference: "human:reviewer", tenantId }, requestedAt: now });
  const first = await api.createReview(create, context); assert.deepEqual(await api.createReview(create, context), first);
  await api.planSession(command("plan-main", { sessionId: "review_session_main", reviewerReferences: [{ reference: "human:reviewer", tenantId }] }), context);
  await api.planSession(command("plan-cancel", { sessionId: "review_session_cancel", reviewerReferences: [{ reference: "human:reviewer", tenantId }] }), context);
  await api.startReview(command("start-review"), context);
  await api.openSession(command("open-main", { sessionId: "review_session_main" }), context);
  await api.recordFinding(command("record-finding", { sessionId: "review_session_main", findingId: "review_finding_api", category: "ACCURACY", severity: "HIGH", statement: "Claim needs evidence", recommendation: "Attach evidence" }), context);
  await api.closeSession(command("close-main", { sessionId: "review_session_main" }), context);
  await api.openSession(command("open-cancel", { sessionId: "review_session_cancel" }), context); await api.cancelSession(command("cancel-session", { sessionId: "review_session_cancel" }), context);
  await api.completeReview(command("complete-review", { conclusionId: "review_conclusion_api", outcome: "ACCEPTANCE_RECOMMENDED", rationale: "Closed session supports acceptance" }), context);
  await api.archiveReview(command("archive-review"), context);
  const review = await api.getReview({ targetId: "review_api" }, { tenantId, correlationId: context.correlationId }); assert.deepEqual(review, { reviewId: "review_api", tenantId, status: "ARCHIVED", version: 11 }); assert.equal("scope" in (review as unknown as Record<string, unknown>), false);
  assert.equal(provider.listAuditRecords(tenantId).length, 11);
});

test("Review validates before opening Unit of Work", () => { let opened = 0; const api = new ReviewApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("must not open"); } }), new ApplicationQueryRunner({ open: () => { throw new Error("must not read"); } }), collaborators); assert.throws(() => api.createReview({ idempotencyKey: "invalid", reason: "invalid", payload: {} }, context), /reviewId/u); assert.equal(opened, 0); });
