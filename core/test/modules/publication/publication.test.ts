import assert from "node:assert/strict";
import test from "node:test";
import { CausationId, CorrelationId } from "../../../src/shared/common/index.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, AuthorityId, ConnectorId, DecisionId, EvidenceId, KnowledgeId, MissionId, PublicationId, PublicationPackageId, PublicationRecordId, PublicationVersionId, ReviewId, TenantId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AssetReference, AssetVersionReference, AuthorityReference, ConnectorReference, DecisionReference, KnowledgeReference, MissionReference, ReviewReference } from "../../../src/shared/references/index.js";
import { Version } from "../../../src/shared/version/Version.js";
import { archivePublication, authorizePublication, createPublication, preparePublication, recordPublicationOutcome } from "../../../src/modules/publication/application/index.js";
import { EligibilityResult, Publication, PublicationAuthorization, PublicationDestination, PublicationEligibility, PublicationRecordResult, PublicationResult, PublicationStatus, type ArchivePublicationCommand, type AuthorizePublicationCommand, type CreatePublicationCommand, type PreparePublicationCommand, type PublicationAuditInput, type PublicationSnapshot, type RecordPublicationOutcomeCommand } from "../../../src/modules/publication/domain/index.js";
import { InMemoryPublicationRepository } from "../../../src/modules/publication/infrastructure/index.js";
import type { PublicationAuthorizationResult, PublicationConnectorEvidencePort, PublicationGovernancePort, PublicationMissionPort, PublicationReferenceValidationPort, PublicationRepositoryPort, PublicationReviewEligibilityResult, PublicationReviewPort } from "../../../src/modules/publication/ports/index.js";

const now = "2026-07-22T12:00:00.000Z";
const later = "2026-07-22T13:00:00.000Z";
const tenantId = TenantId.from("tenant_publication");
const otherTenantId = TenantId.from("tenant_other");
const publicationId = PublicationId.from("publication_main");
const packageId = PublicationPackageId.from("publication_package_main");
const missionReference = new MissionReference(MissionId.from("mission_publication"), tenantId);
const assetReference = new AssetReference(AssetId.from("asset_publication"), tenantId);
const assetVersionReference = new AssetVersionReference(AssetId.from("asset_publication"), AssetVersionId.from("asset_version_publication"), tenantId);
const knowledgeReference = new KnowledgeReference(KnowledgeId.from("knowledge_publication"), tenantId);
const reviewReference = new ReviewReference(ReviewId.from("review_publication"), tenantId);
const connectorReference = new ConnectorReference(ConnectorId.from("connector_publication"), tenantId);

function evidence(suffix: string): readonly EvidenceReference[] {
  return [new EvidenceReference({ evidenceId: EvidenceId.from(`evidence_pub_${suffix}`), source: "publication-test", type: "test-record", capturedAt: now })];
}
function lineage(suffix: string): readonly LineageReference[] {
  return [new LineageReference({ sourceId: `publication_${suffix}`, targetId: `asset_${suffix}`, relationship: "publishes", declaredAt: now })];
}
function audit(suffix: string, occurredAt = now): PublicationAuditInput {
  return {
    reason: `publication ${suffix}`, occurredAt, correlationId: CorrelationId.from(`correlation_pub_${suffix}`),
    causationId: CausationId.from(`causation_pub_${suffix}`), evidence: evidence(suffix), lineage: lineage(suffix)
  };
}
function destination(key: string, tenant = tenantId): PublicationDestination {
  return new PublicationDestination({ tenantId: tenant, key, audience: `audience ${key}`, purpose: `purpose ${key}` });
}
function createCommand(destinations = [destination("primary")]): CreatePublicationCommand {
  return {
    ...audit("create"), publicationId, packageId, tenantId, missionReference,
    items: [{ assetReference, assetVersionReference }],
    destinations, knowledgeReferences: [knowledgeReference], metadata: { label: "publication package" }
  };
}
function prepareCommand(suffix = "prepare"): PreparePublicationCommand { return audit(suffix); }
function authorizeCommand(suffix = "authorize"): AuthorizePublicationCommand { return audit(suffix); }
function archiveCommand(suffix = "archive"): ArchivePublicationCommand { return audit(suffix, later); }
function outcomeCommand(suffix: string, result: "SUCCESS" | "FAILED" = PublicationRecordResult.SUCCESS, destinations = ["primary"]): RecordPublicationOutcomeCommand {
  return {
    ...audit(`outcome-${suffix}`, later),
    publicationVersionId: PublicationVersionId.from(`publication_version_${suffix}`),
    observationBatchKey: `batch-${suffix}`,
    observations: destinations.map((destinationKey, index) => ({
      recordId: PublicationRecordId.from(`publication_record_${suffix}_${index}`),
      connectorReference, destinationKey, result, observedAt: later, evidence: evidence(`record-${suffix}-${index}`),
      ...(result === PublicationRecordResult.SUCCESS ? { externalIdentifier: `external-${suffix}-${index}` } : { failureReason: `failure-${suffix}-${index}` })
    }))
  };
}

