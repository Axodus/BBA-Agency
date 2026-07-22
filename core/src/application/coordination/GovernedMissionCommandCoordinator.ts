import type { GovernedMissionCommand, GovernanceAuthorizationPort, AuthorizationResult } from "../ports/GovernanceAuthorizationPort.js";
import type { MissionCommandPort } from "../ports/MissionCommandPort.js";

export class GovernedMissionCommandCoordinator {
  public constructor(private readonly authorization: GovernanceAuthorizationPort, private readonly missionCommands: MissionCommandPort) {}
  public async execute(command: GovernedMissionCommand): Promise<AuthorizationResult> {
    const result = await this.authorization.authorize(command);
    if (result.status === "REJECTED") return result;
    await this.missionCommands.execute(command);
    return result;
  }
}
