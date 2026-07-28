import assert from "node:assert/strict";
import { test } from "node:test";
import { PublicationApplicationApi } from "../../src/application/bindings/PublicationApplicationApi.js";
import { createPublicationBindings } from "../../src/application/bindings/PublicationBindings.js";
import type { PublicationDependencies } from "../../src/application/bindings/PublicationBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import { EvidenceReference } from "../../src/shared/evidence/EvidenceReference.js";
import { AuthorityId, DecisionId, EvidenceId, ReviewId, TenantId } from "../../src/shared/identity/index.js";
import { AuthorityReference, DecisionReference, ReviewReference } from "../../src/shared/references/index.js";
import type { ApplicationCommandContext, PublicationCommandRequestDto } from "../../src/application/dto/ApplicationContext.js";
const deps = { mission: {}, references: {}, governance: {}, review: {}, connectorEvidence: {} } as PublicationDependencies;
test("Publication exposes five commands and one query", () => { assert.deepEqual(Object.keys(createPublicationBindings(deps)).sort(), ["archivePublication", "authorizePublication", "createPublication", "getPublication", "preparePublication", "recordPublicationOutcome"]); });
test("Publication requires all collaborators", () => { assert.throws(() => createPublicationBindings({ ...deps, review: undefined } as unknown as PublicationDependencies), /collaborators are required/u); });

const tenantId = "tenant_publication_api"; const now = "2026-07-28T15:00:00.000Z"; const tenant = TenantId.from(tenantId); const reviewReference = new ReviewReference(ReviewId.from("review_publication_api"), tenant);
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_publication_api" }, correlationId: "correlation_publication_api", causationId: "causation_publication_api" };
const audit = { occurredAt: now, evidence: [{ evidenceId: "evidence_publication_api", source: "publication-api-test", type: "fixture", capturedAt: now }], lineage: [{ sourceId: "asset_publication_api", targetId: "publication_api", relationship: "publishes", declaredAt: now }] };
const portEvidence = [new EvidenceReference({ evidenceId: EvidenceId.from("evidence_publication_port"), source: "publication-api-test", type: "authorization", capturedAt: now })];
const collaborators: PublicationDependencies = { mission: { validateMissionReference: async () => undefined, missionAllowsPublication: async () => true }, references: { validateAssetReference: async () => undefined, validateAssetVersionReference: async () => undefined, validateKnowledgeReference: async () => undefined }, review: { validatePublicationEligibility: async () => ({ status: "ELIGIBLE", reviewReference, reviewConclusionId: "review_conclusion_publication_api", validatedAt: now, evidence: portEvidence }) }, governance: { authorizePublication: async () => ({ status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_publication_api"), tenant), authorityReferences: [new AuthorityReference(AuthorityId.from("authority_publication_api"), tenant)], authorizedAt: now, evidence: portEvidence }), authorizeArchive: async () => ({ status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from("decision_publication_archive_api"), tenant), authorityReferences: [new AuthorityReference(AuthorityId.from("authority_publication_api"), tenant)], authorizedAt: now, evidence: portEvidence }) }, connectorEvidence: { validatePublicationObservations: async () => undefined } };
function command(key: string, payload: Record<string, unknown> = {}): PublicationCommandRequestDto { return { idempotencyKey: key, reason: key, targetId: "publication_api", payload: { ...audit, ...payload } }; }

test("Publication executes five commands and its query through M12", async () => {
  const provider = new ReferencePersistenceProvider(); const api = new PublicationApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider)), collaborators);
  const create = command("create-publication", { publicationId: "publication_api", packageId: "publication_package_api", missionReference: { id: "mission_publication_api", tenantId }, items: [{ assetReference: { id: "asset_publication_api", tenantId }, assetVersionReference: { assetId: "asset_publication_api", versionId: "asset_version_publication_api", tenantId } }], destinations: [{ key: "primary", audience: "Institutional audience", purpose: "Governed distribution" }], knowledgeReferences: [{ id: "knowledge_publication_api", tenantId }], metadata: { label: "publication package" } });
  const first = await api.createPublication(create, context); assert.deepEqual(await api.createPublication(create, context), first);
  await api.preparePublication(command("prepare-publication", { reviewReference: { id: "review_publication_api", tenantId } }), context);
  await api.authorizePublication(command("authorize-publication", { reviewReference: { id: "review_publication_api", tenantId } }), context);
  await api.recordPublicationOutcome(command("record-outcome", { publicationVersionId: "publication_version_api", observationBatchKey: "batch-api", observations: [{ recordId: "publication_record_api", connectorReference: { id: "connector_publication_api", tenantId }, destinationKey: "primary", result: "SUCCESS", observedAt: now, externalIdentifier: "external-api", evidence: [{ evidenceId: "evidence_publication_observation", source: "connector-api-test", type: "external-observation", capturedAt: now }] }] }), context);
  await api.archivePublication(command("archive-publication"), context);
  const publication = await api.getPublication({ targetId: "publication_api" }, { tenantId, correlationId: context.correlationId }); assert.deepEqual(publication, { publicationId: "publication_api", tenantId, status: "ARCHIVED", version: 5 }); assert.equal("versions" in (publication as unknown as Record<string, unknown>), false);
  assert.equal(provider.listAuditRecords(tenantId).length, 5);
});

test("Publication validates before opening Unit of Work", () => { let opened = 0; const api = new PublicationApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("must not open"); } }), new ApplicationQueryRunner({ open: () => { throw new Error("must not read"); } }), collaborators); assert.throws(() => api.createPublication({ idempotencyKey: "invalid", reason: "invalid", payload: {} }, context), /publicationId/u); assert.equal(opened, 0); });
