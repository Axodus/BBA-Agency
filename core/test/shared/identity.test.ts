import assert from "node:assert/strict";
import test from "node:test";
import {
  AgentId,
  ApprovalId,
  AssetId,
  AssetVersionId,
  AssignmentId,
  AuthorityId,
  ConnectorId,
  ConnectorCapabilityId,
  ConnectorExecutionId,
  DecisionId,
  EvidenceId,
  Identity,
  IdentityFactory,
  KnowledgeId,
  MissionId,
  PolicyId,
  PolicyVersionId,
  PublicationId,
  PublicationPackageId,
  PublicationRecordId,
  PublicationVersionId,
  ReviewConclusionId,
  ReviewFindingId,
  ReviewId,
  ReviewRequestId,
  ReviewSessionId,
  StageId,
  TaskId,
  TenantId,
  WorkflowExecutionId,
  WorkflowId
} from "../../src/shared/identity/index.js";

test("all canonical IDs are opaque, immutable value objects", () => {
  const ids = [
    TenantId.deterministic("tenant-a"),
    MissionId.deterministic("mission-a"),
    AssetId.deterministic("asset-a"),
    AssetVersionId.deterministic("asset-version-a"),
    AgentId.deterministic("agent-a"),
    AssignmentId.deterministic("assignment-a"),
    AuthorityId.deterministic("authority-a"),
    DecisionId.deterministic("decision-a"),
    ApprovalId.deterministic("approval-a"),
    EvidenceId.deterministic("evidence-a"),
    ConnectorId.deterministic("connector-a"),
    ConnectorCapabilityId.deterministic("connector-capability-a"),
    ConnectorExecutionId.deterministic("connector-execution-a"),
    KnowledgeId.deterministic("knowledge-a"),
    PolicyId.deterministic("policy-a"),
    PolicyVersionId.deterministic("policy-version-a"),
    PublicationId.deterministic("publication-a"),
    PublicationPackageId.deterministic("publication-package-a"),
    PublicationVersionId.deterministic("publication-version-a"),
    PublicationRecordId.deterministic("publication-record-a"),
    WorkflowId.deterministic("workflow-a"),
    WorkflowExecutionId.deterministic("workflow-execution-a"),
    StageId.deterministic("stage-a"),
    TaskId.deterministic("task-a"),
    ReviewId.deterministic("review-a"),
    ReviewRequestId.deterministic("review-request-a"),
    ReviewSessionId.deterministic("review-session-a"),
    ReviewFindingId.deterministic("review-finding-a"),
    ReviewConclusionId.deterministic("review-conclusion-a")
  ];

  assert.equal(new Set(ids.map((id) => id.toString())).size, ids.length);
  for (const id of ids) {
    assert.equal(Object.isFrozen(id), true);
    assert.equal(typeof id.toJSON(), "string");
    assert.match(id.toString(), /^[a-z][a-z0-9_]*_[a-z0-9]+$/u);
  }
  const firstTenantId = ids[0];
  assert.ok(firstTenantId instanceof TenantId);
  assert.equal(TenantId.from(firstTenantId.toString()).equals(firstTenantId), true);
});

test("identity factory is deterministic and different seeds remain distinct", () => {
  const first = IdentityFactory.deterministic("mission", "seed-a");
  const repeated = IdentityFactory.deterministic("mission", "seed-a");
  const different = IdentityFactory.deterministic("mission", "seed-b");
  assert.equal(first, repeated);
  assert.notEqual(first, different);
  assert.equal(IdentityFactory.create("mission", "token").toString(), "mission_token");
});

test("identity validation rejects malformed and mismatched IDs", () => {
  assert.throws(() => Identity.from(""), /canonical opaque string/u);
  assert.throws(() => Identity.from("Mission-123"), /canonical opaque string/u);
  assert.throws(() => TenantId.from("mission_123"), /kind does not match/u);
  assert.throws(() => IdentityFactory.deterministic("mission", " "), /seed is required/u);
});
