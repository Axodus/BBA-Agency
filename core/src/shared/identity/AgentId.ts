import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "agent";

export class AgentId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): AgentId { return new AgentId(value); }
  public static deterministic(seed: string): AgentId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
