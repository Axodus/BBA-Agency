import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "mission";

export class MissionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): MissionId { return new MissionId(value); }
  public static deterministic(seed: string): MissionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
