import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "review_request";

export class ReviewRequestId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ReviewRequestId { return new ReviewRequestId(value); }
  public static deterministic(seed: string): ReviewRequestId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
