import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export type IdentityKind =
  | "tenant"
  | "mission"
  | "asset"
  | "asset_version"
  | "agent"
  | "assignment"
  | "authority"
  | "approval"
  | "decision"
  | "evidence"
  | "connector"
  | "execution"
  | "knowledge"
  | "policy"
  | "policy_version"
  | "work_assignment"
  | "workflow"
  | "workflow_execution"
  | "stage"
  | "task"
  | "review"
  | "review_request"
  | "review_session"
  | "review_finding"
  | "review_conclusion";

const CANONICAL_ID = /^([a-z][a-z0-9_]*)_([a-z0-9][a-z0-9._~-]*)$/u;
const CANONICAL_TOKEN = /^[a-z0-9][a-z0-9._~-]*$/u;

export class Identity extends ValueObject<string> {
  private readonly identityKind: string;

  protected constructor(value: string, expectedKind?: IdentityKind) {
    let identityKind: string;
    if (expectedKind !== undefined) {
      if (!value.startsWith(`${expectedKind}_`)) {
        const mismatch = CANONICAL_ID.exec(value);
        if (mismatch === null) throw new ValidationError("Identity must use a canonical opaque string", { value });
        throw new ValidationError("Identity kind does not match its canonical prefix", { expectedKind, actualKind: mismatch[1] ?? "unknown" });
      }
      const token = value.slice(expectedKind.length + 1);
      if (!CANONICAL_TOKEN.test(token)) throw new ValidationError("Identity must use a canonical opaque string", { value });
      identityKind = expectedKind;
    } else {
      const match = CANONICAL_ID.exec(value);
      if (match === null || match[1] === undefined) throw new ValidationError("Identity must use a canonical opaque string", { value });
      identityKind = match[1];
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
