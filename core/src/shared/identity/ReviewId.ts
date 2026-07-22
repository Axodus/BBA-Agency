import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "review";

export class ReviewId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ReviewId { return new ReviewId(value); }
  public static deterministic(seed: string): ReviewId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
