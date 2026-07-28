import type { PersistedMissionCommand, RenameMissionCommand } from "../domain/MissionCommands.js";
import type { Mission } from "../domain/Mission.js";
import type { MissionRepository } from "../ports/MissionRepository.js";
import { loadMission } from "./loadMission.js";

export class RenameMission {
  public constructor(private readonly repository: MissionRepository) {}

  public async execute(input: PersistedMissionCommand<RenameMissionCommand>): Promise<Mission> {
    const mission = await loadMission(this.repository, input.tenantId, input.missionId);
    mission.rename(input.command);
    await this.repository.save(mission, input.expectedVersion);
    return mission;
  }
}
