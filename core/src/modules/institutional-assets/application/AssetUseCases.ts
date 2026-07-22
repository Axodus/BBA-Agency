import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { AssetId, TenantId } from "../../../shared/identity/index.js";
import { AssetReference } from "../../../shared/references/AssetReference.js";
import { Version } from "../../../shared/version/Version.js";
import { Asset } from "../domain/Asset.js";
import type { ArchiveAssetCommand, AssetAuditInput, CreateAssetCommand, CreateAssetVersionCommand, GovernedAssetAuditInput, ProduceAssetCommand } from "../domain/AssetCommands.js";
import { AssetRelationship, type AssetRelationshipProps, type AssetRelationshipType } from "../domain/AssetRelationship.js";
import type { AssetRelationshipGraphPort } from "../ports/AssetRelationshipGraphPort.js";
import type { AssetRepository } from "../ports/AssetRepository.js";
import type { AssetUnitOfWorkPort } from "../ports/AssetUnitOfWorkPort.js";

export interface CreateRelationshipInput extends Omit<AssetRelationshipProps, "source" | "target" | "type" | "evidence" | "lineage">, AssetAuditInput {
  readonly tenantId: TenantId;
  readonly sourceAssetId: AssetId;
  readonly targetAssetId: AssetId;
  readonly type: Exclude<AssetRelationshipType, "SUPERSEDES">;
}

export interface SupersedeAssetInput extends GovernedAssetAuditInput {
  readonly tenantId: TenantId;
  readonly previousAssetId: AssetId;
  readonly successorAssetId: AssetId;
  readonly rationale: string;
}

async function requireAsset(repository: AssetRepository, tenantId: TenantId, assetId: AssetId): Promise<Asset> {
  const asset = await repository.findById(tenantId, assetId);
  if (asset === null) throw new InvariantViolation("Asset was not found", { assetId: assetId.toString() });
  return asset;
}

export async function createAsset(repository: AssetRepository, command: CreateAssetCommand): Promise<Asset> {
  if (await repository.exists(command.tenantId, command.assetId)) throw new InvariantViolation("Asset already exists");
  const asset = Asset.create(command);
  await repository.save(asset, Version.initial());
  return asset;
}

export async function produceAsset(repository: AssetRepository, tenantId: TenantId, assetId: AssetId, command: ProduceAssetCommand): Promise<Asset> {
  const asset = await requireAsset(repository, tenantId, assetId);
  const expectedVersion = asset.version;
  asset.produce(command);
  await repository.save(asset, expectedVersion);
  return asset;
}

export async function createAssetVersion(repository: AssetRepository, tenantId: TenantId, assetId: AssetId, command: CreateAssetVersionCommand): Promise<Asset> {
  const asset = await requireAsset(repository, tenantId, assetId);
  const expectedVersion = asset.version;
  asset.createVersion(command);
  await repository.save(asset, expectedVersion);
  return asset;
}

export async function archiveAsset(repository: AssetRepository, tenantId: TenantId, assetId: AssetId, command: ArchiveAssetCommand): Promise<Asset> {
  const asset = await requireAsset(repository, tenantId, assetId);
  const expectedVersion = asset.version;
  asset.archive(command);
  await repository.save(asset, expectedVersion);
  return asset;
}

export async function createAssetRelationship(repository: AssetRepository, graph: AssetRelationshipGraphPort, input: CreateRelationshipInput): Promise<AssetRelationship> {
  const source = await requireAsset(repository, input.tenantId, input.sourceAssetId);
  await requireAsset(repository, input.tenantId, input.targetAssetId);
  if (input.type === "DERIVES_FROM" && await graph.wouldCreateLineageCycle(input.tenantId, input.sourceAssetId, input.targetAssetId)) throw new InvariantViolation("Asset relationship would create a lineage cycle");
  const relationship = new AssetRelationship({ source: new AssetReference(input.sourceAssetId, input.tenantId), target: new AssetReference(input.targetAssetId, input.tenantId), type: input.type, authorityReference: input.authorityReference, decisionReference: input.decisionReference, rationale: input.rationale, evidence: input.evidence, lineage: input.lineage, createdAt: input.createdAt });
  const expectedVersion = source.version;
  source.addRelationship({ relationship, reason: input.rationale, occurredAt: input.createdAt, correlationId: input.correlationId, ...(input.causationId ? { causationId: input.causationId } : {}), evidence: input.evidence, lineage: input.lineage });
  await repository.save(source, expectedVersion);
  return relationship;
}

export async function supersedeAsset(repository: AssetRepository, graph: AssetRelationshipGraphPort, unitOfWork: AssetUnitOfWorkPort, input: SupersedeAssetInput): Promise<{ readonly previous: Asset; readonly successor: Asset; readonly relationship: AssetRelationship }> {
  if (input.previousAssetId.equals(input.successorAssetId)) throw new InvariantViolation("Asset successor must be distinct");
  const previous = await requireAsset(repository, input.tenantId, input.previousAssetId);
  const successor = await requireAsset(repository, input.tenantId, input.successorAssetId);
  if (previous.status !== "PUBLISHED") throw new InvariantViolation(`Asset cannot be superseded from ${previous.status}`);
  if (await graph.wouldCreateSupersessionCycle(input.tenantId, input.successorAssetId, input.previousAssetId)) throw new InvariantViolation("Asset relationship would create a supersession cycle");
  const expectedPreviousVersion = previous.version;
  const expectedSuccessorVersion = successor.version;
  const relationship = new AssetRelationship({ source: new AssetReference(input.successorAssetId, input.tenantId), target: new AssetReference(input.previousAssetId, input.tenantId), type: "SUPERSEDES", authorityReference: input.authorityReference, decisionReference: input.decisionReference, rationale: input.rationale, evidence: input.evidence, lineage: input.lineage, createdAt: input.occurredAt });
  successor.addRelationship({ relationship, reason: input.reason, occurredAt: input.occurredAt, correlationId: input.correlationId, ...(input.causationId ? { causationId: input.causationId } : {}), evidence: input.evidence, lineage: input.lineage });
  previous.supersede({ successorReference: new AssetReference(input.successorAssetId, input.tenantId), reason: input.reason, occurredAt: input.occurredAt, correlationId: input.correlationId, ...(input.causationId ? { causationId: input.causationId } : {}), evidence: input.evidence, lineage: input.lineage, authorityReference: input.authorityReference, decisionReference: input.decisionReference });
  await unitOfWork.commitSupersession(previous, expectedPreviousVersion, successor, expectedSuccessorVersion);
  return { previous, successor, relationship };
}
