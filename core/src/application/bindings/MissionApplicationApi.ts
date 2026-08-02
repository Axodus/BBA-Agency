import type { MissionCommandApiPort, MissionQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { ApplicationCommandContext, OperationCommandDto, QueryContext, QueryDto, AggregateDto, CommittedOperationResultDto } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { activateMissionBinding, completeMissionBinding, createMissionBinding, missionQueryBinding, renameMissionBinding } from "./MissionBindings.js";

export class MissionApplicationApi implements MissionCommandApiPort, MissionQueryApiPort {
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner) {}
  public createMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(createMissionBinding, this.commands, command, context); }
  public activateMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(activateMissionBinding, this.commands, command, context); }
  public renameMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(renameMissionBinding, this.commands, command, context); }
  public completeMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(completeMissionBinding, this.commands, command, context); }
  public getMission(query: QueryDto, context: QueryContext): Promise<AggregateDto | null> { return executeBoundQuery(missionQueryBinding, this.queries, query, context); }
}
