import assert from "node:assert/strict";
import test from "node:test";
import { MissionLifecycle } from "../../../src/modules/mission/domain/MissionLifecycle.js";
import { MissionStatus } from "../../../src/modules/mission/domain/MissionStatus.js";
import { MissionMetadata } from "../../../src/modules/mission/domain/MissionMetadata.js";
import { MissionIntent } from "../../../src/modules/mission/domain/MissionIntent.js";
import { MissionId } from "../../../src/shared/identity/MissionId.js";
import { tenantId, createMission, decision, evidence, lineage, timestamp } from "./mission-fixtures.js";
import { Mission } from "../../../src/modules/mission/domain/Mission.js";

test("Mission is completely initialized in the canonical PROPOSED entry state", () => {
  const mission = createMission();
  assert.equal(mission.status, MissionStatus.PROPOSED);
  assert.equal(mission.version.value, 1);
  assert.equal(mission.tenantId.equals(tenantId), true);
  assert.equal(mission.metadata.title, "Canonical Mission");
  assert.equal(mission.intent.stewardReference, "steward-fixture");
  assert.equal(mission.evidence.length, 1);
  assert.equal(mission.lineage.length, 1);
  assert.equal(mission.domainEvents[0]?.toJSON().type, "MissionCreated");
});

test("Mission creation rejects missing Evidence, Lineage, audience, and metadata", () => {
  const id = MissionId.deterministic("invalid-mission");
  const metadata = new MissionMetadata({
    title: "Invalid Mission",
    summary: "Missing foundations",
    description: "Used to validate aggregate invariants",
    createdAt: timestamp(0),
    updatedAt: timestamp(0)
  });
  const intent = new MissionIntent({
    purpose: "Test invalid creation",
    objective: "Reject partial aggregate",
    stewardReference: "steward-test",
    noAudienceReason: "No audience for an invariant test",
    context: "Unit test",
    expectedOutcome: "Safe rejection"
  });
  assert.throws(() => Mission.create({ missionId: id, tenantId, metadata, intent, evidence: [], lineage: [lineage(id)] }), /preserve Evidence/u);
  assert.throws(() => Mission.create({ missionId: id, tenantId, metadata, intent, evidence: [evidence("invalid")], lineage: [] }), /preserve Lineage/u);
  assert.throws(() => new MissionIntent({
    purpose: "Test",
    objective: "Test",
    stewardReference: "steward",
    context: "Test",
    expectedOutcome: "Test"
  }), /audience/u);
  assert.throws(() => new MissionMetadata({
    title: " ", summary: "summary", description: "description",
    createdAt: timestamp(0), updatedAt: timestamp(0)
  }), /title/u);
});

test("MissionLifecycle exposes only canonical Source of Truth transitions", () => {
  assert.equal(MissionLifecycle.canTransition(MissionStatus.PROPOSED, MissionStatus.AUTHORIZED), true);
  assert.equal(MissionLifecycle.canTransition(MissionStatus.PROPOSED, MissionStatus.IN_PROGRESS), false);
  assert.deepEqual(MissionLifecycle.transitionsFrom(MissionStatus.REJECTED), []);
  assert.throws(() => MissionLifecycle.assertTransition(MissionStatus.PROPOSED, MissionStatus.IN_PROGRESS), /not allowed/u);
});

test("invalid transition leaves Mission state and Version unchanged", () => {
  const mission = createMission();
  const version = mission.version;
  assert.throws(() => mission.activate(decision("invalid-activation", 1)), /not allowed/u);
  assert.equal(mission.status, MissionStatus.PROPOSED);
  assert.equal(mission.version.equals(version), true);
  assert.equal(mission.domainEvents.length, 1);
});

test("invalid decision timestamp leaves Mission Evidence and state unchanged", () => {
  const mission = createMission();
  mission.authorize(decision("authorize", 2));
  const evidenceCount = mission.evidence.length;
  const version = mission.version;
  assert.throws(() => mission.prepare(decision("past-prepare", 1)), /updatedAt cannot precede/u);
  assert.equal(mission.status, MissionStatus.AUTHORIZED);
  assert.equal(mission.evidence.length, evidenceCount);
  assert.equal(mission.version.equals(version), true);
});
