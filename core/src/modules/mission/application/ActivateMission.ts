import type { Mission } from "../domain/Mission.js";
import type { MissionDecisionContext, PersistedMissionCommand } from "../domain/MissionCommands.js";
import type { MissionRepository } from "../ports/MissionRepository.js";
import { loadMission } from "./loadMission.js";

export class ActivateMission {
  public constructor(private readonly repository: MissionRepository) {}

  public async execute(input: PersistedMissionCommand<MissionDecisionContext>): Promise<Mission> {
    const mission = await loadMission(this.repository, input.tenantId, input.missionId);
    mission.activate(input.command);
    await this.repository.save(mission, input.expectedVersion);
    return mission;
  }
}
