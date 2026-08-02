import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "evidence";

export class EvidenceId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): EvidenceId { return new EvidenceId(value); }
  public static deterministic(seed: string): EvidenceId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
