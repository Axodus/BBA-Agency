import type { GovernanceWorkAuthorizationPort } from "../../../application/ports/GovernanceWorkAuthorizationPort.js";
import type { AuthorizationResult } from "../../../application/ports/GovernanceAuthorizationPort.js";
import type { AgentRepository } from "../ports/AgentRepository.js";
import type { ExecutionRepository } from "../ports/ExecutionRepository.js";
import { provisionAgent } from "./ProvisionAgent.js";
import { assignAgent } from "./AssignAgent.js";
import { startExecution } from "./StartExecution.js";
import { completeExecution } from "./CompleteExecution.js";
import type { ProvisionAgentCommand, AssignAgentCommand, StartExecutionCommand, CompleteExecutionCommand } from "../domain/WorkforceCommands.js";
import type { Agent } from "../domain/Agent.js";
import type { Execution } from "../domain/Execution.js";
import type { WorkAssignment } from "../domain/WorkAssignment.js";
import type { TenantId, ExecutionId } from "../../../shared/identity/index.js";

export class AIWorkCoordinator {
  public constructor(private readonly agents: AgentRepository, private readonly executions: ExecutionRepository, private readonly authorization: GovernanceWorkAuthorizationPort) {}
  public provision(command: ProvisionAgentCommand): Promise<Agent> { return provisionAgent(this.agents, command); }
  public async assign(command: AssignAgentCommand): Promise<{ readonly result: AuthorizationResult; readonly assignment?: WorkAssignment }> { return assignAgent(this.agents, this.authorization, command); }
  public async start(command: StartExecutionCommand): Promise<Execution> {
    const agent = await this.agents.findById(command.tenantId, command.agentReference.id);
    if (agent === null) throw new Error("Agent not found for Execution");
    const assignment = agent.assignments.find((item) => item.id.equals(command.workAssignmentReference.id) && item.missionReference.id.equals(command.missionReference.id));
    if (assignment === undefined) throw new Error("WorkAssignment reference does not belong to the Agent and Mission");
    const expectedAgentVersion = agent.version;
    agent.startAssignment(assignment.id, command.occurredAt);
    await this.agents.save(agent, expectedAgentVersion);
    return startExecution(this.executions, command);
  }
  public complete(tenantId: TenantId, executionId: ExecutionId, command: CompleteExecutionCommand): Promise<Execution> { return completeExecution(this.executions, tenantId, executionId, command); }
}
