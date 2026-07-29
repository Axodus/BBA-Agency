import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "connector";

export class ConnectorId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ConnectorId { return new ConnectorId(value); }
  public static deterministic(seed: string): ConnectorId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
