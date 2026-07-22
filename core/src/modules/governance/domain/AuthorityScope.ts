import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface AuthorityScopeProps {
  readonly purpose: string;
  readonly actions: readonly string[];
  readonly constraints?: readonly string[];
}

export class AuthorityScope extends ValueObject<JsonObject> {
  public constructor(props: AuthorityScopeProps) {
    const purpose = props.purpose.trim();
    const actions = props.actions.map((action) => action.trim()).filter(Boolean);
    if (purpose.length === 0 || actions.length === 0) throw new ValidationError("Authority scope requires purpose and actions");
    const serialized: Record<string, JsonValue> = { purpose, actions: [...actions] };
    if (props.constraints !== undefined) serialized.constraints = props.constraints.map((item) => item.trim()).filter(Boolean);
    super(serialized);
    Object.freeze(this);
  }
  public get purpose(): string { return String(this.rawValue.purpose); }
  public get actions(): readonly string[] { return [...(this.rawValue.actions as string[])]; }
}
