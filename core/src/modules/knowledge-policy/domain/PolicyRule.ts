import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

const FORBIDDEN = /\b(workflow|review|publication|connector|runtime|engine|execute|expression|javascript|typescript|openai|anthropic|gemini|llm|rag)\b/iu;

export class PolicyRule extends ValueObject<JsonObject> {
  public readonly ruleKey: string; public readonly statement: string; public readonly obligation: string; public readonly applicability: string; public readonly priority: number; public readonly rationale: string;
  public constructor(props: { readonly ruleKey: string; readonly statement: string; readonly obligation: string; readonly applicability: string; readonly priority: number; readonly rationale: string }) {
    const ruleKey = props.ruleKey.trim().toLowerCase(); const statement = props.statement.trim(); const obligation = props.obligation.trim(); const applicability = props.applicability.trim(); const rationale = props.rationale.trim();
    if (!/^[a-z0-9][a-z0-9._~-]*$/u.test(ruleKey) || !statement || !obligation || !applicability || !rationale) throw new ValidationError("PolicyRule requires institutional rule fields");
    if (!Number.isSafeInteger(props.priority) || props.priority < 1) throw new ValidationError("PolicyRule priority must be a positive safe integer");
    const combined = `${statement} ${obligation} ${applicability} ${rationale}`;
    if (FORBIDDEN.test(combined)) throw new ValidationError("PolicyRule must describe institutional policy without execution concepts");
    super({ ruleKey, statement, obligation, applicability, priority: props.priority, rationale });
    this.ruleKey = ruleKey; this.statement = statement; this.obligation = obligation; this.applicability = applicability; this.priority = props.priority; this.rationale = rationale; Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): PolicyRule {
    return new PolicyRule({ ruleKey: String(value.ruleKey), statement: String(value.statement), obligation: String(value.obligation), applicability: String(value.applicability), priority: Number(value.priority), rationale: String(value.rationale) });
  }
}
