import assert from "node:assert/strict";
import test from "node:test";
import { CausationId, CorrelationId, EvidenceId, ExecutionId, AgentId, MissionId, TenantId, WorkAssignmentId, Version, AuthorityId, DecisionId } from "../../../src/shared/index.js";
import { EvidenceReference } from "../../../src/shared/evidence/EvidenceReference.js";
import { LineageReference } from "../../../src/shared/lineage/LineageReference.js";
import { AgentReference, AuthorityReference, DecisionReference, MissionReference, WorkAssignmentReference } from "../../../src/shared/references/index.js";
import { Agent } from "../../../src/modules/ai-workforce/domain/Agent.js";
import { Capability, CapabilitySet } from "../../../src/modules/ai-workforce/domain/Capability.js";
import { Execution } from "../../../src/modules/ai-workforce/domain/Execution.js";
import { AssignmentPolicy } from "../../../src/modules/ai-workforce/domain/AssignmentPolicy.js";
import { InMemoryAgentRepository } from "../../../src/modules/ai-workforce/infrastructure/InMemoryAgentRepository.js";
import { InMemoryExecutionRepository } from "../../../src/modules/ai-workforce/infrastructure/InMemoryExecutionRepository.js";
import { AIWorkCoordinator } from "../../../src/modules/ai-workforce/application/AIWorkCoordinator.js";
import type { ProvisionAgentCommand, AssignAgentCommand, StartExecutionCommand } from "../../../src/modules/ai-workforce/domain/WorkforceCommands.js";

const tenant = TenantId.deterministic("workforce-tenant");
const otherTenant = TenantId.deterministic("workforce-other-tenant");
const missionReference = new MissionReference(MissionId.deterministic("workforce-mission"), tenant);
const authorityReference = new AuthorityReference(AuthorityId.deterministic("workforce-authority"), tenant);
const decisionReference = new DecisionReference(DecisionId.deterministic("workforce-decision"), tenant);
const capability = new Capability({ name: "research", scope: "institutional sources", qualityCriteria: ["traceable"] });
const evidence = (seed: string, second = 0) => new EvidenceReference({ evidenceId: EvidenceId.deterministic(seed), source: `fixture-${seed}`, type: "test-record", capturedAt: `2026-07-22T12:00:${String(second).padStart(2, "0")}.000Z` });
const lineage = (seed: string, target: string) => new LineageReference({ sourceId: `source_${seed}`, targetId: target, relationship: "references", declaredAt: "2026-07-22T12:00:00.000Z" });
function audit(reason: string, second = 0) { return { reason, occurredAt: `2026-07-22T12:00:${String(second).padStart(2, "0")}.000Z`, correlationId: CorrelationId.deterministic(reason), causationId: CausationId.deterministic(`cause-${reason}`), evidence: [evidence(reason, second)], lineage: [lineage(reason, missionReference.id.toString())] }; }
function provisionCommand(agentId = AgentId.deterministic("workforce-agent")): ProvisionAgentCommand { return { agentId, tenantId: tenant, name: "Research Agent", purpose: "Perform bounded source research", definitionVersion: "1.0.0", capabilities: [capability], ...audit("provision") }; }

test("Capability is an immutable Value Object and Agent has no institutional Authority", () => {
  const set = new CapabilitySet([capability, new Capability({ name: "research", scope: "institutional sources" })]);
  assert.equal(set.capabilities.length, 1);
  assert.equal(Object.isFrozen(capability), true);
  const agent = Agent.provision(provisionCommand());
  assert.equal(agent.status, "PROVISIONED");
  assert.equal("authority" in agent, false);
  agent.activate({ ...audit("activate", 1) });
  assert.equal(agent.status, "AVAILABLE");
  agent.pause({ ...audit("pause", 2) }); assert.equal(agent.status, "PAUSED");
  agent.resume({ ...audit("resume", 3) }); assert.equal(agent.status, "AVAILABLE");
  agent.retire({ ...audit("retire", 4) }); assert.equal(agent.status, "RETIRED");
});

test("WorkAssignment is operational, Tenant-bound, and distinct from Governance Assignment", () => {
  const agent = Agent.provision(provisionCommand()); agent.activate({ ...audit("activate-assignment", 1) });
  const command: AssignAgentCommand = { workAssignmentId: WorkAssignmentId.deterministic("work-assignment"), tenantId: tenant, agentId: agent.id, missionReference, title: "Research sources", responsibility: "Produce traceable findings", requiredCapabilities: [capability], assignmentPolicy: new AssignmentPolicy({ exclusive: true, concurrencyKey: "research" }), authorityReference, decisionReference, ...audit("assign", 2) };
  const assignment = agent.assign(command);
  assert.equal(assignment.id.toString().startsWith("work_assignment_"), true);
  assert.equal(assignment.status, "ASSIGNED"); assert.equal(agent.status, "BUSY");
  assert.notEqual(assignment.id.toString(), "assignment_work-assignment");
  assert.throws(() => agent.assign({ ...command, workAssignmentId: WorkAssignmentId.deterministic("conflicting-assignment"), ...audit("conflict", 3) }), /incompatible/u);
  assert.throws(() => Agent.provision({ ...provisionCommand(AgentId.deterministic("other-agent")), tenantId: otherTenant, capabilities: [capability] }).assign(command), /active/u);
});

