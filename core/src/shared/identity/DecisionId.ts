import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "decision";

export class DecisionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): DecisionId { return new DecisionId(value); }
  public static deterministic(seed: string): DecisionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
