import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "review_finding";

export class ReviewFindingId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ReviewFindingId { return new ReviewFindingId(value); }
  public static deterministic(seed: string): ReviewFindingId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
