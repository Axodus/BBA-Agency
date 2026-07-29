import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class PolicyVersionNumber extends ValueObject<number> {
  public constructor(value: number) {
    if (!Number.isSafeInteger(value) || value < 1) throw new ValidationError("PolicyVersionNumber must be a positive safe integer", { value: String(value) });
    super(value);
    Object.freeze(this);
  }
  public static initial(): PolicyVersionNumber { return new PolicyVersionNumber(1); }
  public get value(): number { return this.rawValue; }
  public next(): PolicyVersionNumber { return new PolicyVersionNumber(this.value + 1); }
}
