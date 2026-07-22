import { deterministicHash } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";
import { Identity, type IdentityKind } from "./Identity.js";

export class IdentityFactory {
  public static deterministic(kind: IdentityKind, seed: string): string {
    if (seed.trim().length === 0) {
      throw new ValidationError("Identity seed is required", { kind });
    }
    return `${kind}_${deterministicHash(`${kind}:${seed}`)}`;
  }

  public static create(kind: IdentityKind, token: string): Identity {
    return Identity.from(`${kind}_${token}`);
  }
}
