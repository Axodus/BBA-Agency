import assert from "node:assert/strict";
import test from "node:test";
import { CorrelationId } from "../../../src/shared/common/CorrelationId.js";
import { ConcurrencyConflict } from "../../../src/shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../src/shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../src/shared/errors/TenantViolation.js";
import { ValidationError } from "../../../src/shared/errors/ValidationError.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { AssetId, AssetVersionId, AuthorityId, DecisionId, EvidenceId, KnowledgeId, PolicyId, PolicyVersionId, TenantId } from "../../../src/shared/identity/index.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AssetReference, AssetVersionReference, AuthorityReference, DecisionReference, InstitutionalActorReference, KnowledgeReference, PolicyReference } from "../../../src/shared/references/index.js";
import { createKnowledge, createPolicy, createPolicyVersion, curateKnowledge, linkKnowledgeAsset } from "../../../src/modules/knowledge-policy/application/index.js";
import { Knowledge, KnowledgeMetadata, KnowledgeRelationship, KnowledgeScope, Policy, PolicyAuthorityContext, PolicyMetadata, PolicyRule, PolicyRuleSet } from "../../../src/modules/knowledge-policy/domain/index.js";
import type { CreateKnowledgeCommand, CreatePolicyCommand, GovernedPolicyAuditInput, KnowledgePolicyAuditInput } from "../../../src/modules/knowledge-policy/domain/index.js";
import { InMemoryKnowledgeReferenceValidation, InMemoryKnowledgeRepository, InMemoryPolicyRepository } from "../../../src/modules/knowledge-policy/infrastructure/index.js";
import type { KnowledgeRepository } from "../../../src/modules/knowledge-policy/ports/KnowledgeRepository.js";
import type { PolicyRepository } from "../../../src/modules/knowledge-policy/ports/PolicyRepository.js";
import { Version } from "../../../src/shared/version/Version.js";

const now = "2026-07-22T12:00:00.000Z";
const tenant = TenantId.from("tenant_alpha");
const otherTenant = TenantId.from("tenant_beta");
const assetReference = new AssetReference(AssetId.from("asset_source"), tenant);
const assetVersionReference = new AssetVersionReference(AssetId.from("asset_source"), AssetVersionId.from("asset_version_source_v1"), tenant);

function evidence(id = "evidence_knowledge"): readonly EvidenceReference[] { return [new EvidenceReference({ evidenceId: EvidenceId.from(id), source: "knowledge-review", type: "decision-record", capturedAt: now })]; }
function lineage(source = "asset_source", target = "knowledge_target"): readonly LineageReference[] { return [new LineageReference({ sourceId: source, targetId: target, relationship: "references", declaredAt: now })]; }
function decision(referenceTenant = tenant): DecisionReference { return new DecisionReference(DecisionId.from("decision_knowledge"), referenceTenant); }
function authority(referenceTenant = tenant): AuthorityReference { return new AuthorityReference(AuthorityId.from("authority_policy"), referenceTenant); }
function audit(): KnowledgePolicyAuditInput { return { reason: "Institutional knowledge operation", occurredAt: now, correlationId: CorrelationId.from("correlation_knowledge"), evidence: evidence(), lineage: lineage() }; }
function governedAudit(referenceTenant = tenant): GovernedPolicyAuditInput { return { ...audit(), authorityReference: authority(referenceTenant), decisionReference: decision(referenceTenant) }; }
function rule(key = "human-governance"): PolicyRule { return new PolicyRule({ ruleKey: key, statement: "Human authority remains final", obligation: "A steward records accountable rationale", applicability: "Institutional decisions", priority: 1, rationale: "Preserves accountability" }); }
function ruleSet(key = "human-governance"): PolicyRuleSet { return new PolicyRuleSet([rule(key)]); }
function policyAuthorityContext(referenceTenant = tenant): PolicyAuthorityContext {
  return new PolicyAuthorityContext({ ownerReference: new InstitutionalActorReference("person:owner", referenceTenant), stewardReference: new InstitutionalActorReference("person:steward", referenceTenant), authorityReference: authority(referenceTenant), decisionReference: decision(referenceTenant) });
}
function createPolicyCommand(token = "alpha", versionToken = "alpha_v1"): CreatePolicyCommand {
  return { ...governedAudit(), policyId: PolicyId.from(`policy_${token}`), tenantId: tenant, metadata: new PolicyMetadata({ title: "Policy", summary: "Institutional rule", scope: "BBA Core", createdAt: now, updatedAt: now }), authorityContext: policyAuthorityContext(), initialVersionId: PolicyVersionId.from(`policy_version_${versionToken}`), ruleSet: ruleSet(`${token}-rule`) };
}
function createKnowledgeCommand(token = "alpha"): CreateKnowledgeCommand {
  return { ...audit(), knowledgeId: KnowledgeId.from(`knowledge_${token}`), tenantId: tenant, metadata: new KnowledgeMetadata({ title: "Knowledge", summary: "Institutional context", stewardNote: "Curated by human steward", createdAt: now, updatedAt: now }), scope: new KnowledgeScope({ domainArea: "Governance", audience: "Stewards", constraints: ["Tenant-bound"] }), assetReferences: [assetReference], assetVersionReferences: [assetVersionReference], policyReferences: [new PolicyReference(PolicyId.from("policy_alpha"), tenant)] };
}
function validation(): InMemoryKnowledgeReferenceValidation {
  const adapter = new InMemoryKnowledgeReferenceValidation();
  adapter.registerAsset(assetReference);
  adapter.registerAssetVersion(assetVersionReference);
  return adapter;
}

