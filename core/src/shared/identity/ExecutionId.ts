import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "execution";

export class ExecutionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ExecutionId { return new ExecutionId(value); }
  public static deterministic(seed: string): ExecutionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
