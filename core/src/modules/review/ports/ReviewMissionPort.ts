import type { MissionReference } from "../../../shared/references/index.js";

export interface ReviewMissionPort {
  validateMissionReference(reference: MissionReference): Promise<void>;
  missionAllowsReview(reference: MissionReference): Promise<boolean>;
}