test("Knowledge starts PROPOSED with semantic revision one and neutral references", () => {
  const knowledge = Knowledge.create(createKnowledgeCommand("foundation"));
  assert.equal(knowledge.status, "PROPOSED");
  assert.equal(knowledge.currentRevision.value, 1);
  assert.equal(knowledge.version.value, 1);
  assert.equal(knowledge.assetReferences[0]?.id.toString(), "asset_source");
  assert.equal(knowledge.assetVersionReferences[0]?.versionId.toString(), "asset_version_source_v1");
  assert.equal(knowledge.domainEvents[0]?.toJSON().type, "KnowledgeCreated");
  assert.equal(knowledge.domainEvents[0]?.toJSON().tenantId, tenant.toString());
  assert.equal(JSON.stringify(knowledge.toSnapshot()).includes("CanonicalContent"), false);
});

test("KnowledgeRevisionNumber is semantic and separate from Aggregate Version", () => {
  const knowledge = Knowledge.create(createKnowledgeCommand("revision"));
  const firstRevision = knowledge.currentRevision.value;
  const firstVersion = knowledge.version.value;
  knowledge.curate({ ...audit(), curatorReference: decision() });
  assert.equal(knowledge.currentRevision.value, firstRevision + 1);
  assert.equal(knowledge.version.value, firstVersion + 1);
  assert.equal(knowledge.currentRevision.equals(Version.from(knowledge.version.value)), false);
});

test("Knowledge lifecycle is protected", () => {
  const knowledge = Knowledge.create(createKnowledgeCommand("lifecycle"));
  assert.throws(() => knowledge.archive({ ...audit(), decisionReference: decision() }), InvariantViolation);
  knowledge.curate({ ...audit(), curatorReference: decision() });
  assert.equal(knowledge.status, "CURATED");
  knowledge.archive({ ...audit(), decisionReference: decision() });
  assert.equal(knowledge.status, "ARCHIVED");
  assert.throws(() => knowledge.curate({ ...audit(), curatorReference: decision() }), InvariantViolation);
});

