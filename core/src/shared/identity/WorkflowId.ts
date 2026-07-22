import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "workflow";

export class WorkflowId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): WorkflowId { return new WorkflowId(value); }
  public static deterministic(seed: string): WorkflowId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
