import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "authority";

export class AuthorityId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): AuthorityId { return new AuthorityId(value); }
  public static deterministic(seed: string): AuthorityId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
