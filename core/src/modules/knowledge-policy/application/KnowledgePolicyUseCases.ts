import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import type { KnowledgeId, PolicyId, TenantId } from "../../../shared/identity/index.js";
import type { AssetReference, AssetVersionReference } from "../../../shared/references/index.js";
import { Version } from "../../../shared/version/Version.js";
import { Knowledge } from "../domain/Knowledge.js";
import type { CreateKnowledgeCommand, CreatePolicyCommand, CreatePolicyVersionCommand, CurateKnowledgeCommand, LinkKnowledgeCommand } from "../domain/KnowledgePolicyCommands.js";
import type { KnowledgeRelationship } from "../domain/KnowledgeRelationship.js";
import { Policy } from "../domain/Policy.js";
import type { KnowledgeReferenceValidationPort } from "../ports/KnowledgeReferenceValidationPort.js";
import type { KnowledgeRepository } from "../ports/KnowledgeRepository.js";
import type { PolicyRepository } from "../ports/PolicyRepository.js";

async function requireKnowledge(repository: KnowledgeRepository, tenantId: TenantId, knowledgeId: KnowledgeId): Promise<Knowledge> {
  const knowledge = await repository.findById(tenantId, knowledgeId);
  if (knowledge === null) throw new InvariantViolation("Knowledge was not found", { knowledgeId: knowledgeId.toString() });
  return knowledge;
}

async function requirePolicy(repository: PolicyRepository, tenantId: TenantId, policyId: PolicyId): Promise<Policy> {
  const policy = await repository.findById(tenantId, policyId);
  if (policy === null) throw new InvariantViolation("Policy was not found", { policyId: policyId.toString() });
  return policy;
}

async function validateReferences(validation: KnowledgeReferenceValidationPort, assets: readonly AssetReference[], versions: readonly AssetVersionReference[]): Promise<void> {
  for (const reference of assets) await validation.validateAssetReference(reference);
  for (const reference of versions) await validation.validateAssetVersionReference(reference);
}

export async function createKnowledge(repository: KnowledgeRepository, validation: KnowledgeReferenceValidationPort, command: CreateKnowledgeCommand): Promise<Knowledge> {
  if (await repository.exists(command.tenantId, command.knowledgeId)) throw new InvariantViolation("Knowledge already exists");
  await validateReferences(validation, command.assetReferences, command.assetVersionReferences);
  const knowledge = Knowledge.create(command);
  await repository.save(knowledge, Version.initial());
  return knowledge;
}

export async function curateKnowledge(repository: KnowledgeRepository, tenantId: TenantId, knowledgeId: KnowledgeId, command: CurateKnowledgeCommand): Promise<Knowledge> {
  const knowledge = await requireKnowledge(repository, tenantId, knowledgeId);
  const expectedVersion = knowledge.version;
  knowledge.curate(command);
  await repository.save(knowledge, expectedVersion);
  return knowledge;
}

export async function linkKnowledgeAsset(repository: KnowledgeRepository, validation: KnowledgeReferenceValidationPort, tenantId: TenantId, knowledgeId: KnowledgeId, command: LinkKnowledgeCommand): Promise<KnowledgeRelationship> {
  const knowledge = await requireKnowledge(repository, tenantId, knowledgeId);
  const target = command.relationship.target;
  if ("assetId" in target) await validation.validateAssetVersionReference(target);
  else if ("id" in target && target.id.kind === "asset") await validation.validateAssetReference(target);
  const expectedVersion = knowledge.version;
  knowledge.link(command);
  await repository.save(knowledge, expectedVersion);
  return command.relationship;
}

export async function createPolicy(repository: PolicyRepository, command: CreatePolicyCommand): Promise<Policy> {
  if (await repository.exists(command.tenantId, command.policyId)) throw new InvariantViolation("Policy already exists");
  if (await repository.existsVersion(command.tenantId, command.initialVersionId)) throw new InvariantViolation("PolicyVersionId already exists in Tenant");
  const policy = Policy.create(command);
  await repository.save(policy, Version.initial());
  return policy;
}

export async function createPolicyVersion(repository: PolicyRepository, tenantId: TenantId, policyId: PolicyId, command: CreatePolicyVersionCommand): Promise<Policy> {
  if (await repository.existsVersion(tenantId, command.versionId)) throw new InvariantViolation("PolicyVersionId already exists in Tenant");
  const policy = await requirePolicy(repository, tenantId, policyId);
  const expectedVersion = policy.version;
  policy.createVersion(command);
  await repository.save(policy, expectedVersion);
  return policy;
}
