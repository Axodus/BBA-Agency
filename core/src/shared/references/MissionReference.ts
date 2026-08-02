import { MissionId } from "../identity/MissionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class MissionReference extends TenantReference<MissionId> {
  public constructor(missionId: MissionId, tenantId: TenantId) { super(missionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): MissionReference {
    return new MissionReference(MissionId.from(value.id), TenantId.from(value.tenantId));
  }
}
