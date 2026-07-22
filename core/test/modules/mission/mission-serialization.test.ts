import assert from "node:assert/strict";
import test from "node:test";
import { MissionRehydration } from "../../../src/modules/mission/domain/MissionRehydration.js";
import { parseMissionSnapshot } from "../../../src/modules/mission/domain/MissionSnapshot.js";
import { MissionStatus } from "../../../src/modules/mission/domain/MissionStatus.js";
import { advanceToActive, createMission, decision } from "./mission-fixtures.js";

test("Mission snapshot serialization is deterministic and rehydration is lossless", () => {
  const mission = createMission();
  advanceToActive(mission);
  mission.pause(decision("serialization-pause", 4));
  const serialized = mission.serialize();
  const rehydrated = MissionRehydration.fromSerialized(serialized);
  assert.equal(rehydrated.serialize(), serialized);
  assert.deepEqual(rehydrated.toSnapshot(), mission.toSnapshot());
  assert.equal(rehydrated.status, MissionStatus.PAUSED);
  assert.equal(rehydrated.domainEvents.length, 0);
  assert.equal(rehydrated.id.equals(mission.id), true);
  assert.equal(rehydrated.tenantId.equals(mission.tenantId), true);
});

test("MissionSnapshot compatibility rejects unsupported or incomplete schemas", () => {
  const snapshot = createMission().toSnapshot();
  assert.throws(() => parseMissionSnapshot({ ...snapshot, schemaVersion: 2 }), /not supported/u);
  const { missionId: omittedMissionId, ...withoutMissionId } = snapshot;
  assert.ok(omittedMissionId);
  assert.throws(() => parseMissionSnapshot(withoutMissionId), /missionId/u);
  assert.throws(() => MissionRehydration.fromSerialized("not-json"), /Unexpected token/u);
});
