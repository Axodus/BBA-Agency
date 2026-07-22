import assert from "node:assert/strict";
import test from "node:test";
import { CorrelationId } from "../../../src/shared/common/CorrelationId.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../src/shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../src/shared/errors/TenantViolation.js";
import { ValidationError } from "../../../src/shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, AuthorityId, DecisionId, EvidenceId, MissionId, TenantId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AuthorityReference, DecisionReference, InstitutionalActorReference, MissionReference } from "../../../src/shared/references/index.js";
import { Version } from "../../../src/shared/version/Version.js";
import { archiveAsset, createAsset, createAssetRelationship, createAssetVersion, produceAsset, supersedeAsset } from "../../../src/modules/institutional-assets/application/index.js";
import { Asset, type AssetSnapshot } from "../../../src/modules/institutional-assets/domain/Asset.js";
import { AssetAuthorityContext } from "../../../src/modules/institutional-assets/domain/AssetAuthorityContext.js";
import { AssetClassification, AssetTag } from "../../../src/modules/institutional-assets/domain/AssetClassification.js";
import type { CreateAssetCommand, GovernedAssetAuditInput } from "../../../src/modules/institutional-assets/domain/AssetCommands.js";
import { AssetMetadata } from "../../../src/modules/institutional-assets/domain/AssetMetadata.js";
import { CanonicalContent } from "../../../src/modules/institutional-assets/domain/CanonicalContent.js";
import { InMemoryAssetRelationshipGraph } from "../../../src/modules/institutional-assets/infrastructure/InMemoryAssetRelationshipGraph.js";
import { InMemoryAssetRepository } from "../../../src/modules/institutional-assets/infrastructure/InMemoryAssetRepository.js";
import { InMemoryAssetUnitOfWork } from "../../../src/modules/institutional-assets/infrastructure/InMemoryAssetUnitOfWork.js";
import type { AssetUnitOfWorkPort } from "../../../src/modules/institutional-assets/ports/AssetUnitOfWorkPort.js";

const now = "2026-07-22T12:00:00.000Z";
const tenant = TenantId.from("tenant_alpha");
const otherTenant = TenantId.from("tenant_beta");

function decision(referenceTenant = tenant): DecisionReference { return new DecisionReference(DecisionId.from("decision_asset"), referenceTenant); }
function authority(referenceTenant = tenant): AuthorityReference { return new AuthorityReference(AuthorityId.from("authority_steward"), referenceTenant); }
function evidence(id = "evidence_asset"): readonly EvidenceReference[] { return [new EvidenceReference({ evidenceId: EvidenceId.from(id), source: "institutional-review", type: "decision-record", capturedAt: now })]; }
function lineage(source = "mission_alpha", target = "asset_source"): readonly LineageReference[] { return [new LineageReference({ sourceId: source, targetId: target, relationship: "originates_from", declaredAt: now })]; }
function audit(): GovernedAssetAuditInput { return { reason: "Authorized institutional operation", occurredAt: now, correlationId: CorrelationId.from("correlation_asset"), evidence: evidence(), lineage: lineage(), authorityReference: authority(), decisionReference: decision() }; }
function createCommand(assetToken: string, versionToken = `${assetToken}_v1`): CreateAssetCommand {
  const assetId = AssetId.from(`asset_${assetToken}`);
  const actor = new InstitutionalActorReference("person:steward", tenant);
  return {
    assetId,
    tenantId: tenant,
    missionReference: new MissionReference(MissionId.from("mission_alpha"), tenant),
    metadata: new AssetMetadata({ title: `Asset ${assetToken}`, summary: "Canonical institutional meaning", purpose: "Preserve governed knowledge", createdAt: now, updatedAt: now }),
    classification: new AssetClassification({ primaryCategory: "KNOWLEDGE", secondaryCategories: ["GUIDELINE"], sensitivity: "INTERNAL", tags: [new AssetTag("Core-Knowledge")] }),
    authorityContext: new AssetAuthorityContext({ ownerReference: actor, stewardReference: actor, custodianReference: actor, authorReferences: [actor], decisionReference: decision() }),
    initialVersionId: AssetVersionId.from(`asset_version_${versionToken}`),
    content: new CanonicalContent({ meaning: "Institutional policy", data: { claim: "Human authority remains final", sections: ["scope", "rule"] }, language: "en" }),
    authorityDecisionReference: decision(),
    reason: "Initial canonical production",
    occurredAt: now,
    correlationId: CorrelationId.from("correlation_create"),
    evidence: evidence(),
    lineage: lineage("mission_alpha", assetId.toString())
  };
}
function published(asset: Asset): Asset { return Asset.rehydrate({ ...asset.toSnapshot(), status: "PUBLISHED" } as AssetSnapshot); }