test("KnowledgeRelationship is owned by source Knowledge and rejects duplicates", () => {
  const knowledge = Knowledge.create(createKnowledgeCommand("relationship"));
  const relationship = new KnowledgeRelationship({ source: knowledge.reference, target: assetReference, type: "SUPPORTS", rationale: "source SUPPORTS target", evidence: evidence(), lineage: lineage(), createdAt: now });
  knowledge.link({ ...audit(), relationship });
  assert.equal(knowledge.relationships.length, 1);
  assert.equal(knowledge.currentRevision.value, 2);
  assert.throws(() => knowledge.link({ ...audit(), relationship }), /already exists/u);
  const otherSource = new KnowledgeReference(KnowledgeId.from("knowledge_other"), tenant);
  assert.throws(() => knowledge.link({ ...audit(), relationship: new KnowledgeRelationship({ source: otherSource, target: assetReference, type: "EXPLAINS", rationale: "source EXPLAINS target", evidence: evidence(), lineage: lineage(), createdAt: now }) }), /source must match/u);
  assert.throws(() => new KnowledgeRelationship({ source: knowledge.reference, target: new AssetReference(AssetId.from("asset_other"), otherTenant), type: "SUMMARIZES", rationale: "source SUMMARIZES target", evidence: evidence(), lineage: lineage(), createdAt: now }), /Tenant/u);
});

test("Policy creation atomically creates first version and current pointer", () => {
  const policy = Policy.create(createPolicyCommand("foundation"));
  assert.equal(policy.status, "PROPOSED");
  assert.equal(policy.versions.length, 1);
  assert.equal(policy.currentPolicyVersion.number.value, 1);
  assert.equal(policy.currentVersionId.toString(), "policy_version_alpha_v1");
  assert.equal(policy.version.value, 1);
  assert.deepEqual(policy.domainEvents.map((event) => event.toJSON().type), ["PolicyCreated", "PolicyVersionCreated"]);
  assert.equal(Object.isFrozen(policy.currentPolicyVersion), true);
  assert.equal(Object.isFrozen(policy.currentPolicyVersion.ruleSet), true);
});

test("PolicyVersion creation preserves earlier versions and requires current predecessor", () => {
  const policy = Policy.create(createPolicyCommand("versions"));
  const original = policy.currentPolicyVersion.toSnapshot();
  assert.throws(() => policy.createVersion({ ...governedAudit(), versionId: PolicyVersionId.from("policy_version_versions_v3"), predecessorVersionId: PolicyVersionId.from("policy_version_wrong"), ruleSet: ruleSet("wrong-rule") }), /predecessor/u);
  policy.createVersion({ ...governedAudit(), versionId: PolicyVersionId.from("policy_version_versions_v2"), predecessorVersionId: policy.currentVersionId, ruleSet: ruleSet("versions-rule-v2") });
  assert.deepEqual(policy.versions[0]?.toSnapshot(), original);
  assert.equal(policy.versions.length, 2);
  assert.equal(policy.currentPolicyVersion.number.value, 2);
  assert.equal(policy.currentVersionId.toString(), "policy_version_versions_v2");
});

test("PolicyRule and PolicyRuleSet are institutional descriptions only", () => {
  assert.throws(() => new PolicyRule({ ruleKey: "bad", statement: "Run workflow", obligation: "Execute task", applicability: "Runtime", priority: 1, rationale: "Engine integration" }), ValidationError);
  assert.throws(() => new PolicyRuleSet([]), InvariantViolation);
  assert.throws(() => new PolicyRuleSet([rule("duplicate"), rule("duplicate")]), InvariantViolation);
});

test("Application use cases validate references without loading Asset content", async () => {
  const repository = new InMemoryKnowledgeRepository();
  const created = await createKnowledge(repository, validation(), createKnowledgeCommand("application"));
  await curateKnowledge(repository, tenant, created.id, { ...audit(), curatorReference: decision() });
  const relationship = new KnowledgeRelationship({ source: created.reference, target: assetVersionReference, type: "SUMMARIZES", rationale: "source SUMMARIZES target", evidence: evidence(), lineage: lineage(), createdAt: now });
  await linkKnowledgeAsset(repository, validation(), tenant, created.id, { ...audit(), relationship });
  const stored = await repository.findById(tenant, created.id);
  assert.equal(stored?.relationships.length, 1);
});

