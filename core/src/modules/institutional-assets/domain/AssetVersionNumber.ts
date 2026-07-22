import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class AssetVersionNumber extends ValueObject<number> {
  public constructor(value: number) { if (!Number.isInteger(value) || value < 1) throw new ValidationError("AssetVersionNumber must be a positive integer"); super(value); Object.freeze(this); }
  public get value(): number { return this.rawValue; }
  public next(): AssetVersionNumber { return new AssetVersionNumber(this.value + 1); }
}
