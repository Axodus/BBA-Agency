import { Version } from "../../../shared/version/Version.js";
import { Mission } from "../domain/Mission.js";
import type { CreateMissionCommand } from "../domain/MissionCommands.js";
import type { MissionRepository } from "../ports/MissionRepository.js";

export class CreateMission {
  public constructor(private readonly repository: MissionRepository) {}

  public async execute(command: CreateMissionCommand): Promise<Mission> {
    const mission = Mission.create(command);
    await this.repository.save(mission, Version.initial());
    return mission;
  }
}
