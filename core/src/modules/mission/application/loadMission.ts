import type { MissionId } from "../../../shared/identity/MissionId.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Mission } from "../domain/Mission.js";
import type { MissionRepository } from "../ports/MissionRepository.js";
import { MissionNotFoundError } from "./MissionNotFoundError.js";

export async function loadMission(
  repository: MissionRepository,
  tenantId: TenantId,
  missionId: MissionId
): Promise<Mission> {
  const mission = await repository.findById(tenantId, missionId);
  if (mission === null) throw new MissionNotFoundError(missionId.toString());
  return mission;
}
