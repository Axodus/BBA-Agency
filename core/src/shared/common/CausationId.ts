import { ValidationError } from "../errors/ValidationError.js";
import { deterministicHash } from "./serialization.js";

const PREFIX = "causation_";

export class CausationId {
  private readonly canonicalValue: string;

  private constructor(value: string) {
    if (!/^causation_[a-z0-9][a-z0-9._~-]*$/u.test(value)) {
      throw new ValidationError("CausationId must use its canonical format", { value });
    }
    this.canonicalValue = value;
    Object.freeze(this);
  }

  public static from(value: string): CausationId {
    return new CausationId(value);
  }

  public static deterministic(seed: string): CausationId {
    return new CausationId(`${PREFIX}${deterministicHash(seed)}`);
  }

  public toString(): string {
    return this.canonicalValue;
  }

  public equals(other: unknown): boolean {
    return other instanceof CausationId && other.canonicalValue === this.canonicalValue;
  }

  public hashCode(): string {
    return deterministicHash(this.canonicalValue);
  }

  public toJSON(): string {
    return this.canonicalValue;
  }
}
