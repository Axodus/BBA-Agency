import type { MissionId } from "../../../shared/identity/MissionId.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Mission } from "../domain/Mission.js";

export interface MissionRepository {
  save(mission: Mission, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, missionId: MissionId): Promise<Mission | null>;
  exists(tenantId: TenantId, missionId: MissionId): Promise<boolean>;
}
