import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { MissionApplicationApi } from "../../src/application/bindings/MissionApplicationApi.js";
import { missionBindings } from "../../src/application/bindings/MissionBindings.js";
import type { ApplicationCommandContext, OperationCommandDto } from "../../src/application/dto/ApplicationContext.js";
import { ApplicationCommandRunner } from "../../src/application/services/ApplicationCommandRunner.js";
import { ApplicationQueryRunner } from "../../src/application/services/ApplicationQueryRunner.js";
import type { ReadRepositorySession } from "../../src/application/services/TransactionalRepositorySession.js";
import { ProviderBackedMissionRepository } from "../../src/infrastructure/persistence/ProviderBackedRepositories.js";
import { ReferenceApplicationTransactionFactory, ReferenceReadRepositorySessionFactory } from "../../src/infrastructure/persistence/ApplicationTransactionFactory.js";
import { ReferencePersistenceProvider } from "../../src/infrastructure/persistence/ReferencePersistenceProvider.js";
import { TransactionContext } from "../../src/infrastructure/persistence/TransactionContext.js";
import { EvidenceReference } from "../../src/shared/evidence/EvidenceReference.js";
import { EvidenceId, MissionId, TenantId } from "../../src/shared/identity/index.js";
import { AuthorityReference } from "../../src/shared/references/AuthorityReference.js";

const tenantId = "tenant_application_api";
const missionId = "mission_application_api";
const context: ApplicationCommandContext = {
  tenantId,
  actor: { reference: "steward_application_api" },
  correlationId: "correlation_application_api"
};

function timestamp(offset: number): string {
  return `2026-07-23T12:00:${String(offset).padStart(2, "0")}.000Z`;
}

function evidenceData(id: string, offset: number) {
  return [{ evidenceId: id, source: "application-api-test", type: "test", capturedAt: timestamp(offset) }];
}

function createCommand(): OperationCommandDto {
  return {
    idempotencyKey: "create-mission-key",
    reason: "Create the public Mission resource",
    targetId: missionId,
    payload: {
      missionId,
      metadata: {
        title: "Application API Mission",
        summary: "Public M12 surface",
        description: "Created through MissionApplicationApi",
        createdAt: timestamp(0),
        updatedAt: timestamp(0)
      },
      intent: {
        purpose: "Validate the M12 public boundary",
        objective: "Exercise command, replay and query",
        stewardReference: "steward_application_api",
        audience: "M12 reviewers",
        context: "M12 corrective closeout",
        expectedOutcome: "Committed Mission reference"
      },
      evidence: evidenceData("evidence_application_create", 0),
      lineage: [{
        sourceId: "source_application_api",
        targetId: missionId,
        relationship: "originates_from",
        declaredAt: timestamp(0)
      }]
    }
  };
}

function decisionCommand(key: string, expectedVersion: number, offset: number, outcome = false): OperationCommandDto {
  return {
    idempotencyKey: key,
    reason: `${key} reason`,
    targetId: missionId,
    payload: {
      missionId,
      expectedVersion,
      authorityReference: "authority_application_api",
      decisionReference: `decision_${key}`,
      approvalReference: `approval_${key}`,
      reason: `${key} reason`,
      occurredAt: timestamp(offset),
      evidence: evidenceData(`evidence_${key}`, offset),
      ...(outcome ? {
        outcome: {
          result: "Mission completed",
          learning: "The public API remains intentionally small",
          limitations: "Additional contexts remain in EPIC-IMP-012B",
          residualObligations: "Expand only from institutional demand"
        }
      } : {})
    }
  };
}

function directDecision(offset: number) {
  return {
    actorReference: context.actor.reference,
    authorityReference: AuthorityReference.fromJSON({ id: "authority_application_api", tenantId }),
    reason: `prepare mission ${offset}`,
    occurredAt: timestamp(offset),
    evidence: [new EvidenceReference({
      evidenceId: EvidenceId.from(`evidence_prepare_${offset}`),
      source: "application-api-test",
      type: "test",
      capturedAt: timestamp(offset)
    })]
  };
}

async function mutateForNextPublicCommand(
  provider: ReferencePersistenceProvider,
  transactionId: string,
  mutation: (mission: NonNullable<Awaited<ReturnType<ProviderBackedMissionRepository["findById"]>>>) => void
): Promise<void> {
  const persistenceContext = new TransactionContext({
    transactionId,
    tenantId,
    actor: context.actor.reference,
    correlationId: context.correlationId,
    startedAt: timestamp(20)
  });
  const repository = new ProviderBackedMissionRepository(provider, persistenceContext);
  const mission = await repository.findById(TenantId.from(tenantId), MissionId.from(missionId));
  assert.ok(mission);
  const expected = mission.version;
  mutation(mission);
  await repository.save(mission, expected);
}

