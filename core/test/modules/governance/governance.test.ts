import assert from "node:assert/strict";
import test from "node:test";
import { CorrelationId, EvidenceId, LineageReference, TenantId, AuthorityId, AssignmentId, DecisionId, ApprovalId, MissionId, Version } from "../../../src/shared/index.js";
import { AuthorityReference, AssignmentReference, ApprovalReference, DecisionReference } from "../../../src/shared/references/index.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { InMemoryAuthorityRepository } from "../../../src/modules/governance/infrastructure/InMemoryAuthorityRepository.js";
import { InMemoryDecisionRepository } from "../../../src/modules/governance/infrastructure/InMemoryDecisionRepository.js";
import { Authority } from "../../../src/modules/governance/domain/Authority.js";
import { AuthorityLevel } from "../../../src/modules/governance/domain/AuthorityLevel.js";
import { AuthorityScope } from "../../../src/modules/governance/domain/AuthorityScope.js";
import { AuthorityStatus } from "../../../src/modules/governance/domain/AuthorityStatus.js";
import { AssignmentPeriod } from "../../../src/modules/governance/domain/AssignmentPeriod.js";
import { Decision } from "../../../src/modules/governance/domain/Decision.js";
import { DecisionStatus } from "../../../src/modules/governance/domain/DecisionStatus.js";
import { DecisionType } from "../../../src/modules/governance/domain/DecisionType.js";
import { HumanActorReference } from "../../../src/modules/governance/domain/HumanActorReference.js";
import type { CreateAuthorityCommand, CreateDecisionCommand } from "../../../src/modules/governance/domain/GovernanceCommands.js";
import { DecisionAuthorizationService } from "../../../src/modules/governance/application/DecisionAuthorizationService.js";
import { GovernedMissionCommandCoordinator } from "../../../src/application/coordination/GovernedMissionCommandCoordinator.js";
import type { GovernedMissionCommand } from "../../../src/application/ports/GovernanceAuthorizationPort.js";
import { createMission, evidence as missionEvidence } from "../mission/mission-fixtures.js";

const tenant = TenantId.deterministic("governance-tenant");
const otherTenant = TenantId.deterministic("other-tenant");
const authorityId = AuthorityId.deterministic("authority");
const authorityReference = new AuthorityReference(authorityId, tenant);
const scope = new AuthorityScope({ purpose: "governance", actions: ["activate_mission", "complete_mission"] });
function evidenceReference(seed: string) {
  return new EvidenceReference({ evidenceId: EvidenceId.deterministic(seed), source: "test", type: "record", capturedAt: "2026-07-22T10:00:00.000Z" });
}
function lineage(seed: string, target: string) { return new LineageReference({ sourceId: `source_${seed}`, targetId: target, relationship: "references", declaredAt: "2026-07-22T10:00:00.000Z" }); }
function audit(actor = "human:reviewer", reason = "reviewed") {
  return { actorReference: new HumanActorReference(actor), reason, occurredAt: "2026-07-22T10:00:00.000Z", correlationId: CorrelationId.deterministic(reason), evidence: [evidenceReference(reason)], lineage: [lineage(reason, authorityId.toString())] };
}
function authorityCommand(): CreateAuthorityCommand { return { authorityId, tenantId: tenant, level: AuthorityLevel.INSTITUTIONAL, scope, ...audit("human:owner", "created") }; }
function decisionCommand(): CreateDecisionCommand { const decisionId = DecisionId.deterministic("decision"); return { decisionId, tenantId: tenant, missionId: MissionId.deterministic("mission"), decisionType: DecisionType.INSTITUTIONAL_APPROVAL, authorityReference, ...audit("human:owner", "created-decision"), lineage: [lineage("decision", decisionId.toString())] }; }

test("Authority protects lifecycle, suspension and Assignment ownership", () => {
  const authority = Authority.create(authorityCommand());
  assert.equal(authority.status, AuthorityStatus.PROPOSED);
  authority.activate({ ...audit("human:owner", "activated") });
  const assignmentId = AssignmentId.deterministic("assignment");
  const assignment = authority.assign({ ...audit("human:owner", "assigned"), assignmentId, delegateReference: new HumanActorReference("human:delegate"), scope, period: new AssignmentPeriod({ startsAt: "2026-07-22T10:00:00.000Z", endsAt: "2026-07-23T10:00:00.000Z" }) });
  assert.deepEqual(assignment, new AssignmentReference(assignmentId, tenant));
  assert.equal(authority.assignments[0]?.authorityId.equals(authority.id), true);
  assert.throws(() => authority.assign({ ...audit("human:owner", "overlap"), assignmentId: AssignmentId.deterministic("assignment-2"), delegateReference: new HumanActorReference("human:delegate"), scope, period: new AssignmentPeriod({ startsAt: "2026-07-22T12:00:00.000Z", endsAt: "2026-07-24T10:00:00.000Z" }) }), /overlaps/u);
  authority.suspend({ ...audit("human:owner", "suspended"), until: "2026-07-24T10:00:00.000Z" });
  assert.equal(authority.status, AuthorityStatus.ACTIVE);
  assert.throws(() => authority.assign({ ...audit("human:owner", "blocked"), assignmentId: AssignmentId.deterministic("assignment-3"), delegateReference: new HumanActorReference("human:other"), scope, period: new AssignmentPeriod({ startsAt: "2026-07-25T10:00:00.000Z", endsAt: "2026-07-26T10:00:00.000Z" }) }), /suspended/u);
  authority.activate({ ...audit("human:owner", "resumed") });
  authority.revokeAssignment({ ...audit("human:owner", "revoked"), assignmentId });
  const expiringId = AssignmentId.deterministic("expiring-assignment");
  authority.assign({ ...audit("human:owner", "assigned-again"), assignmentId: expiringId, delegateReference: new HumanActorReference("human:other"), scope, period: new AssignmentPeriod({ startsAt: "2026-07-25T10:00:00.000Z", endsAt: "2026-07-26T10:00:00.000Z" }) });
  authority.expireAssignment({ ...audit("human:owner", "expired"), assignmentId: expiringId });
  assert.ok(authority.domainEvents.some((event) => event.toJSON().type === "AssignmentGranted"));
  assert.deepEqual(authority.toSnapshot(), Authority.rehydrate(authority.toSnapshot()).toSnapshot());
});

