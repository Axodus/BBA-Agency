import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export type IdentityKind =
  | "tenant"
  | "mission"
  | "asset"
  | "agent"
  | "assignment"
  | "authority"
  | "approval"
  | "decision"
  | "evidence"
  | "connector"
  | "execution"
  | "work_assignment";

const CANONICAL_ID = /^([a-z][a-z0-9_]*)_([a-z0-9][a-z0-9._~-]*)$/u;

export class Identity extends ValueObject<string> {
  private readonly identityKind: string;

  protected constructor(value: string, expectedKind?: IdentityKind) {
    const match = CANONICAL_ID.exec(value);
    if (match === null) {
      throw new ValidationError("Identity must use a canonical opaque string", { value });
    }
    const identityKind = match[1];
    const token = match[2];
    if (identityKind === undefined || token === undefined) {
      throw new ValidationError("Identity must contain a canonical kind and token", { value });
    }
    if (expectedKind !== undefined && identityKind !== expectedKind) {
      throw new ValidationError("Identity kind does not match its canonical prefix", {
        expectedKind,
        actualKind: identityKind
      });
    }
    super(value);
    this.identityKind = identityKind;
    Object.freeze(this);
  }

  public static from(value: string): Identity {
    return new Identity(value);
  }

  public get kind(): string {
    return this.identityKind;
  }

  public get value(): string {
    return this.rawValue;
  }

  public override toString(): string {
    return this.value;
  }
}
