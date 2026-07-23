import type { AggregateDto, ApplicationCommandContext, CommittedOperationResultDto, OperationCommandDto, QueryContext, QueryDto } from "../dto/ApplicationContext.js";

export interface MissionCommandApiPort {
  createMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  activateMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  renameMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
  completeMission(command: OperationCommandDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto>;
}
export interface MissionQueryApiPort { getMission(query: QueryDto, context: QueryContext): Promise<AggregateDto | null>; }
