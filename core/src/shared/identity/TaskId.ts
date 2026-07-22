import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "task";

export class TaskId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): TaskId { return new TaskId(value); }
  public static deterministic(seed: string): TaskId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
