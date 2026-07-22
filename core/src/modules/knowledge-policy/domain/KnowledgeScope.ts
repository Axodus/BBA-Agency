import type { JsonObject } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export class KnowledgeScope extends ValueObject<JsonObject> {
  public readonly domainArea: string; public readonly audience: string; public readonly constraints: readonly string[];
  public constructor(props: { readonly domainArea: string; readonly audience: string; readonly constraints?: readonly string[] }) {
    const domainArea = props.domainArea.trim(); const audience = props.audience.trim(); const constraints = [...(props.constraints ?? [])].map((item) => item.trim()).filter(Boolean);
    if (!domainArea || !audience) throw new ValidationError("KnowledgeScope requires domain area and audience");
    super({ domainArea, audience, constraints });
    this.domainArea = domainArea; this.audience = audience; this.constraints = Object.freeze([...constraints]); Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): KnowledgeScope {
    return new KnowledgeScope({ domainArea: String(value.domainArea), audience: String(value.audience), constraints: Array.isArray(value.constraints) ? value.constraints.map(String) : [] });
  }
}
