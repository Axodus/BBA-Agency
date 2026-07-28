import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "publication";

export class PublicationId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PublicationId { return new PublicationId(value); }
  public static deterministic(seed: string): PublicationId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
