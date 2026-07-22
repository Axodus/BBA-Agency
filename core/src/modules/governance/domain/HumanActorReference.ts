import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class HumanActorReference extends ValueObject<string> {
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new ValidationError("Human actor reference is required");
    super(normalized);
    Object.freeze(this);
  }

  public static from(value: string): HumanActorReference { return new HumanActorReference(value); }

  public get value(): string { return this.rawValue; }
  public override toString(): string { return this.value; }
}
