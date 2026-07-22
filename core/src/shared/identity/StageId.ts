import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "stage";

export class StageId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): StageId { return new StageId(value); }
  public static deterministic(seed: string): StageId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
