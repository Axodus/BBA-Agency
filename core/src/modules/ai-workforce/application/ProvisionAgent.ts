import type { AgentRepository } from "../ports/AgentRepository.js";
import { Agent } from "../domain/Agent.js";
import type { ProvisionAgentCommand } from "../domain/WorkforceCommands.js";
import { Version } from "../../../shared/version/Version.js";

export async function provisionAgent(repository: AgentRepository, command: ProvisionAgentCommand): Promise<Agent> { const agent = Agent.provision(command); await repository.save(agent, Version.initial()); return agent; }
