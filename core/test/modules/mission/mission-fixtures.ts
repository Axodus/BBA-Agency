import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { EvidenceId } from "../../../src/shared/identity/EvidenceId.js";
import { MissionId } from "../../../src/shared/identity/MissionId.js";
import { TenantId } from "../../../src/shared/identity/TenantId.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { Mission } from "../../../src/modules/mission/domain/Mission.js";
import type { MissionDecisionContext } from "../../../src/modules/mission/domain/MissionCommands.js";
import { MissionIntent } from "../../../src/modules/mission/domain/MissionIntent.js";
import { MissionMetadata } from "../../../src/modules/mission/domain/MissionMetadata.js";

export const missionId = MissionId.deterministic("mission-fixture");
export const tenantId = TenantId.deterministic("tenant-fixture");

export function timestamp(second: number): string {
  return `2026-07-22T12:00:${String(second).padStart(2, "0")}.000Z`;
}

export function evidence(seed: string, second = 0): EvidenceReference {
  return new EvidenceReference({
    evidenceId: EvidenceId.deterministic(seed),
    source: `fixture-${seed}`,
    type: "test-record",
    capturedAt: timestamp(second),
    locator: `fixture://${seed}`
  });
}

export function lineage(id: MissionId = missionId, seed = "request"): LineageReference {
  return new LineageReference({
    sourceId: `request_${seed}`,
    targetId: id.toString(),
    relationship: "originates_from",
    declaredAt: timestamp(0),
    reason: "Mission creation request"
  });
}

export function decision(seed: string, second: number): MissionDecisionContext {
  return {
    actorReference: `actor-${seed}`,
    authorityReference: `authority-${seed}`,
    reason: `Decision ${seed}`,
    occurredAt: timestamp(second),
    evidence: [evidence(`decision-${seed}`, second)]
  };
}

export function createMission(id: MissionId = missionId, tenant: TenantId = tenantId): Mission {
  return Mission.create({
    missionId: id,
    tenantId: tenant,
    metadata: new MissionMetadata({
      title: "Canonical Mission",
      summary: "A bounded institutional objective",
      description: "Mission fixture for deterministic domain tests",
      createdAt: timestamp(0),
      updatedAt: timestamp(0)
    }),
    intent: new MissionIntent({
      purpose: "Produce accountable institutional learning",
      objective: "Validate the Mission Aggregate",
      stewardReference: "steward-fixture",
      audience: "Internal implementation reviewers",
      context: "EPIC-IMP-002 deterministic validation",
      constraints: ["No external publication", "No autonomous authority"],
      expectedOutcome: "A verified Mission domain contract"
    }),
    evidence: [evidence("creation")],
    lineage: [lineage(id)]
  });
}

export function advanceToPrepared(mission: Mission): void {
  mission.authorize(decision("authorize", 1));
  mission.prepare(decision("prepare", 2));
}

export function advanceToActive(mission: Mission): void {
  advanceToPrepared(mission);
  mission.activate(decision("activate", 3));
}

export function advanceToOutcomeDecision(mission: Mission): void {
  advanceToActive(mission);
  mission.submitForReview(decision("review", 4));
  mission.beginOutcomeDecision(decision("outcome", 5));
}
