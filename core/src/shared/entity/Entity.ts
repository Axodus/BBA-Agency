import type { JsonValue } from "../common/serialization.js";
import { ValueObject } from "../valueobject/ValueObject.js";

export abstract class Entity<TId extends ValueObject<JsonValue>> {
  private readonly identity: TId;

  protected constructor(id: TId) {
    this.identity = id;
    Object.defineProperty(this, "identity", { writable: false, configurable: false });
  }

  public get id(): TId {
    return this.identity;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Entity) || this.constructor !== other.constructor) return false;
    return this.identity.equals((other as Entity<TId>).identity);
  }

  public toJSON(): { readonly id: JsonValue } {
    return { id: this.identity.toJSON() };
  }
}
