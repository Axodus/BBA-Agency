import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export class Version extends ValueObject<number> {
  private constructor(value: number) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new ValidationError("Version must be a non-negative safe integer", { value: String(value) });
    }
    super(value);
    Object.freeze(this);
  }

  public static initial(): Version { return new Version(0); }
  public static from(value: number): Version { return new Version(value); }
  public get value(): number { return this.rawValue; }
  public increment(): Version { return new Version(this.value + 1); }
  public compare(other: Version): -1 | 0 | 1 {
    if (this.value < other.value) return -1;
    if (this.value > other.value) return 1;
    return 0;
  }
  public isAfter(other: Version): boolean { return this.compare(other) === 1; }
  public isBefore(other: Version): boolean { return this.compare(other) === -1; }
}
