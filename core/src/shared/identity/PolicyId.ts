import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "policy";

export class PolicyId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PolicyId { return new PolicyId(value); }
  public static deterministic(seed: string): PolicyId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