test("Execution uses only neutral references and becomes immutable after completion", () => {
  const agentId = AgentId.deterministic("execution-agent"); const workAssignmentId = WorkAssignmentId.deterministic("execution-assignment"); const executionId = ExecutionId.deterministic("execution");
  const command: StartExecutionCommand = { executionId, tenantId: tenant, missionReference, agentReference: new AgentReference(agentId, tenant), workAssignmentReference: new WorkAssignmentReference(workAssignmentId, tenant), ...audit("start", 4) };
  const execution = Execution.start(command);
  assert.equal(execution.status, "RUNNING"); assert.equal(execution.missionReference.id.equals(missionReference.id), true);
  execution.complete({ ...audit("complete", 5), result: { output: { finding: "traceable" }, uncertainty: "low", limitations: ["fixture"], metrics: { count: 1 }, provenance: ["fixture"] } });
  assert.equal(execution.status, "COMPLETED"); assert.equal(execution.version.value, 2);
  assert.throws(() => execution.cancel({ ...audit("late-cancel", 6) }), /COMPLETED/u);
  assert.deepEqual(execution.toSnapshot(), Execution.rehydrate(execution.toSnapshot()).toSnapshot());
  assert.ok(execution.domainEvents.some((event) => event.toJSON().type === "ExecutionStarted"));
  assert.ok(execution.domainEvents.some((event) => event.toJSON().type === "ExecutionCompleted"));
});

test("Execution failure and cancellation are terminal auditable outcomes", () => {
  const base = { tenantId: tenant, missionReference, agentReference: new AgentReference(AgentId.deterministic("terminal-agent"), tenant), workAssignmentReference: new WorkAssignmentReference(WorkAssignmentId.deterministic("terminal-assignment"), tenant) };
  const failed = Execution.start({ ...base, executionId: ExecutionId.deterministic("failed-execution"), ...audit("failed-start", 10) }); failed.fail({ ...audit("failed", 11), failure: "structured output rejected" }); assert.equal(failed.status, "FAILED"); assert.throws(() => failed.complete({ ...audit("late-complete", 12), result: { output: {} } }), /FAILED/u);
  const cancelled = Execution.start({ ...base, executionId: ExecutionId.deterministic("cancelled-execution"), ...audit("cancel-start", 13) }); cancelled.cancel({ ...audit("cancelled", 14) }); assert.equal(cancelled.status, "CANCELLED"); assert.throws(() => cancelled.fail({ ...audit("late-fail", 15), failure: "late" }), /CANCELLED/u);
});

test("Repositories enforce Tenant and optimistic Version contracts", async () => {
  const agents = new InMemoryAgentRepository(); const agent = Agent.provision(provisionCommand()); await agents.save(agent, Version.initial()); assert.ok(await agents.findById(tenant, agent.id)); await assert.rejects(() => agents.findById(otherTenant, agent.id), /Tenant/u); await assert.rejects(() => agents.save(agent, Version.initial()), /newer|optimistic/u);
  const execution = Execution.start({ executionId: ExecutionId.deterministic("repository-execution"), tenantId: tenant, missionReference, agentReference: new AgentReference(agent.id, tenant), workAssignmentReference: new WorkAssignmentReference(WorkAssignmentId.deterministic("repository-assignment"), tenant), ...audit("repository-start", 7) }); const executions = new InMemoryExecutionRepository(); await executions.save(execution, Version.initial()); assert.ok(await executions.findById(tenant, execution.id)); await assert.rejects(() => executions.findById(otherTenant, execution.id), /Tenant/u);
});

test("AIWorkCoordinator uses a neutral Governance authorization port", async () => {
  const agents = new InMemoryAgentRepository(); const executions = new InMemoryExecutionRepository(); const coordinator = new AIWorkCoordinator(agents, executions, { authorizeWork: async () => ({ status: "AUTHORIZED" }) }); const agent = await coordinator.provision(provisionCommand(AgentId.deterministic("coordinator-agent"))); agent.activate({ ...audit("coordinator-activate", 8) }); await agents.save(agent, Version.from(1));
  const result = await coordinator.assign({ workAssignmentId: WorkAssignmentId.deterministic("coordinator-assignment"), tenantId: tenant, agentId: agent.id, missionReference, title: "Coordinate research", responsibility: "Return bounded output", requiredCapabilities: [capability], authorityReference, decisionReference, ...audit("coordinator-assign", 9) });
  assert.equal(result.result.status, "AUTHORIZED"); assert.ok(result.assignment);
  const execution = await coordinator.start({ executionId: ExecutionId.deterministic("coordinator-execution"), tenantId: tenant, missionReference, agentReference: new AgentReference(agent.id, tenant), workAssignmentReference: new WorkAssignmentReference(result.assignment.id, tenant), ...audit("coordinator-start", 16) });
  assert.equal(execution.status, "RUNNING");
});