test("Publication package is immutable, Tenant-bound and pairs Asset with exact AssetVersion", () => {
  const publication = Publication.create(createCommand([destination("primary"), destination("secondary")]));
  assert.equal(publication.status, PublicationStatus.DRAFT);
  assert.equal(publication.package.items.length, 1);
  assert.equal(publication.package.destinations.length, 2);
  assert.equal(Object.isFrozen(publication.package.toSnapshot()), true);
  assert.throws(() => Publication.create(createCommand([])), /at least one item and destination/u);
  assert.throws(() => Publication.create({ ...createCommand(), items: [{ assetReference, assetVersionReference: new AssetVersionReference(AssetId.from("asset_other"), AssetVersionId.from("asset_version_other"), tenantId) }] }), /same Asset/u);
  assert.throws(() => Publication.create(createCommand([destination("primary"), destination("primary")])), /duplicate destinations/u);
  assert.throws(() => Publication.create(createCommand([destination("external", otherTenantId)])), /Publication Tenant/u);
});

test("Publication lifecycle separates Review eligibility, Governance authorization and external evidence", async () => {
  const repository = new InMemoryPublicationRepository();
  const ports = new Ports();
  await createPublication(repository, ports, ports, createCommand());
  let publication = await preparePublication(repository, ports, ports, tenantId, publicationId, reviewReference, prepareCommand());
  assert.equal(publication.status, PublicationStatus.READY);
  publication = await authorizePublication(repository, ports, ports, tenantId, publicationId, reviewReference, authorizeCommand());
  assert.equal(publication.status, PublicationStatus.AUTHORIZED_FOR_CONNECTOR);
  publication = await recordPublicationOutcome(repository, ports, tenantId, publicationId, outcomeCommand("success"));
  assert.equal(publication.status, PublicationStatus.PUBLISHED);
  assert.equal(publication.versions[0]?.result, PublicationResult.SUCCESS);
  assert.equal(publication.currentVersionId?.id.toString(), "publication_version_success");
  publication = await archivePublication(repository, ports, tenantId, publicationId, archiveCommand());
  assert.equal(publication.status, PublicationStatus.ARCHIVED);
});

test("PARTIAL and FAILED attempts append immutable versions without promoting to PUBLISHED", async () => {
  const repository = new InMemoryPublicationRepository();
  const ports = new Ports();
  await createPublication(repository, ports, ports, createCommand([destination("a"), destination("b")]));
  await preparePublication(repository, ports, ports, tenantId, publicationId, reviewReference, prepareCommand("prepare-retry"));
  await authorizePublication(repository, ports, ports, tenantId, publicationId, reviewReference, authorizeCommand("authorize-retry"));
  const partial = outcomeCommand("partial", PublicationRecordResult.SUCCESS, ["a", "b"]);
  const failedObservation = {
    recordId: partial.observations[1]!.recordId,
    connectorReference: partial.observations[1]!.connectorReference,
    destinationKey: partial.observations[1]!.destinationKey,
    result: PublicationRecordResult.FAILED,
    observedAt: partial.observations[1]!.observedAt,
    failureReason: "destination failed",
    evidence: partial.observations[1]!.evidence
  };
  const partialWithFailure = {
    ...partial,
    observations: [partial.observations[0]!, failedObservation]
  };
  let publication = await recordPublicationOutcome(repository, ports, tenantId, publicationId, partialWithFailure);
  assert.equal(publication.status, PublicationStatus.AUTHORIZED_FOR_CONNECTOR);
  assert.equal(publication.versions[0]?.versionNumber.value, 1);
  assert.equal(publication.versions[0]?.result, PublicationResult.PARTIAL);
  publication = await recordPublicationOutcome(repository, ports, tenantId, publicationId, outcomeCommand("failed", PublicationRecordResult.FAILED, ["a", "b"]));
  assert.equal(publication.status, PublicationStatus.AUTHORIZED_FOR_CONNECTOR);
  assert.equal(publication.versions[1]?.versionNumber.value, 2);
  assert.equal(publication.versions[1]?.result, PublicationResult.FAILED);
  publication = await recordPublicationOutcome(repository, ports, tenantId, publicationId, outcomeCommand("success-retry", PublicationRecordResult.SUCCESS, ["a", "b"]));
  assert.equal(publication.status, PublicationStatus.PUBLISHED);
  assert.equal(publication.versions[2]?.versionNumber.value, 3);
  assert.equal(publication.currentVersionId?.id.toString(), "publication_version_success-retry");
});

