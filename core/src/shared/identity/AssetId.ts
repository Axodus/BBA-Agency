import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "asset";

export class AssetId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): AssetId { return new AssetId(value); }
  public static deterministic(seed: string): AssetId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
