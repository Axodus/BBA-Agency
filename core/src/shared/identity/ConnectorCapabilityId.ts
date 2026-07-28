import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "connector_capability";

export class ConnectorCapabilityId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ConnectorCapabilityId { return new ConnectorCapabilityId(value); }
  public static deterministic(seed: string): ConnectorCapabilityId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
