import { ValidationError } from "../errors/ValidationError.js";
import { deterministicHash } from "./serialization.js";

const PREFIX = "correlation_";

export class CorrelationId {
  private readonly canonicalValue: string;

  private constructor(value: string) {
    if (!/^correlation_[a-z0-9][a-z0-9._~-]*$/u.test(value)) {
      throw new ValidationError("CorrelationId must use its canonical format", { value });
    }
    this.canonicalValue = value;
    Object.freeze(this);
  }

  public static from(value: string): CorrelationId {
    return new CorrelationId(value);
  }

  public static deterministic(seed: string): CorrelationId {
    return new CorrelationId(`${PREFIX}${deterministicHash(seed)}`);
  }

  public toString(): string {
    return this.canonicalValue;
  }

  public equals(other: unknown): boolean {
    return other instanceof CorrelationId && other.canonicalValue === this.canonicalValue;
  }

  public hashCode(): string {
    return deterministicHash(this.canonicalValue);
  }

  public toJSON(): string {
    return this.canonicalValue;
  }
}
