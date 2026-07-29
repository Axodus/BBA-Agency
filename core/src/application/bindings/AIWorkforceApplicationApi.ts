import type { AIWorkforceCommandApiPort, AIWorkforceQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { AgentDto, ApplicationCommandContext, AssignAgentRequestDto, AssignAgentResponseDto, CompleteExecutionRequestDto, CompleteExecutionResponseDto, ExecutionDto, GetAgentRequestDto, GetExecutionRequestDto, ProvisionAgentRequestDto, ProvisionAgentResponseDto, QueryContext, StartExecutionRequestDto, StartExecutionResponseDto } from "../dto/ApplicationContext.js";
import type { GovernanceWorkAuthorizationPort } from "../ports/GovernanceWorkAuthorizationPort.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { createAIWorkforceBindings, type AgentRepositories, type ExecutionRepositories, type ReadAgentRepositories, type ReadExecutionRepositories, type WorkforceRepositories } from "./AIWorkforceBindings.js";

export class AIWorkforceApplicationApi implements AIWorkforceCommandApiPort, AIWorkforceQueryApiPort {
  private readonly bindings;
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner, authorization: GovernanceWorkAuthorizationPort) { this.bindings = createAIWorkforceBindings(authorization); }
  public provisionAgent(command: ProvisionAgentRequestDto, context: ApplicationCommandContext): Promise<ProvisionAgentResponseDto> { return executeBoundCommand<ProvisionAgentRequestDto, import("../dto/ApplicationContext.js").CommittedOperationResultDto, AgentRepositories>(this.bindings.provisionAgent, this.commands, command, context); }
  public assignAgent(command: AssignAgentRequestDto, context: ApplicationCommandContext): Promise<AssignAgentResponseDto> { return executeBoundCommand<AssignAgentRequestDto, import("../dto/ApplicationContext.js").CommittedOperationResultDto, WorkforceRepositories>(this.bindings.assignAgent, this.commands, command, context); }
  public startExecution(command: StartExecutionRequestDto, context: ApplicationCommandContext): Promise<StartExecutionResponseDto> { return executeBoundCommand<StartExecutionRequestDto, import("../dto/ApplicationContext.js").CommittedOperationResultDto, WorkforceRepositories>(this.bindings.startExecution, this.commands, command, context); }
  public completeExecution(command: CompleteExecutionRequestDto, context: ApplicationCommandContext): Promise<CompleteExecutionResponseDto> { return executeBoundCommand<CompleteExecutionRequestDto, import("../dto/ApplicationContext.js").CommittedOperationResultDto, ExecutionRepositories>(this.bindings.completeExecution, this.commands, command, context); }
  public getAgent(query: GetAgentRequestDto, context: QueryContext): Promise<AgentDto | null> { return executeBoundQuery<GetAgentRequestDto, import("../../modules/ai-workforce/domain/Agent.js").Agent | null, AgentDto | null, ReadAgentRepositories>(this.bindings.getAgent, this.queries, query, context); }
  public getExecution(query: GetExecutionRequestDto, context: QueryContext): Promise<ExecutionDto | null> { return executeBoundQuery<GetExecutionRequestDto, import("../../modules/ai-workforce/domain/Execution.js").Execution | null, ExecutionDto | null, ReadExecutionRepositories>(this.bindings.getExecution, this.queries, query, context); }
}
