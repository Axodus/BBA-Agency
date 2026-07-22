import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { PublicationId, TenantId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, KnowledgeReference, ReviewReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import type { ArchivePublicationCommand, AuthorizePublicationCommand, CreatePublicationCommand, PreparePublicationCommand, RecordPublicationOutcomeCommand } from "../domain/PublicationCommands.js";
import { Publication } from "../domain/Publication.js";
import { PublicationAuthorization } from "../domain/PublicationAuthorization.js";
import { PublicationEligibility } from "../domain/PublicationEligibility.js";
import { EligibilityResult } from "../domain/PublicationTypes.js";
import type { PublicationConnectorEvidencePort, PublicationGovernancePort, PublicationMissionPort, PublicationReferenceValidationPort, PublicationRepositoryPort, PublicationReviewPort } from "../ports/index.js";

async function requirePublication(repository: PublicationRepositoryPort, tenantId: TenantId, publicationId: PublicationId): Promise<Publication> {
  const publication = await repository.findById(tenantId, publicationId);
  if (publication === null) throw new InvariantViolation("Publication was not found", { publicationId: publicationId.toString() });
  return publication;
}

async function validatePackageReferences(referencePort: PublicationReferenceValidationPort, publication: Publication): Promise<void> {
  for (const item of publication.package.items) {
    await referencePort.validateAssetReference(item.assetReference);
    await referencePort.validateAssetVersionReference(item.assetVersionReference);
  }
  for (const knowledge of publication.package.knowledgeReferences) await referencePort.validateKnowledgeReference(knowledge);
}

export async function createPublication(repository: PublicationRepositoryPort, mission: PublicationMissionPort, references: PublicationReferenceValidationPort, command: CreatePublicationCommand): Promise<Publication> {
  if (await repository.exists(command.tenantId, command.publicationId)) throw new InvariantViolation("Publication already exists");
  await mission.validateMissionReference(command.missionReference);
  if (!await mission.missionAllowsPublication(command.missionReference)) throw new InvariantViolation("Mission does not allow Publication");
  const publication = Publication.create(command);
  await validatePackageReferences(references, publication);
  await repository.save(publication, Version.initial());
  return publication;
}

export async function preparePublication(repository: PublicationRepositoryPort, review: PublicationReviewPort, references: PublicationReferenceValidationPort, tenantId: TenantId, publicationId: PublicationId, reviewReference: ReviewReference, command: PreparePublicationCommand): Promise<Publication> {
  const publication = await requirePublication(repository, tenantId, publicationId);
  await validatePackageReferences(references, publication);
  const eligibilityResult = await review.validatePublicationEligibility({ reviewReference, reason: command.reason });
  if (eligibilityResult.status !== EligibilityResult.ELIGIBLE) throw new InvariantViolation("Publication is not eligible for preparation", { reason: eligibilityResult.reason ?? "not provided" });
  const eligibility = new PublicationEligibility({
    tenantId, reviewReference: eligibilityResult.reviewReference, reviewConclusionId: eligibilityResult.reviewConclusionId,
    eligibilityResult: eligibilityResult.status, validatedAt: eligibilityResult.validatedAt, evidence: eligibilityResult.evidence
  });
  const expectedVersion = publication.version;
  publication.prepare(command, eligibility);
  await repository.save(publication, expectedVersion);
  return publication;
}

export async function authorizePublication(repository: PublicationRepositoryPort, governance: PublicationGovernancePort, review: PublicationReviewPort, tenantId: TenantId, publicationId: PublicationId, reviewReference: ReviewReference, command: AuthorizePublicationCommand): Promise<Publication> {
  const publication = await requirePublication(repository, tenantId, publicationId);
  const eligibilityResult = await review.validatePublicationEligibility({ reviewReference, reason: command.reason });
  if (eligibilityResult.status !== EligibilityResult.ELIGIBLE) throw new InvariantViolation("Publication authorization requires eligible Review evidence", { reason: eligibilityResult.reason ?? "not provided" });
  const eligibility = new PublicationEligibility({
    tenantId, reviewReference: eligibilityResult.reviewReference, reviewConclusionId: eligibilityResult.reviewConclusionId,
    eligibilityResult: eligibilityResult.status, validatedAt: eligibilityResult.validatedAt, evidence: eligibilityResult.evidence
  });
  const result = await governance.authorizePublication({ tenantId, publication: publication.reference, eligibility, reason: command.reason });
  if (result.status === "REJECTED") throw new InvariantViolation("Publication authorization was rejected by Governance", { reason: result.reason ?? "not provided" });
  if (result.decisionReference === undefined || result.authorityReferences === undefined || result.authorizedAt === undefined || result.evidence === undefined) throw new InvariantViolation("Publication authorization result is incomplete");
  const authorization = new PublicationAuthorization({
    tenantId, decisionReference: result.decisionReference, authorityReferences: result.authorityReferences,
    eligibility, authorizedAt: result.authorizedAt, evidence: result.evidence
  });
  const expectedVersion = publication.version;
  publication.authorize(command, authorization);
  await repository.save(publication, expectedVersion);
  return publication;
}

export async function recordPublicationOutcome(repository: PublicationRepositoryPort, connectorEvidence: PublicationConnectorEvidencePort, tenantId: TenantId, publicationId: PublicationId, command: RecordPublicationOutcomeCommand): Promise<Publication> {
  const publication = await requirePublication(repository, tenantId, publicationId);
  const expectedVersion = publication.version;
  for (const observation of command.observations) {
    if (!observation.connectorReference.tenantId.equals(tenantId)) throw new InvariantViolation("Publication observation crossed a Tenant boundary");
    for (const evidence of observation.evidence) {
      if (evidence.evidenceId.toString().trim().length === 0) throw new InvariantViolation("Publication observation Evidence is invalid");
    }
  }
  await connectorEvidence.validatePublicationObservations({ publicationPackage: publication.package, observations: command.observations });
  publication.recordOutcome(command);
  await repository.save(publication, expectedVersion);
  return publication;
}

export async function archivePublication(repository: PublicationRepositoryPort, governance: PublicationGovernancePort, tenantId: TenantId, publicationId: PublicationId, command: ArchivePublicationCommand): Promise<Publication> {
  const publication = await requirePublication(repository, tenantId, publicationId);
  const result = await governance.authorizeArchive({ tenantId, publication: publication.reference, reason: command.reason });
  if (result.status === "REJECTED") throw new InvariantViolation("Publication archive was rejected by Governance", { reason: result.reason ?? "not provided" });
  if (result.decisionReference === undefined || result.authorityReferences === undefined || result.authorizedAt === undefined || result.evidence === undefined) throw new InvariantViolation("Publication archive authorization result is incomplete");
  const eligibility = publication.authorization?.eligibility;
  if (eligibility === undefined) throw new InvariantViolation("Publication archive requires previous Publication authorization eligibility");
  const authorization = new PublicationAuthorization({ tenantId, decisionReference: result.decisionReference, authorityReferences: result.authorityReferences, eligibility, authorizedAt: result.authorizedAt, evidence: result.evidence });
  const expectedVersion = publication.version;
  publication.archive(command, authorization);
  await repository.save(publication, expectedVersion);
  return publication;
}