test("Application use cases reject unregistered Asset references structurally", async () => {
  const repository = new InMemoryKnowledgeRepository();
  const emptyValidation = new InMemoryKnowledgeReferenceValidation();
  await assert.rejects(createKnowledge(repository, emptyValidation, createKnowledgeCommand("missing")), /AssetReference/u);
});

test("Policy repository and use cases enforce Tenant-scoped version uniqueness", async () => {
  const repository = new InMemoryPolicyRepository();
  const policy = await createPolicy(repository, createPolicyCommand("repo", "repo_v1"));
  await createPolicyVersion(repository, tenant, policy.id, { ...governedAudit(), versionId: PolicyVersionId.from("policy_version_repo_v2"), predecessorVersionId: policy.currentVersionId, ruleSet: ruleSet("repo-v2") });
  await assert.rejects(createPolicyVersion(repository, tenant, policy.id, { ...governedAudit(), versionId: PolicyVersionId.from("policy_version_repo_v2"), predecessorVersionId: PolicyVersionId.from("policy_version_repo_v2"), ruleSet: ruleSet("repo-v3") }), /already exists/u);
});

function knowledgeRepositoryContract(name: string, factory: () => KnowledgeRepository): void {
  test(`${name} preserves snapshots and optimistic concurrency`, async () => {
    const repository = factory();
    const knowledge = Knowledge.create(createKnowledgeCommand("contract"));
    await repository.save(knowledge, Version.initial());
    const first = await repository.findById(tenant, knowledge.id);
    const second = await repository.findById(tenant, knowledge.id);
    assert.ok(first !== null && second !== null);
    const expectedFirst = first.version;
    const expectedSecond = second.version;
    first.curate({ ...audit(), curatorReference: decision() });
    second.curate({ ...audit(), curatorReference: decision() });
    await repository.save(first, expectedFirst);
    await assert.rejects(repository.save(second, expectedSecond), ConcurrencyConflict);
    await assert.rejects(repository.findById(otherTenant, knowledge.id), TenantViolation);
  });
}

function policyRepositoryContract(name: string, factory: () => PolicyRepository): void {
  test(`${name} preserves snapshots and optimistic concurrency`, async () => {
    const repository = factory();
    const policy = Policy.create(createPolicyCommand("contract_policy", "contract_policy_v1"));
    await repository.save(policy, Version.initial());
    const first = await repository.findById(tenant, policy.id);
    const second = await repository.findById(tenant, policy.id);
    assert.ok(first !== null && second !== null);
    const expectedFirst = first.version;
    const expectedSecond = second.version;
    first.createVersion({ ...governedAudit(), versionId: PolicyVersionId.from("policy_version_contract_policy_v2"), predecessorVersionId: first.currentVersionId, ruleSet: ruleSet("contract-v2") });
    second.createVersion({ ...governedAudit(), versionId: PolicyVersionId.from("policy_version_contract_policy_v3"), predecessorVersionId: second.currentVersionId, ruleSet: ruleSet("contract-v3") });
    await repository.save(first, expectedFirst);
    await assert.rejects(repository.save(second, expectedSecond), ConcurrencyConflict);
    await assert.rejects(repository.findById(otherTenant, policy.id), TenantViolation);
  });
}

test("Snapshots rehydrate aggregates without pending events", () => {
  const knowledge = Knowledge.create(createKnowledgeCommand("snapshot"));
  const restoredKnowledge = Knowledge.rehydrate(knowledge.toSnapshot());
  assert.deepEqual(restoredKnowledge.toSnapshot(), knowledge.toSnapshot());
  assert.equal(restoredKnowledge.domainEvents.length, 0);
  const policy = Policy.create(createPolicyCommand("snapshot", "snapshot_v1"));
  const restoredPolicy = Policy.rehydrate(policy.toSnapshot());
  assert.deepEqual(restoredPolicy.toSnapshot(), policy.toSnapshot());
  assert.equal(restoredPolicy.domainEvents.length, 0);
});

knowledgeRepositoryContract("InMemoryKnowledgeRepository", () => new InMemoryKnowledgeRepository());
policyRepositoryContract("InMemoryPolicyRepository", () => new InMemoryPolicyRepository());
