import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "policy_version";

export class PolicyVersionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PolicyVersionId { return new PolicyVersionId(value); }
  public static deterministic(seed: string): PolicyVersionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
