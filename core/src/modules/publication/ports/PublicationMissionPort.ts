import type { MissionReference } from "../../../shared/references/index.js";

export interface PublicationMissionPort {
  validateMissionReference(mission: MissionReference): Promise<void>;
  missionAllowsPublication(mission: MissionReference): Promise<boolean>;
}
