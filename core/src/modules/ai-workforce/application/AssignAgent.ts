import type { GovernanceWorkAuthorizationPort } from "../../../application/ports/GovernanceWorkAuthorizationPort.js";
import type { AuthorizationResult } from "../../../application/ports/GovernanceAuthorizationPort.js";
import type { AgentRepository } from "../ports/AgentRepository.js";
import type { AssignAgentCommand } from "../domain/WorkforceCommands.js";
import type { WorkAssignment } from "../domain/WorkAssignment.js";

export async function assignAgent(repository: AgentRepository, authorization: GovernanceWorkAuthorizationPort, command: AssignAgentCommand): Promise<{ readonly result: AuthorizationResult; readonly assignment?: WorkAssignment }> {
  const result = await authorization.authorizeWork({ tenantId: command.tenantId, missionReference: command.missionReference, commandName: "AssignAgent", authorityReference: command.authorityReference, decisionReference: command.decisionReference, ...(command.governanceAssignmentReference ? { governanceAssignmentReference: command.governanceAssignmentReference } : {}), evidence: command.evidence, lineage: command.lineage, reason: command.reason, occurredAt: command.occurredAt });
  if (result.status === "REJECTED") return { result };
  const agent = await repository.findById(command.tenantId, command.agentId); if (agent === null) throw new Error("Agent not found");
  const expectedVersion = agent.version; const assignment = agent.assign(command); await repository.save(agent, expectedVersion); return { result, assignment };
}
