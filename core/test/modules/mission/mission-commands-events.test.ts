import assert from "node:assert/strict";
import test from "node:test";
import { MissionOutcome } from "../../../src/modules/mission/domain/MissionOutcome.js";
import { MissionStatus } from "../../../src/modules/mission/domain/MissionStatus.js";
import { advanceToActive, advanceToOutcomeDecision, createMission, decision, timestamp } from "./mission-fixtures.js";

test("Mission commands emit ordered versioned events across the canonical lifecycle", () => {
  const mission = createMission();
  mission.rename({ title: "Renamed Mission", occurredAt: timestamp(1) });
  mission.updateDescription({ description: "Updated description", occurredAt: timestamp(2) });
  mission.authorize(decision("authorize", 3));
  mission.prepare(decision("prepare", 4));
  mission.activate(decision("activate", 5));
  mission.pause(decision("pause", 6));
  mission.resume({ ...decision("resume", 7), targetStatus: MissionStatus.IN_PROGRESS });
  mission.submitForReview(decision("review", 8));
  mission.beginOutcomeDecision(decision("outcome", 9));
  mission.complete({
    ...decision("complete", 10),
    outcome: new MissionOutcome({
      result: "Aggregate implemented",
      learning: "Canonical state mapping is explicit",
      limitations: "Authority resolution remains deferred",
      residualObligations: "Implement Human Governance in EPIC-IMP-003"
    })
  });
  mission.archive(decision("archive", 11));

  assert.equal(mission.status, MissionStatus.CLOSED_WITH_LEARNING);
  assert.equal(mission.archivedAt, timestamp(11));
  assert.equal(mission.version.value, 12);
  const events = mission.domainEvents.map((event) => event.toJSON());
  assert.deepEqual(events.map((event) => event.type), [
    "MissionCreated", "MissionRenamed", "MissionDescriptionUpdated",
    "MissionAuthorized", "MissionPrepared", "MissionActivated",
    "MissionPaused", "MissionResumed", "MissionReviewStarted",
    "MissionOutcomeDecisionStarted", "MissionCompleted", "MissionArchived"
  ]);
  assert.deepEqual(events.map((event) => event.version), Array.from({ length: 12 }, (_, index) => index + 1));
  assert.equal((events[5]?.payload as { actorReference?: string }).actorReference, "actor-activate");
});

test("CancelMission maps to canonical STOPPED and emits MissionCancelled", () => {
  const mission = createMission();
  advanceToActive(mission);
  mission.cancel(decision("cancel", 4));
  assert.equal(mission.status, MissionStatus.STOPPED);
  assert.equal(mission.domainEvents.at(-1)?.toJSON().type, "MissionCancelled");
  assert.throws(() => mission.rename({ title: "Forbidden", occurredAt: timestamp(5) }), /Terminal/u);
});

test("CompleteMission requires OUTCOME_DECISION and explicit learning", () => {
  const mission = createMission();
  advanceToOutcomeDecision(mission);
  assert.throws(() => new MissionOutcome({
    result: "Result", learning: " ", limitations: "Known", residualObligations: "Tracked"
  }), /learning/u);
  mission.complete({
    ...decision("complete", 6),
    outcome: new MissionOutcome({
      result: "Accepted outcome",
      learning: "Tests preserve semantic closure",
      limitations: "No external authority evaluation",
      residualObligations: "Proceed to Governance"
    })
  });
  assert.equal(mission.status, MissionStatus.CLOSED_WITH_LEARNING);
  assert.ok(mission.outcome);
});
