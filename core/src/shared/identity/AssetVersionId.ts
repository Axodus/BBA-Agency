import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "asset_version";

export class AssetVersionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): AssetVersionId { return new AssetVersionId(value); }
  public static deterministic(seed: string): AssetVersionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