test("PublicationRecord enforces SUCCESS and FAILED evidence semantics", () => {
  const publication = Publication.create(createCommand());
  const unauthorized = outcomeCommand("unauthorized");
  assert.throws(() => publication.recordOutcome(unauthorized), /cannot record outcome from DRAFT/u);
  const ports = new Ports();
  const ready = Publication.create(createCommand());
  ready.prepare(prepareCommand("prepare-record"), ports.eligibility());
  ready.authorize(authorizeCommand("authorize-record"), ports.authorization());
  const successObservation = outcomeCommand("bad-success").observations[0]!;
  assert.throws(() => ready.recordOutcome({
    ...outcomeCommand("bad-success"),
    observations: [{
      recordId: successObservation.recordId, connectorReference: successObservation.connectorReference,
      destinationKey: successObservation.destinationKey, result: successObservation.result,
      observedAt: successObservation.observedAt, evidence: successObservation.evidence
    }]
  }), /externalIdentifier/u);
  const failureObservation = outcomeCommand("bad-failure", PublicationRecordResult.FAILED).observations[0]!;
  assert.throws(() => ready.recordOutcome({
    ...outcomeCommand("bad-failure", PublicationRecordResult.FAILED),
    observations: [{
      recordId: failureObservation.recordId, connectorReference: failureObservation.connectorReference,
      destinationKey: failureObservation.destinationKey, result: failureObservation.result,
      observedAt: failureObservation.observedAt, evidence: failureObservation.evidence
    }]
  }), /failureReason/u);
  assert.throws(() => ready.recordOutcome({ ...outcomeCommand("extra"), observations: [...outcomeCommand("extra").observations, { ...outcomeCommand("extra").observations[0]!, recordId: PublicationRecordId.from("publication_record_extra_2"), destinationKey: "other" }] }), /exact destination coverage/u);
});

test("observationBatchKey is idempotent and failed validation does not consume version numbers", async () => {
  const repository = new InMemoryPublicationRepository();
  const ports = new Ports();
  await createPublication(repository, ports, ports, createCommand());
  await preparePublication(repository, ports, ports, tenantId, publicationId, reviewReference, prepareCommand("prepare-idempotent"));
  await authorizePublication(repository, ports, ports, tenantId, publicationId, reviewReference, authorizeCommand("authorize-idempotent"));
  ports.connectorFailure = new Error("invalid evidence");
  await assert.rejects(recordPublicationOutcome(repository, ports, tenantId, publicationId, outcomeCommand("blocked")), /invalid evidence/u);
  let stored = await repository.findById(tenantId, publicationId);
  assert.equal(stored?.versions.length, 0);
  ports.connectorFailure = null;
  await recordPublicationOutcome(repository, ports, tenantId, publicationId, outcomeCommand("retry-after-block", PublicationRecordResult.FAILED));
  stored = await repository.findById(tenantId, publicationId);
  assert.equal(stored?.versions[0]?.versionNumber.value, 1);
  await assert.rejects(recordPublicationOutcome(repository, ports, tenantId, publicationId, { ...outcomeCommand("retry-after-block", PublicationRecordResult.FAILED), publicationVersionId: PublicationVersionId.from("publication_version_duplicate") }), /already recorded/u);
});

test("snapshots and manifests are deterministic immutable attempt snapshots", () => {
  const ports = new Ports();
  const publication = Publication.create(createCommand());
  publication.prepare(prepareCommand("prepare-snapshot"), ports.eligibility());
  publication.authorize(authorizeCommand("authorize-snapshot"), ports.authorization());
  publication.recordOutcome(outcomeCommand("snapshot"));
  const snapshot = publication.toSnapshot();
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(snapshot.versions[0]?.manifest.authorizationSnapshot.eligibility.reviewConclusionId, "review_conclusion_publication");
  const restored = Publication.rehydrate(snapshot);
  assert.deepEqual(restored.toSnapshot(), snapshot);
  assert.equal(restored.serialize(), publication.serialize());
  const parsed = JSON.parse(publication.serialize()) as PublicationSnapshot;
  assert.deepEqual(Publication.rehydrate(parsed).toSnapshot(), snapshot);
  assert.equal(restored.domainEvents.length, 0);
});

