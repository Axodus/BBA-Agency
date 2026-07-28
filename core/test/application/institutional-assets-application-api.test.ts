import assert from "node:assert/strict";
import { test } from "node:test";
import { InstitutionalAssetsApplicationApi } from "../../src/application/bindings/InstitutionalAssetsApplicationApi.js";
import { institutionalAssetsBindings } from "../../src/application/bindings/InstitutionalAssetsBindings.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import type { ApplicationCommandContext, OperationCommandDto, QueryContext } from "../../src/application/dto/ApplicationContext.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";

const tenantId = "tenant_assets_application_api";
const assetId = "asset_assets_application_api";
const context: ApplicationCommandContext = { tenantId, actor: { reference: "steward_assets_application_api" }, correlationId: "correlation_assets_application_api", causationId: "causation_assets_application_api" };
const queryContext: QueryContext = { tenantId, actor: context.actor, correlationId: context.correlationId };
const timestamp = "2026-07-27T15:00:00.000Z";

function audit(prefix: string) { return { occurredAt: timestamp, evidence: [{ evidenceId: `evidence_${prefix}`, source: "application-api-test", type: "fixture", capturedAt: timestamp }], lineage: [{ sourceId: `source_${prefix}`, targetId: assetId, relationship: "originates_from", declaredAt: timestamp }] }; }
function createCommand(idempotencyKey: string, id = assetId): OperationCommandDto { return { idempotencyKey, reason: "Register governed Asset", payload: { assetId: id, initialVersionId: `asset_version_${id}_1`, missionId: "mission_assets_application_api", authorityDecisionId: "decision_assets_application_api", metadata: { title: "Application API Asset", summary: "Stable public projection fixture", purpose: "Verify Institutional Assets API", createdAt: timestamp, updatedAt: timestamp }, classification: { primaryCategory: "KNOWLEDGE", secondaryCategories: ["GUIDELINE"], sensitivity: "INTERNAL", tags: ["api-test"] }, authorityContext: { ownerReference: { reference: "person:owner", tenantId }, stewardReference: { reference: "person:steward", tenantId }, custodianReference: { reference: "person:custodian", tenantId }, authorReferences: [{ reference: "person:author", tenantId }], decisionReference: { id: "decision_assets_application_api", tenantId } }, content: { meaning: "Governed institutional meaning", data: { claim: "Human authority remains final" }, language: "en" }, ...audit(idempotencyKey) } }; }

function api(provider: ReferencePersistenceProvider): InstitutionalAssetsApplicationApi { return new InstitutionalAssetsApplicationApi(new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)), new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider))); }

test("Institutional Assets exposes only the executable 5-operation surface", () => {
  assert.deepEqual(Object.keys(institutionalAssetsBindings).sort(), ["createAsset", "getAsset", "listAssets", "registerAsset", "retireAsset"]);
});

test("Institutional Assets create/register alias uses distinct operation identity and generic replay", async () => {
  const provider = new ReferencePersistenceProvider().withOutboxProjection({ isEligible: () => true, createPayloadReference: (input) => `event-store://${input.tenantId}/${input.aggregateType}/${input.aggregateId}/${input.eventSequence}` }) as ReferencePersistenceProvider;
  const application = api(provider);
  const created = await application.createAsset(createCommand("create-assets-api"), context);
  assert.deepEqual(created.resourceReferences, [{ resourceType: "Asset", resourceId: assetId }]);
  assert.deepEqual(await application.createAsset(createCommand("create-assets-api"), context), created);
  const registered = await application.registerAsset(createCommand("register-assets-api", "asset_assets_application_api_alias"), context);
  assert.deepEqual(registered.resourceReferences, [{ resourceType: "Asset", resourceId: "asset_assets_application_api_alias" }]);
  assert.equal(provider.listAuditRecords(tenantId).length, 2);
  const asset = await application.getAsset({ targetId: assetId }, queryContext);
  assert.equal(asset?.status, "PROPOSED");
  assert.equal("evidence" in (asset ?? {}), false);
  const assets = await application.listAssets({}, queryContext);
  assert.equal(assets.length, 2);
});

test("Institutional Assets validation happens before opening the Unit of Work", () => {
  let opened = 0;
  const application = new InstitutionalAssetsApplicationApi(new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("Unit of Work must not open"); } }), new ApplicationQueryRunner({ open: () => { throw new Error("Query session must not open"); } }));
  assert.throws(() => application.createAsset({ idempotencyKey: "invalid-assets-api", reason: "Invalid", payload: {} }, context), /assetId/u);
  assert.equal(opened, 0);
});
