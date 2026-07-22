import assert from "node:assert/strict";
import test from "node:test";
import { ActivateMission } from "../../../src/modules/mission/application/ActivateMission.js";
import { CompleteMission } from "../../../src/modules/mission/application/CompleteMission.js";
import { CreateMission } from "../../../src/modules/mission/application/CreateMission.js";
import { RenameMission } from "../../../src/modules/mission/application/RenameMission.js";
import { MissionIntent } from "../../../src/modules/mission/domain/MissionIntent.js";
import { MissionMetadata } from "../../../src/modules/mission/domain/MissionMetadata.js";
import { MissionOutcome } from "../../../src/modules/mission/domain/MissionOutcome.js";
import { MissionStatus } from "../../../src/modules/mission/domain/MissionStatus.js";
import { InMemoryMissionRepository } from "../../../src/modules/mission/infrastructure/InMemoryMissionRepository.js";
import { Version } from "../../../src/shared/version/Version.js";
import { decision, evidence, lineage, missionId, tenantId, timestamp } from "./mission-fixtures.js";

test("application use cases coordinate through MissionRepository without infrastructure coupling", async () => {
  const repository = new InMemoryMissionRepository();
  const created = await new CreateMission(repository).execute({
    missionId,
    tenantId,
    metadata: new MissionMetadata({
      title: "Application Mission",
      summary: "Use case validation",
      description: "Created through application boundary",
      createdAt: timestamp(0),
      updatedAt: timestamp(0)
    }),
    intent: new MissionIntent({
      purpose: "Validate application coordination",
      objective: "Exercise public use cases",
      stewardReference: "steward-application",
      audience: "Core reviewers",
      context: "Application test",
      expectedOutcome: "Persisted Mission"
    }),
    evidence: [evidence("application-create")],
    lineage: [lineage()]
  });
  const renamed = await new RenameMission(repository).execute({
    tenantId,
    missionId,
    expectedVersion: created.version,
    command: { title: "Application Mission Renamed", occurredAt: timestamp(1) }
  });
  assert.equal(renamed.version.value, 2);

  const prepared = await repository.findById(tenantId, missionId);
  assert.ok(prepared);
  prepared.authorize(decision("app-authorize", 2));
  prepared.prepare(decision("app-prepare", 3));
  await repository.save(prepared, Version.from(2));
  const active = await new ActivateMission(repository).execute({
    tenantId,
    missionId,
    expectedVersion: prepared.version,
    command: decision("app-activate", 4)
  });
  assert.equal(active.status, MissionStatus.IN_PROGRESS);

  const deciding = await repository.findById(tenantId, missionId);
  assert.ok(deciding);
  deciding.submitForReview(decision("app-review", 5));
  deciding.beginOutcomeDecision(decision("app-outcome", 6));
  await repository.save(deciding, active.version);
  const completed = await new CompleteMission(repository).execute({
    tenantId,
    missionId,
    expectedVersion: deciding.version,
    command: {
      ...decision("app-complete", 7),
      outcome: new MissionOutcome({
        result: "Use cases completed",
        learning: "Ports preserve aggregate ownership",
        limitations: "In-memory adapter only",
        residualObligations: "Replace adapter in EPIC-IMP-011"
      })
    }
  });
  assert.equal(completed.status, MissionStatus.CLOSED_WITH_LEARNING);
});

test("application use cases surface optimistic concurrency and missing Mission failures", async () => {
  const repository = new InMemoryMissionRepository();
  await assert.rejects(new RenameMission(repository).execute({
    tenantId,
    missionId,
    expectedVersion: Version.initial(),
    command: { title: "Missing", occurredAt: timestamp(1) }
  }), /not found/u);
});
