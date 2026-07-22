import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "approval";

export class ApprovalId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ApprovalId { return new ApprovalId(value); }
  public static deterministic(seed: string): ApprovalId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