test("repository returns reconstructed snapshots and enforces optimistic concurrency", async () => {
  const repository = new InMemoryPublicationRepository();
  const publication = Publication.create(createCommand());
  await repository.save(publication, Version.initial());
  const first = await repository.findById(tenantId, publicationId);
  const second = await repository.findById(tenantId, publicationId);
  assert.ok(first && second);
  const ports = new Ports();
  first.prepare(prepareCommand("concurrency-a"), ports.eligibility("a"));
  second.prepare(prepareCommand("concurrency-b"), ports.eligibility("b"));
  await repository.save(first, Version.from(1));
  await assert.rejects(repository.save(second, Version.from(1)), ConcurrencyConflict);
  await assert.rejects(repository.findById(otherTenantId, publicationId), /Tenant boundary/u);
});

test("events emit deterministic publication outcome then published order", () => {
  const ports = new Ports();
  const publication = Publication.create(createCommand());
  publication.prepare(prepareCommand("prepare-events"), ports.eligibility("events"));
  publication.authorize(authorizeCommand("authorize-events"), ports.authorization("events"));
  publication.recordOutcome(outcomeCommand("events"));
  const eventTypes = publication.domainEvents.map((event) => event.toJSON().type);
  assert.deepEqual(eventTypes, ["PublicationCreated", "PublicationPrepared", "PublicationAuthorized", "PublicationOutcomeRecorded", "PublicationPublished"]);
  const outcomeEvent = publication.domainEvents.at(-2)?.toJSON();
  assert.equal((outcomeEvent?.payload as { result?: string }).result, PublicationResult.SUCCESS);
  assert.deepEqual((outcomeEvent?.payload as { recordIds?: string[] }).recordIds, ["publication_record_events_0"]);
});

class Ports implements PublicationMissionPort, PublicationReferenceValidationPort, PublicationReviewPort, PublicationGovernancePort, PublicationConnectorEvidencePort {
  public connectorFailure: Error | null = null;
  public calls: string[] = [];
  public async validateMissionReference(): Promise<void> { this.calls.push("mission:validate"); }
  public async missionAllowsPublication(): Promise<boolean> { this.calls.push("mission:allows"); return true; }
  public async validateAssetReference(): Promise<void> { this.calls.push("reference:asset"); }
  public async validateAssetVersionReference(): Promise<void> { this.calls.push("reference:asset-version"); }
  public async validateKnowledgeReference(): Promise<void> { this.calls.push("reference:knowledge"); }
  public async validatePublicationEligibility(): Promise<PublicationReviewEligibilityResult> { this.calls.push("review:eligibility"); return this.eligibilityResult(); }
  public async authorizePublication(): Promise<PublicationAuthorizationResult> { this.calls.push("governance:publication"); return this.authorizationResult(); }
  public async authorizeArchive(): Promise<PublicationAuthorizationResult> { this.calls.push("governance:archive"); return this.authorizationResult("archive"); }
  public async validatePublicationObservations(): Promise<void> { this.calls.push("connector:evidence"); if (this.connectorFailure !== null) throw this.connectorFailure; }
  public eligibilityResult(suffix = "publication"): PublicationReviewEligibilityResult {
    return { status: EligibilityResult.ELIGIBLE, reviewReference, reviewConclusionId: `review_conclusion_${suffix}`, validatedAt: now, evidence: evidence(`eligibility-${suffix}`) };
  }
  public eligibility(suffix = "publication"): PublicationEligibility {
    return new PublicationEligibility({
      tenantId, reviewReference, reviewConclusionId: `review_conclusion_${suffix}`, eligibilityResult: EligibilityResult.ELIGIBLE, validatedAt: now, evidence: evidence(`eligibility-${suffix}`)
    });
  }
  public authorizationResult(suffix = "publication"): PublicationAuthorizationResult {
    return {
      status: "AUTHORIZED", decisionReference: new DecisionReference(DecisionId.from(`decision_publication_${suffix}`), tenantId),
      authorityReferences: [new AuthorityReference(AuthorityId.from(`authority_publication_${suffix}`), tenantId)],
      authorizedAt: now, evidence: evidence(`authorization-${suffix}`)
    };
  }
  public authorization(suffix = "publication"): PublicationAuthorization {
    const result = this.authorizationResult(suffix);
    return new PublicationAuthorization({
      tenantId, decisionReference: result.decisionReference!, authorityReferences: result.authorityReferences!,
      eligibility: this.eligibility(suffix), authorizedAt: result.authorizedAt!, evidence: result.evidence!
    });
  }
}