test("every method declared by the public Application API has one executable Mission binding", () => {
  const source = readFileSync(new URL("../../../../src/application/ports/ApplicationApiPorts.ts", import.meta.url), "utf8");
  const declarations = [...source.matchAll(/\b(createMission|activateMission|renameMission|completeMission|getMission)\s*\(/gu)]
    .map((match) => match[1]);
  assert.deepEqual([...new Set(declarations)].sort(), Object.keys(missionBindings).sort());
  for (const method of declarations) {
    assert.equal(typeof MissionApplicationApi.prototype[method as keyof MissionApplicationApi], "function");
  }
});

test("public Mission API executes all declared methods with stable committed results", async () => {
  const provider = new ReferencePersistenceProvider();
  const transactions = new ReferenceApplicationTransactionFactory(provider);
  const reads = new ReferenceReadRepositorySessionFactory(provider);
  const api = new MissionApplicationApi(
    new ApplicationCommandRunner(transactions),
    new ApplicationQueryRunner(reads)
  );

  const created = await api.createMission(createCommand(), context);
  assert.deepEqual(created, {
    transactionId: created.transactionId,
    status: "COMMITTED",
    resourceReferences: [{ resourceType: "Mission", resourceId: missionId }]
  });
  const auditCount = provider.listAuditRecords(tenantId).length;
  const replayed = await api.createMission(createCommand(), context);
  assert.deepEqual(replayed, created);
  assert.equal(provider.listAuditRecords(tenantId).length, auditCount);
  await assert.rejects(
    api.createMission({ ...createCommand(), reason: "A different auditable intent" }, context),
    (error: { readonly code?: string }) => error.code === "IDEMPOTENCY_CONFLICT"
  );
  assert.equal(provider.listAuditRecords(tenantId).length, auditCount);

  const renamed = await api.renameMission({
    idempotencyKey: "rename-mission-key",
    reason: "Rename the Mission",
    targetId: missionId,
    payload: { missionId, expectedVersion: 1, title: "Renamed Mission", occurredAt: timestamp(1) }
  }, context);
  assert.equal(renamed.status, "COMMITTED");

  await mutateForNextPublicCommand(provider, "prepare_for_activate", (mission) => {
    mission.authorize(directDecision(2));
    mission.prepare(directDecision(3));
  });
  const activated = await api.activateMission(decisionCommand("activate-mission-key", 4, 4), context);
  assert.equal(activated.status, "COMMITTED");

  await mutateForNextPublicCommand(provider, "prepare_for_complete", (mission) => {
    mission.submitForReview(directDecision(5));
    mission.beginOutcomeDecision(directDecision(6));
  });
  const completed = await api.completeMission(decisionCommand("complete-mission-key", 7, 7, true), context);
  assert.equal(completed.status, "COMMITTED");

  const auditBeforeQuery = provider.listAuditRecords(tenantId).length;
  assert.equal(auditBeforeQuery, 6);
  const queryResult = await api.getMission({ targetId: missionId }, {
    tenantId,
    actor: context.actor,
    correlationId: context.correlationId
  });
  assert.equal(queryResult?.status, "CLOSED_WITH_LEARNING");
  assert.equal(queryResult?.id, missionId);
  assert.equal(provider.listAuditRecords(tenantId).length, auditBeforeQuery);
});

test("Mission API validates before opening a Unit of Work", async () => {
  let opened = 0;
  const api = new MissionApplicationApi(
    new ApplicationCommandRunner({
      open: () => {
        opened += 1;
        throw new Error("Unit of Work must not open");
      }
    }),
    new ApplicationQueryRunner({
      open: () => ({ mission: {} as ReadRepositorySession["mission"], authority: {} as ReadRepositorySession["authority"], decision: {} as ReadRepositorySession["decision"], agent: {} as ReadRepositorySession["agent"], execution: {} as ReadRepositorySession["execution"], asset: {} as ReadRepositorySession["asset"], knowledge: {} as ReadRepositorySession["knowledge"], policy: {} as ReadRepositorySession["policy"] })
    })
  );
  assert.throws(
    () => api.createMission({
      idempotencyKey: "invalid-create",
      reason: "Invalid input",
      payload: {}
    }, context),
    /missionId/u
  );
  assert.equal(opened, 0);
});
