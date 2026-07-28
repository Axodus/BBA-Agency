import type { GovernedMissionCommand } from "./GovernanceAuthorizationPort.js";

export interface MissionCommandPort {
  execute(command: GovernedMissionCommand): Promise<void>;
}
