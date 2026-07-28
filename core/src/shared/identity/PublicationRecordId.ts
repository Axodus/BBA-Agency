import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "publication_record";

export class PublicationRecordId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): PublicationRecordId { return new PublicationRecordId(value); }
  public static deterministic(seed: string): PublicationRecordId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
