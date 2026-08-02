import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "work_assignment";

export class WorkAssignmentId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): WorkAssignmentId { return new WorkAssignmentId(value); }
  public static deterministic(seed: string): WorkAssignmentId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
