import type { JsonObject } from "../../../shared/common/serialization.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";
import { PolicyRule } from "./PolicyRule.js";

export class PolicyRuleSet extends ValueObject<JsonObject> {
  public readonly rules: readonly PolicyRule[];
  public constructor(rules: readonly PolicyRule[]) {
    if (rules.length === 0) throw new InvariantViolation("PolicyRuleSet requires at least one rule");
    const keys = new Set(rules.map((rule) => rule.ruleKey));
    if (keys.size !== rules.length) throw new InvariantViolation("PolicyRuleSet rule keys must be unique");
    super({ rules: rules.map((rule) => rule.toJSON()) });
    this.rules = Object.freeze([...rules]);
    Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): PolicyRuleSet {
    return new PolicyRuleSet(Array.isArray(value.rules) ? value.rules.map((item) => PolicyRule.fromJSON(item as JsonObject)) : []);
  }
}