test("Decision approval and finalization are auditable and immutable", () => {
  const decision = Decision.create(decisionCommand());
  const approvalId = ApprovalId.deterministic("approval");
  decision.approve({ ...audit("human:approver", "approved"), approvalId, authorityReference });
  assert.equal(decision.status, DecisionStatus.APPROVED);
  assert.ok(decision.approvalReference instanceof ApprovalReference);
  decision.finalize({ ...audit("human:approver", "finalized") });
  assert.equal(decision.status, DecisionStatus.FINALIZED);
  assert.throws(() => decision.reject({ ...audit("human:approver", "late-rejection"), approvalId: ApprovalId.deterministic("late"), authorityReference }), /immutable/u);
  assert.deepEqual(decision.toSnapshot(), Decision.rehydrate(decision.toSnapshot()).toSnapshot());
  assert.ok(decision.domainEvents.some((event) => event.toJSON().type === "DecisionFinalized"));
  const rejected = Decision.create({ ...decisionCommand(), decisionId: DecisionId.deterministic("rejected-decision") });
  rejected.reject({ ...audit("human:approver", "rejected"), approvalId: ApprovalId.deterministic("rejected-approval"), authorityReference });
  assert.equal(rejected.status, DecisionStatus.REJECTED);
});

test("repositories enforce Tenant and optimistic Version contracts", async () => {
  const authorities = new InMemoryAuthorityRepository();
  const authority = Authority.create(authorityCommand());
  await authorities.save(authority, Version.initial());
  assert.ok(await authorities.findById(tenant, authorityId));
  await assert.rejects(() => authorities.findById(otherTenant, authorityId), /Tenant/u);
  const decisions = new InMemoryDecisionRepository();
  const decision = Decision.create(decisionCommand());
  await decisions.save(decision, Version.initial());
  assert.ok(await decisions.findById(tenant, decision.id));
});

test("Authorization port hides Decision internals from the Coordinator", async () => {
  const decisions = new InMemoryDecisionRepository();
  const decision = Decision.create(decisionCommand());
  await decisions.save(decision, Version.initial());
  decision.approve({ ...audit("human:approver", "approved"), approvalId: ApprovalId.deterministic("coordinator-approval"), authorityReference });
  await decisions.save(decision, Version.from(1));
  decision.finalize({ ...audit("human:approver", "finalized") });
  await decisions.save(decision, Version.from(3));
  const approvalReference = decision.approvalReference;
  assert.ok(approvalReference);
  const command: GovernedMissionCommand = { tenantId: tenant, missionId: decision.missionId, commandName: "activate", decisionReference: new DecisionReference(decision.id, tenant), authorityReference, approvalReference, evidence: [], reason: "authorized", occurredAt: "2026-07-22T10:00:00.000Z" };
  let executed = false;
  const coordinator = new GovernedMissionCommandCoordinator(new DecisionAuthorizationService(decisions), { execute: async () => { executed = true; } });
  assert.deepEqual(await coordinator.execute(command), { status: "AUTHORIZED" });
  assert.equal(executed, true);
});

test("Mission stores only neutral Governance references", () => {
  const mission = createMission(MissionId.deterministic("governance-mission"), tenant);
  const missionAuthority = new AuthorityReference(AuthorityId.deterministic("mission-authority"), tenant);
  const missionDecision = new DecisionReference(DecisionId.deterministic("mission-decision"), tenant);
  const missionApproval = new ApprovalReference(ApprovalId.deterministic("mission-approval"), tenant);
  mission.authorize({ actorReference: "human:steward", authorityReference: missionAuthority, decisionReference: missionDecision, approvalReference: missionApproval, reason: "authorized", occurredAt: "2026-07-22T12:00:01.000Z", evidence: [missionEvidence("governance", 1)] });
  assert.equal(mission.authorityReferences.length, 1);
  assert.equal(mission.decisionReferences.length, 1);
  assert.equal(mission.approvalReferences.length, 1);
  assert.equal(mission.toSnapshot().decisionReferences[0]?.id, missionDecision.id.toString());
});
