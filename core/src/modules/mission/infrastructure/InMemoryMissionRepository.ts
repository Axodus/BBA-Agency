import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { MissionId } from "../../../shared/identity/MissionId.js";
import type { TenantId } from "../../../shared/identity/TenantId.js";
import type { Version } from "../../../shared/version/Version.js";
import { Mission } from "../domain/Mission.js";
import { MissionRehydration } from "../domain/MissionRehydration.js";
import type { MissionSnapshot } from "../domain/MissionSnapshot.js";
import type { MissionRepository } from "../ports/MissionRepository.js";

export class InMemoryMissionRepository implements MissionRepository {
  private readonly snapshots = new Map<string, MissionSnapshot>();

  public async save(mission: Mission, expectedVersion: Version): Promise<void> {
    const key = mission.id.toString();
    const stored = this.snapshots.get(key);
    if (stored === undefined) {
      if (expectedVersion.value !== 0) {
        throw new ConcurrencyConflict("Mission does not exist at the expected Version", {
          missionId: key,
          expectedVersion: String(expectedVersion.value),
          actualVersion: "absent"
        });
      }
    } else {
      if (stored.tenantId !== mission.tenantId.toString()) {
        throw new TenantViolation("Mission identity cannot cross a Tenant boundary", {
          missionId: key,
          storedTenantId: stored.tenantId,
          attemptedTenantId: mission.tenantId.toString()
        });
      }
      if (stored.version !== expectedVersion.value) {
        throw new ConcurrencyConflict("Mission optimistic Version check failed", {
          missionId: key,
          expectedVersion: String(expectedVersion.value),
          actualVersion: String(stored.version)
        });
      }
    }
    if (mission.version.value <= expectedVersion.value) {
      throw new InvariantViolation("Mission save requires a newer Version", {
        missionId: key,
        expectedVersion: String(expectedVersion.value),
        missionVersion: String(mission.version.value)
      });
    }
    this.snapshots.set(key, mission.toSnapshot());
  }

  public async findById(tenantId: TenantId, missionId: MissionId): Promise<Mission | null> {
    const snapshot = this.snapshots.get(missionId.toString());
    if (snapshot === undefined) return null;
    this.assertTenant(snapshot, tenantId);
    return MissionRehydration.fromSnapshot(snapshot);
  }

  public async exists(tenantId: TenantId, missionId: MissionId): Promise<boolean> {
    const snapshot = this.snapshots.get(missionId.toString());
    if (snapshot === undefined) return false;
    this.assertTenant(snapshot, tenantId);
    return true;
  }

  private assertTenant(snapshot: MissionSnapshot, tenantId: TenantId): void {
    if (snapshot.tenantId !== tenantId.toString()) {
      throw new TenantViolation("Mission lookup crossed a Tenant boundary", {
        missionId: snapshot.missionId,
        expectedTenantId: snapshot.tenantId,
        actualTenantId: tenantId.toString()
      });
    }
  }
}
