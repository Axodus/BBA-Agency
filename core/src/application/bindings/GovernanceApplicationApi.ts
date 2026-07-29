import type { GovernanceCommandApiPort, GovernanceQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { ApplicationCommandContext, ApproveDecisionRequestDto, AssignAuthorityRequestDto, AuthorityDto, CommittedOperationResultDto, CreateAuthorityRequestDto, CreateDecisionRequestDto, DecisionDto, FinalizeDecisionRequestDto, GetAuthorityRequestDto, GetDecisionRequestDto, QueryContext, RejectDecisionRequestDto } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { approveDecisionBinding, assignAuthorityBinding, createAuthorityBinding, createDecisionBinding, finalizeDecisionBinding, getAuthorityBinding, getDecisionBinding, rejectDecisionBinding } from "./GovernanceBindings.js";

export class GovernanceApplicationApi implements GovernanceCommandApiPort, GovernanceQueryApiPort {
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner) {}
  public createAuthority(command: CreateAuthorityRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(createAuthorityBinding, this.commands, command, context); }
  public assignAuthority(command: AssignAuthorityRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(assignAuthorityBinding, this.commands, command, context); }
  public createDecision(command: CreateDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(createDecisionBinding, this.commands, command, context); }
  public approveDecision(command: ApproveDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(approveDecisionBinding, this.commands, command, context); }
  public rejectDecision(command: RejectDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(rejectDecisionBinding, this.commands, command, context); }
  public finalizeDecision(command: FinalizeDecisionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(finalizeDecisionBinding, this.commands, command, context); }
  public getAuthority(query: GetAuthorityRequestDto, context: QueryContext): Promise<AuthorityDto | null> { return executeBoundQuery(getAuthorityBinding, this.queries, query, context); }
  public getDecision(query: GetDecisionRequestDto, context: QueryContext): Promise<DecisionDto | null> { return executeBoundQuery(getDecisionBinding, this.queries, query, context); }
}
