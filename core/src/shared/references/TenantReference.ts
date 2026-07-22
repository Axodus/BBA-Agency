import type { JsonObject } from "../common/serialization.js";
import { TenantId } from "../identity/TenantId.js";
import { Identity } from "../identity/Identity.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export abstract class TenantReference<TId extends Identity> extends ValueObject<JsonObject> {
  private readonly referenceId: TId;
  private readonly referenceTenantId: TenantId;

  protected constructor(id: TId, tenantId: TenantId) {
    super({ id: id.toString(), tenantId: tenantId.toString() });
    this.referenceId = id;
    this.referenceTenantId = tenantId;
    Object.freeze(this);
  }

  public get id(): TId { return this.referenceId; }
  public get tenantId(): TenantId { return this.referenceTenantId; }
}
