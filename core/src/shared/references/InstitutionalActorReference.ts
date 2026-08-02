import type { JsonObject } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";
import { TenantId } from "../identity/TenantId.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export class InstitutionalActorReference extends ValueObject<JsonObject> {
  public readonly reference: string; public readonly tenantId: TenantId;
  public constructor(reference: string, tenantId: TenantId) {
    const normalized = reference.trim();
    if (normalized.length === 0) throw new ValidationError("Institutional actor reference is required");
    super({ reference: normalized, tenantId: tenantId.toString() }); this.reference = normalized; this.tenantId = tenantId; Object.freeze(this);
  }
  public static fromJSON(value: { readonly reference: string; readonly tenantId: string }): InstitutionalActorReference { return new InstitutionalActorReference(value.reference, TenantId.from(value.tenantId)); }
}
