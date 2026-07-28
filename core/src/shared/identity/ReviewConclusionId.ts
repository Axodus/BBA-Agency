import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "review_conclusion";

export class ReviewConclusionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ReviewConclusionId { return new ReviewConclusionId(value); }
  public static deterministic(seed: string): ReviewConclusionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
