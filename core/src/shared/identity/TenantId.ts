import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "tenant";

export class TenantId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): TenantId { return new TenantId(value); }
  public static deterministic(seed: string): TenantId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
