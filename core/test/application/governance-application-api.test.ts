import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { GovernanceApplicationApi } from "../../src/application/bindings/GovernanceApplicationApi.js";
import { governanceBindings } from "../../src/application/bindings/GovernanceBindings.js";
import type { ApplicationCommandContext, OperationCommandDto } from "../../src/application/dto/ApplicationContext.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import type { ReadRepositorySession } from "../../src/application/services/TransactionalRepositorySession.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";

const tenantId = "tenant_governance_application";
const authorityId = "authority_governance_application";
const approvedDecisionId = "decision_governance_approved";
const rejectedDecisionId = "decision_governance_rejected";
const context: ApplicationCommandContext = {
  tenantId,
  actor: { reference: "steward_governance_application" },
  correlationId: "correlation_governance_application"
};

function timestamp(offset: number): string {
  return `2026-07-23T13:00:${String(offset).padStart(2, "0")}.000Z`;
}

function evidence(id: string, offset: number) {
  return [{ evidenceId: `evidence_${id}`, source: "governance-application-api-test", type: "test", capturedAt: timestamp(offset) }];
}

function lineage(id: string, offset: number) {
  return [{ sourceId: `source_${id}`, targetId: `target_${id}`, relationship: "originates_from", declaredAt: timestamp(offset) }];
}

function auditPayload(id: string, offset: number) {
  return { occurredAt: timestamp(offset), evidence: evidence(id, offset), lineage: lineage(id, offset) };
}

function createAuthorityCommand(): OperationCommandDto {
  return {
    idempotencyKey: "create-authority-governance-api",
    reason: "Create the institutional authority",
    targetId: authorityId,
    payload: {
      authorityId,
      level: "INSTITUTIONAL",
      scope: { purpose: "Governance API validation", actions: ["approve", "reject"] },
      ...auditPayload("authority", 0)
    }
  };
}

function assignAuthorityCommand(expectedVersion: number): OperationCommandDto {
  return {
    idempotencyKey: "assign-authority-governance-api",
    reason: "Delegate a bounded governance responsibility",
    targetId: authorityId,
    payload: {
      authorityId,
      expectedVersion,
      assignmentId: "assignment_governance_application",
      delegateReference: "reviewer_governance_application",
      scope: { purpose: "Decision review", actions: ["review"] },
      period: { startsAt: timestamp(1), endsAt: "2026-07-24T13:00:01.000Z" },
      ...auditPayload("assignment", 1)
    }
  };
}

function createDecisionCommand(id: string, key: string, offset: number): OperationCommandDto {
  return {
    idempotencyKey: key,
    reason: `Create ${id}`,
    targetId: id,
    payload: {
      decisionId: id,
      missionId: "mission_governance_application",
      decisionType: "INSTITUTIONAL_APPROVAL",
      authorityId,
      ...auditPayload(id, offset)
    }
  };
}

function decisionMutation(id: string, key: string, expectedVersion: number, approvalId: string, offset: number): OperationCommandDto {
  return {
    idempotencyKey: key,
    reason: `${key} reason`,
    targetId: id,
    payload: {
      decisionId: id,
      expectedVersion,
      approvalId,
      authorityId,
      ...auditPayload(key, offset)
    }
  };
}

function api(provider: ReferencePersistenceProvider): GovernanceApplicationApi {
  return new GovernanceApplicationApi(
    new ApplicationCommandRunner(new ReferenceApplicationTransactionFactory(provider)),
    new ApplicationQueryRunner(new ReferenceReadRepositorySessionFactory(provider))
  );
}

