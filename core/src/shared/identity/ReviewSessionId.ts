import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "review_session";

export class ReviewSessionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ReviewSessionId { return new ReviewSessionId(value); }
  public static deterministic(seed: string): ReviewSessionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
