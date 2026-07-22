import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "publication_version";

export class PublicationVersionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PublicationVersionId { return new PublicationVersionId(value); }
  public static deterministic(seed: string): PublicationVersionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
