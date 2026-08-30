import { describe, expect, test } from "vitest";
import { mapCompleteMission, mapRenameMission } from "../src/features/missions/operations/actions/mapper.js";
import { completeMissionSchema, renameMissionSchema } from "../src/features/missions/operations/actions/schema.js";
import { mapCreateMission } from "../src/features/missions/operations/create/mapper.js";
import { createMissionSchema } from "../src/features/missions/operations/create/schema.js";

const timestamp = "2026-07-28T12:00";
const evidence = [{ evidenceId: "evidence_1", source: "source", type: "record", capturedAt: timestamp }];
const lineage = [{ sourceId: "source_1", targetId: "mission_1", relationship: "supports", declaredAt: timestamp }];

describe("Mission product contracts", () => {
  test("maps a structured create form without exposing raw form state", () => {
    const values = createMissionSchema.parse({ reason: "Create governed Mission", missionId: "mission_1", title: "Mission", summary: "Summary", description: "Description", createdAt: timestamp, updatedAt: timestamp, purpose: "Purpose", objective: "Objective", stewardReference: "person:steward", context: "Context", expectedOutcome: "Outcome", evidence, lineage });
    expect(mapCreateMission(values)).toMatchObject({ missionId: "mission_1", metadata: { title: "Mission" }, intent: { stewardReference: "person:steward" } });
    expect(mapCreateMission(values).metadata.createdAt).toBe(new Date(timestamp).toISOString());
  });

  test("keeps operational reason outside rename payload", () => {
    const values = renameMissionSchema.parse({ reason: "Correct title", title: "Renamed", expectedVersion: 2, occurredAt: timestamp });
    expect(mapRenameMission("mission_1", values)).toEqual({ missionId: "mission_1", title: "Renamed", expectedVersion: 2, occurredAt: new Date(timestamp).toISOString() });
  });

  test("requires governed completion outcome and evidence", () => {
    const parsed = completeMissionSchema.safeParse({ reason: "Complete Mission", expectedVersion: 2, authorityReference: "authority_1", occurredAt: timestamp, evidence, result: "Done", learning: "Learning", limitations: "None", residualObligations: "None" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(mapCompleteMission("mission_1", parsed.data).outcome.result).toBe("Done");
  });
});
