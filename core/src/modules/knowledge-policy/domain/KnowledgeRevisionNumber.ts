import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class KnowledgeRevisionNumber extends ValueObject<number> {
  public constructor(value: number) {
    if (!Number.isSafeInteger(value) || value < 1) throw new ValidationError("KnowledgeRevisionNumber must be a positive safe integer", { value: String(value) });
    super(value);
    Object.freeze(this);
  }
  public static initial(): KnowledgeRevisionNumber { return new KnowledgeRevisionNumber(1); }
  public get value(): number { return this.rawValue; }
  public increment(): KnowledgeRevisionNumber { return new KnowledgeRevisionNumber(this.value + 1); }
}
