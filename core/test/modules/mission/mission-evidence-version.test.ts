import assert from "node:assert/strict";
import test from "node:test";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { MissionId } from "../../../src/shared/identity/MissionId.js";
import { TenantId } from "../../../src/shared/identity/TenantId.js";
import { createMission, evidence, lineage, timestamp } from "./mission-fixtures.js";

test("every accepted Mission mutation increments Version exactly once", () => {
  const mission = createMission();
  const initial = mission.version;
  mission.rename({ title: "Version two", occurredAt: timestamp(1) });
  assert.equal(mission.version.value, initial.value + 1);
  mission.registerEvidence({ evidence: evidence("additional", 2), occurredAt: timestamp(2) });
  assert.equal(mission.version.value, initial.value + 2);
  mission.registerLineage({
    lineage: new LineageReference({
      sourceId: "source_additional",
      targetId: mission.id.toString(),
      relationship: "references",
      declaredAt: timestamp(3)
    }),
    occurredAt: timestamp(3)
  });
  assert.equal(mission.version.value, initial.value + 3);
});

test("Evidence and Lineage reject duplicates and invalid targets without mutation", () => {
  const mission = createMission();
  const duplicateEvidence = mission.evidence[0];
  assert.ok(duplicateEvidence);
  const version = mission.version;
  assert.throws(() => mission.registerEvidence({ evidence: duplicateEvidence, occurredAt: timestamp(1) }), /already registered/u);
  assert.throws(() => mission.registerLineage({ lineage: lineage(), occurredAt: timestamp(1) }), /already registered/u);
  assert.throws(() => mission.registerLineage({
    lineage: new LineageReference({
      sourceId: "source_wrong",
      targetId: MissionId.deterministic("other").toString(),
      relationship: "references",
      declaredAt: timestamp(1)
    }),
    occurredAt: timestamp(1)
  }), /target/u);
  assert.equal(mission.version.equals(version), true);
});

test("MissionId and TenantId remain immutable for the Aggregate lifetime", () => {
  const mission = createMission();
  assert.equal(Reflect.set(mission, "identity", MissionId.deterministic("other")), false);
  assert.equal(Reflect.set(mission, "missionTenantId", TenantId.deterministic("other")), false);
});