test("Asset starts PROPOSED with one immutable DRAFT version and complete audit events", () => {
  const command = createCommand("foundation");
  const asset = Asset.create(command);
  assert.equal(asset.status, "PROPOSED");
  assert.equal(asset.versions.length, 1);
  assert.equal(asset.currentVersionId.toString(), "asset_version_foundation_v1");
  assert.equal(asset.currentAssetVersion.governanceState, "DRAFT");
  assert.equal(asset.version.value, 1);
  assert.deepEqual(asset.domainEvents.map((event) => event.toJSON().type), ["AssetCreated", "AssetVersionCreated"]);
  const event = asset.domainEvents[0]?.toJSON();
  assert.equal(event?.tenantId, tenant.toString());
  assert.equal(event?.correlationId, "correlation_create");
  assert.deepEqual(event?.evidenceIds, ["evidence_asset"]);
  assert.equal(Array.isArray(event?.lineage), true);
  assert.equal(Object.isFrozen(asset.currentAssetVersion), true);
  assert.equal(Object.isFrozen(asset.currentAssetVersion.content.data), true);
});

test("CanonicalContent and classification describe institutional meaning, not physical formats", () => {
  assert.throws(() => new CanonicalContent({ meaning: "File", data: { filename: "asset.pdf" } }), ValidationError);
  assert.throws(() => new AssetClassification({ primaryCategory: "PDF" as "KNOWLEDGE", sensitivity: "INTERNAL" }), ValidationError);
  const classification = createCommand("classification").classification;
  assert.equal(classification.primaryCategory, "KNOWLEDGE");
  assert.equal(classification.tags[0]?.value, "core-knowledge");
});

test("Asset lifecycle exposes only locally owned transitions", () => {
  const asset = Asset.create(createCommand("lifecycle"));
  asset.produce(audit());
  assert.equal(asset.status, "PRODUCED");
  assert.equal(asset.version.value, 2);
  assert.throws(() => asset.produce(audit()), InvariantViolation);
  assert.throws(() => asset.archive(audit()), InvariantViolation);
  assert.equal("approve" in asset, false);
  assert.equal("publish" in asset, false);
  const archived = published(Asset.create(createCommand("archive")));
  archived.archive(audit());
  assert.equal(archived.status, "ARCHIVED");
});

test("CreateVersion preserves prior versions and moves only currentVersionId", () => {
  const asset = Asset.create(createCommand("versions"));
  const original = asset.currentAssetVersion.toSnapshot();
  const expected = asset.version;
  asset.createVersion({ versionId: AssetVersionId.from("asset_version_versions_v2"), content: new CanonicalContent({ meaning: "Revised policy", data: { claim: "Version two" } }), authorityDecisionReference: decision(), reason: "Approved correction", occurredAt: now, correlationId: CorrelationId.from("correlation_version"), evidence: evidence("evidence_version"), lineage: lineage("asset_version_versions_v1", "asset_version_versions_v2") });
  assert.equal(asset.version.value, expected.value + 1);
  assert.equal(asset.versions.length, 2);
  assert.deepEqual(asset.versions[0]?.toSnapshot(), original);
  assert.equal(asset.currentVersionId.toString(), "asset_version_versions_v2");
  assert.equal(asset.currentAssetVersion.number.value, 2);
  assert.equal(asset.currentAssetVersion.governanceState, "DRAFT");
  const restored = Asset.rehydrate(asset.toSnapshot());
  assert.deepEqual(restored.toSnapshot(), asset.toSnapshot());
  assert.deepEqual(restored.domainEvents, []);
});

test("Authority context, versions and repository reject cross-Tenant references", async () => {
  const actor = new InstitutionalActorReference("person:owner", tenant);
  assert.throws(() => new AssetAuthorityContext({ ownerReference: actor, stewardReference: new InstitutionalActorReference("person:steward", otherTenant), custodianReference: actor, authorReferences: [actor] }), InvariantViolation);
  const repository = new InMemoryAssetRepository();
  const asset = await createAsset(repository, createCommand("tenant"));
  await assert.rejects(repository.findById(otherTenant, asset.id), TenantViolation);
  assert.throws(() => asset.createVersion({ versionId: AssetVersionId.from("asset_version_cross_tenant"), content: asset.currentAssetVersion.content, authorityDecisionReference: decision(otherTenant), reason: "Invalid tenant", occurredAt: now, correlationId: CorrelationId.from("correlation_cross"), evidence: evidence(), lineage: lineage() }), InvariantViolation);
});

test("application use cases persist creation, production and immutable version history", async () => {
  const repository = new InMemoryAssetRepository();
  const asset = await createAsset(repository, createCommand("application"));
  await produceAsset(repository, tenant, asset.id, audit());
  const updated = await createAssetVersion(repository, tenant, asset.id, { versionId: AssetVersionId.from("asset_version_application_v2"), content: new CanonicalContent({ meaning: "Updated", data: { claim: "Second" } }), authorityDecisionReference: decision(), reason: "Revision", occurredAt: now, correlationId: CorrelationId.from("correlation_revision"), evidence: evidence(), lineage: lineage("asset_version_application_v1", "asset_version_application_v2") });
  assert.equal(updated.status, "PRODUCED");
  assert.equal(updated.currentAssetVersion.number.value, 2);
  assert.equal((await repository.findById(tenant, asset.id))?.versions.length, 2);
});

