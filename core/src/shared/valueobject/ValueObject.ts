import { cloneJson, deepFreeze, deterministicHash, stableSerialize } from "../common/serialization.js";
import type { JsonValue } from "../common/serialization.js";

export abstract class ValueObject<T extends JsonValue> {
  private readonly props: T;

  protected constructor(props: T) {
    this.props = deepFreeze(props);
    Object.defineProperty(this, "props", { writable: false, configurable: false });
  }

  protected get rawValue(): T {
    return this.props;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof ValueObject) || this.constructor !== other.constructor) return false;
    const candidate = other as ValueObject<JsonValue>;
    return stableSerialize(this.props) === stableSerialize(candidate.props);
  }

  public hashCode(): string {
    return deterministicHash(stableSerialize(this.props));
  }

  public toJSON(): T {
    return cloneJson(this.props);
  }
}
