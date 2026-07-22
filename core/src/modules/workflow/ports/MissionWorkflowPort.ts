import type { MissionReference } from "../../../shared/references/index.js";

export interface MissionWorkflowPort {
  validateMissionReference(reference: MissionReference): Promise<void>;
  missionAllowsWorkflow(reference: MissionReference): Promise<boolean>;
}
