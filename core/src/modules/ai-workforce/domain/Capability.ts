import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export interface CapabilityProps {
  readonly name: string;
  readonly scope: string;
  readonly qualityCriteria?: readonly string[];
  readonly limitations?: readonly string[];
}

export class Capability extends ValueObject<JsonObject> {
  public readonly name: string;
  public readonly scope: string;
  public readonly qualityCriteria: readonly string[];
  public readonly limitations: readonly string[];

  public constructor(props: CapabilityProps) {
    const name = props.name.trim(); const scope = props.scope.trim();
    if (name.length === 0 || scope.length === 0) throw new ValidationError("Capability name and scope are required");
    const qualityCriteria = Object.freeze([...(props.qualityCriteria ?? [])].map((item) => item.trim()).filter(Boolean));
    const limitations = Object.freeze([...(props.limitations ?? [])].map((item) => item.trim()).filter(Boolean));
    super({ name, scope, qualityCriteria, limitations } as unknown as JsonObject);
    this.name = name; this.scope = scope; this.qualityCriteria = qualityCriteria; this.limitations = limitations;
    Object.freeze(this);
  }

  public static fromJSON(value: JsonObject): Capability {
    return new Capability({ name: String(value.name), scope: String(value.scope), qualityCriteria: Array.isArray(value.qualityCriteria) ? value.qualityCriteria.map(String) : [], limitations: Array.isArray(value.limitations) ? value.limitations.map(String) : [] });
  }
}

export class CapabilitySet extends ValueObject<JsonObject> {
  private readonly entries: readonly Capability[];

  public constructor(capabilities: readonly Capability[]) {
    const unique = new Map<string, Capability>();
    for (const capability of capabilities) unique.set(`${capability.name}:${capability.scope}`, capability);
    const entries = Object.freeze([...unique.values()].sort((left, right) => left.name.localeCompare(right.name)));
    super({ capabilities: entries.map((item) => item.toJSON()) } as unknown as JsonObject);
    this.entries = entries; Object.freeze(this);
  }

  public get capabilities(): readonly Capability[] { return [...this.entries]; }
  public has(name: string): boolean { return this.entries.some((item) => item.name === name); }
  public satisfies(required: readonly Capability[]): boolean { return required.every((item) => this.entries.some((candidate) => candidate.equals(item))); }
  public static fromJSON(value: JsonObject): CapabilitySet { return new CapabilitySet(Array.isArray(value.capabilities) ? value.capabilities.map((item) => Capability.fromJSON(item as JsonObject)) : []); }
}
