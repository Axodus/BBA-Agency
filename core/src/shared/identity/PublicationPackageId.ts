import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "publication_package";

export class PublicationPackageId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PublicationPackageId { return new PublicationPackageId(value); }
  public static deterministic(seed: string): PublicationPackageId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
