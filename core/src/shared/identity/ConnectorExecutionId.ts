import { Identity, type IdentityKind } from "./Identity.js";
import { IdentityFactory } from "./IdentityFactory.js";

const KIND: IdentityKind = "connector_execution";

export class ConnectorExecutionId extends Identity {
  private constructor(value: string) { super(value, KIND); }
  public static override from(value: string): ConnectorExecutionId { return new ConnectorExecutionId(value); }
  public static deterministic(seed: string): ConnectorExecutionId { return this.from(IdentityFactory.deterministic(KIND, seed)); }
}
