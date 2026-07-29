import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export const AuthorityLevel = {
  ADVISORY: "ADVISORY",
  OPERATIONAL: "OPERATIONAL",
  INSTITUTIONAL: "INSTITUTIONAL",
  FINAL: "FINAL"
} as const;
export type AuthorityLevelType = typeof AuthorityLevel[keyof typeof AuthorityLevel];

export class AuthorityLevelValue extends ValueObject<string> {
  public constructor(value: AuthorityLevelType) {
    if (!Object.values(AuthorityLevel).includes(value)) throw new ValidationError("Authority level is invalid");
    super(value);
    Object.freeze(this);
  }
  public get value(): AuthorityLevelType { return this.rawValue as AuthorityLevelType; }
}
