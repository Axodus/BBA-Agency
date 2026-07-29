import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "workflow_execution";

export class WorkflowExecutionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): WorkflowExecutionId { return new WorkflowExecutionId(value); }
  public static deterministic(seed: string): WorkflowExecutionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