test("every declared Governance API method has one executable binding", () => {
  const source = readFileSync(new URL("../../../../src/application/ports/ApplicationApiPorts.ts", import.meta.url), "utf8");
  const declarations = [...source.matchAll(/\b(createAuthority|assignAuthority|createDecision|approveDecision|rejectDecision|finalizeDecision|getAuthority|getDecision)\s*\(/gu)]
    .map((match) => match[1]);
  assert.deepEqual([...new Set(declarations)].sort(), Object.keys(governanceBindings).sort());
  for (const method of declarations) {
    assert.equal(typeof GovernanceApplicationApi.prototype[method as keyof GovernanceApplicationApi], "function");
  }
});

test("Governance commands use M12 transactions, replay safely, and preserve all public operations", async () => {
  const provider = new ReferencePersistenceProvider();
  const application = api(provider);

  const created = await application.createAuthority(createAuthorityCommand(), context);
  assert.deepEqual(created.resourceReferences, [{ resourceType: "Authority", resourceId: authorityId }]);
  const auditAfterCreate = provider.listAuditRecords(tenantId).length;
  const replayed = await application.createAuthority(createAuthorityCommand(), context);
  assert.deepEqual(replayed, created);
  assert.equal(provider.listAuditRecords(tenantId).length, auditAfterCreate);
  await assert.rejects(
    application.createAuthority({ ...createAuthorityCommand(), reason: "A different auditable intent" }, context),
    (error: { readonly code?: string }) => error.code === "IDEMPOTENCY_CONFLICT"
  );

  const assigned = await application.assignAuthority(assignAuthorityCommand(1), context);
  assert.deepEqual(assigned.resourceReferences, [
    { resourceType: "Authority", resourceId: authorityId },
    { resourceType: "Assignment", resourceId: "assignment_governance_application" }
  ]);

  const approvedCreated = await application.createDecision(createDecisionCommand(approvedDecisionId, "create-approved-decision", 2), context);
  assert.deepEqual(approvedCreated.resourceReferences, [{ resourceType: "Decision", resourceId: approvedDecisionId }]);
  const approved = await application.approveDecision(decisionMutation(approvedDecisionId, "approve-decision", 1, "approval_governance_approved", 3), context);
  assert.deepEqual(approved.resourceReferences, [
    { resourceType: "Decision", resourceId: approvedDecisionId },
    { resourceType: "Approval", resourceId: "approval_governance_approved" }
  ]);
  const finalized = await application.finalizeDecision({
    idempotencyKey: "finalize-decision",
    reason: "Finalize approved decision",
    targetId: approvedDecisionId,
    payload: { decisionId: approvedDecisionId, expectedVersion: 3, ...auditPayload("finalize", 4) }
  }, context);
  assert.deepEqual(finalized.resourceReferences, [{ resourceType: "Decision", resourceId: approvedDecisionId }]);

  await application.createDecision(createDecisionCommand(rejectedDecisionId, "create-rejected-decision", 5), context);
  const rejected = await application.rejectDecision(decisionMutation(rejectedDecisionId, "reject-decision", 1, "approval_governance_rejected", 6), context);
  assert.deepEqual(rejected.resourceReferences, [
    { resourceType: "Decision", resourceId: rejectedDecisionId },
    { resourceType: "Approval", resourceId: "approval_governance_rejected" }
  ]);

  const auditBeforeConflict = provider.listAuditRecords(tenantId).length;
  await assert.rejects(
    application.assignAuthority({ ...assignAuthorityCommand(0), idempotencyKey: "stale-assign", payload: { ...assignAuthorityCommand(0).payload, assignmentId: "assignment_governance_stale", delegateReference: "different_reviewer_governance" } }, context),
    (error: { readonly code?: string }) => error.code === "CONCURRENCY_CONFLICT"
  );
  assert.equal(provider.listAuditRecords(tenantId).length, auditBeforeConflict);
});

test("Governance queries use the read session and return stable public projections", async () => {
  const provider = new ReferencePersistenceProvider();
  const application = api(provider);
  await application.createAuthority(createAuthorityCommand(), context);
  await application.assignAuthority(assignAuthorityCommand(1), context);
  await application.createDecision(createDecisionCommand(approvedDecisionId, "query-decision", 2), context);
  const auditBeforeQuery = provider.listAuditRecords(tenantId).length;

  const authority = await application.getAuthority({ targetId: authorityId }, { tenantId, actor: context.actor, correlationId: context.correlationId });
  assert.equal(authority?.authorityId, authorityId);
  assert.equal(authority?.assignments[0]?.assignmentId, "assignment_governance_application");
  assert.equal("evidence" in (authority ?? {}), false);

  const decision = await application.getDecision({ targetId: approvedDecisionId }, { tenantId, actor: context.actor, correlationId: context.correlationId });
  assert.equal(decision?.decisionId, approvedDecisionId);
  assert.equal(decision?.authorityReference.id, authorityId);
  assert.equal(provider.listAuditRecords(tenantId).length, auditBeforeQuery);
});

test("Governance validation rejects invalid commands before opening a Unit of Work", () => {
  let opened = 0;
  const application = new GovernanceApplicationApi(
    new ApplicationCommandRunner({ open: () => { opened += 1; throw new Error("Unit of Work must not open"); } }),
    new ApplicationQueryRunner({ open: () => ({ mission: {} as ReadRepositorySession["mission"], authority: {} as ReadRepositorySession["authority"], decision: {} as ReadRepositorySession["decision"], agent: {} as ReadRepositorySession["agent"], execution: {} as ReadRepositorySession["execution"], asset: {} as ReadRepositorySession["asset"], knowledge: {} as ReadRepositorySession["knowledge"], policy: {} as ReadRepositorySession["policy"], workflow: {} as ReadRepositorySession["workflow"], workflowExecution: {} as ReadRepositorySession["workflowExecution"], review: {} as ReadRepositorySession["review"], publication: {} as ReadRepositorySession["publication"], connector: {} as ReadRepositorySession["connector"], connectorExecution: {} as ReadRepositorySession["connectorExecution"] }) })
  );
  assert.throws(
    () => application.createAuthority({ idempotencyKey: "invalid-authority", reason: "Invalid authority", payload: {} }, context),
    /authorityId/u
  );
  assert.equal(opened, 0);
});
