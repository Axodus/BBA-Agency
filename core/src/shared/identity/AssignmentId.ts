import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "assignment";

export class AssignmentId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): AssignmentId { return new AssignmentId(value); }
  public static deterministic(seed: string): AssignmentId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
