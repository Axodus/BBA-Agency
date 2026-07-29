import { cloneJson, deepFreeze, type JsonObject, type JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

const FORBIDDEN_KEYS = new Set(["mimetype", "filename", "file_name", "url", "path", "format", "channel", "storage", "connector"]);
function assertDomainPayload(value: JsonValue, path = "content"): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) { value.forEach((item, index) => assertDomainPayload(item, `${path}[${index}]`)); return; }
  for (const [key, nested] of Object.entries(value)) { if (FORBIDDEN_KEYS.has(key.toLowerCase())) throw new ValidationError("CanonicalContent cannot contain physical representation fields", { field: `${path}.${key}` }); assertDomainPayload(nested, `${path}.${key}`); }
}
export interface CanonicalContentProps { readonly meaning: string; readonly data: JsonObject; readonly language?: string; }
export class CanonicalContent extends ValueObject<JsonObject> {
  public readonly meaning: string; public readonly data: JsonObject; public readonly language: string | undefined;
  public constructor(props: CanonicalContentProps) {
    const meaning = props.meaning.trim(); const language = props.language?.trim();
    if (meaning.length === 0) throw new ValidationError("CanonicalContent meaning is required"); assertDomainPayload(props.data);
    super({ meaning, data: cloneJson(props.data), ...(language ? { language } : {}) }); this.meaning = meaning; this.data = deepFreeze(cloneJson(props.data)); this.language = language || undefined; Object.freeze(this);
  }
  public static fromJSON(value: JsonObject): CanonicalContent { return new CanonicalContent({ meaning: String(value.meaning), data: value.data as JsonObject, ...(typeof value.language === "string" ? { language: value.language } : {}) }); }
}