test("relationship graph rejects lineage cycles but permits reference cycles", async () => {
  const repository = new InMemoryAssetRepository();
  const graph = new InMemoryAssetRelationshipGraph(repository);
  const first = await createAsset(repository, createCommand("graph_a"));
  const second = await createAsset(repository, createCommand("graph_b"));
  const base = { tenantId: tenant, authorityReference: authority(), decisionReference: decision(), rationale: "Canonical relation", reason: "Register relation", createdAt: now, occurredAt: now, correlationId: CorrelationId.from("correlation_graph"), evidence: evidence(), lineage: lineage() };
  await createAssetRelationship(repository, graph, { ...base, sourceAssetId: first.id, targetAssetId: second.id, type: "DERIVES_FROM" });
  await assert.rejects(createAssetRelationship(repository, graph, { ...base, sourceAssetId: second.id, targetAssetId: first.id, type: "DERIVES_FROM" }), /lineage cycle/u);
  await createAssetRelationship(repository, graph, { ...base, sourceAssetId: first.id, targetAssetId: second.id, type: "REFERENCES" });
  await createAssetRelationship(repository, graph, { ...base, sourceAssetId: second.id, targetAssetId: first.id, type: "REFERENCES" });
});

test("SupersedeAsset records successor SUPERSEDES previous and commits both Assets", async () => {
  const repository = new InMemoryAssetRepository();
  const graph = new InMemoryAssetRelationshipGraph(repository);
  const previous = published(Asset.create(createCommand("previous")));
  const successor = Asset.create(createCommand("successor"));
  await repository.save(previous, Version.initial());
  await repository.save(successor, Version.initial());
  const result = await supersedeAsset(repository, graph, new InMemoryAssetUnitOfWork(repository), { ...audit(), tenantId: tenant, previousAssetId: previous.id, successorAssetId: successor.id, rationale: "Successor replaces prior canonical Asset" });
  assert.equal(result.previous.status, "SUPERSEDED");
  assert.equal(result.previous.supersededBy?.id.toString(), successor.id.toString());
  assert.equal(result.relationship.source.id.toString(), successor.id.toString());
  assert.equal(result.relationship.target.id.toString(), previous.id.toString());
  assert.equal(result.relationship.type, "SUPERSEDES");
  assert.equal((await repository.findById(tenant, successor.id))?.relationships.length, 1);
  assert.equal(await graph.wouldCreateSupersessionCycle(tenant, previous.id, successor.id), true);
});

test("SupersedeAsset keeps repository state unchanged when logical atomic commit fails", async () => {
  const repository = new InMemoryAssetRepository();
  const graph = new InMemoryAssetRelationshipGraph(repository);
  const previous = published(Asset.create(createCommand("atomic_previous")));
  const successor = Asset.create(createCommand("atomic_successor"));
  await repository.save(previous, Version.initial());
  await repository.save(successor, Version.initial());
  const failingUnit: AssetUnitOfWorkPort = { commitSupersession: async () => { throw new ConcurrencyConflict("simulated conflict"); } };
  await assert.rejects(supersedeAsset(repository, graph, failingUnit, { ...audit(), tenantId: tenant, previousAssetId: previous.id, successorAssetId: successor.id, rationale: "Atomic failure" }), ConcurrencyConflict);
  assert.equal((await repository.findById(tenant, previous.id))?.status, "PUBLISHED");
  assert.equal((await repository.findById(tenant, successor.id))?.relationships.length, 0);
});

test("repository contract enforces optimistic concurrency", async () => {
  const repository = new InMemoryAssetRepository();
  const created = await createAsset(repository, createCommand("concurrency"));
  const first = await repository.findById(tenant, created.id);
  const second = await repository.findById(tenant, created.id);
  assert.ok(first !== null && second !== null);
  const expectedFirst = first.version;
  const expectedSecond = second.version;
  first.produce(audit());
  second.produce(audit());
  await repository.save(first, expectedFirst);
  await assert.rejects(repository.save(second, expectedSecond), ConcurrencyConflict);
});

test("archive use case persists only the canonical PUBLISHED to ARCHIVED transition", async () => {
  const repository = new InMemoryAssetRepository();
  const asset = published(Asset.create(createCommand("archive_use_case")));
  await repository.save(asset, Version.initial());
  const archived = await archiveAsset(repository, tenant, asset.id, audit());
  assert.equal(archived.status, "ARCHIVED");
  assert.equal((await repository.findById(tenant, asset.id))?.status, "ARCHIVED");
});
