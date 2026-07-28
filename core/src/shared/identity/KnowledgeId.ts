import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "knowledge";

export class KnowledgeId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): KnowledgeId { return new KnowledgeId(value); }
  public static deterministic(seed: string): KnowledgeId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
