import { assertCanonicalTimestamp } from "../common/timestamps.js";
import type { JsonObject, JsonValue } from "../common/serialization.js";
import { ValidationError } from "../errors/ValidationError.js";
import { ValueObject } from "../valueobject/ValueObject.js";

const RELATIONSHIPS = new Set<LineageRelationship>([
  "originates_from", "derived_from", "references", "summarizes", "translates",
  "extends", "reviews", "approves", "supersedes", "publishes", "contradicts"
]);

export type LineageRelationship =
  | "originates_from"
  | "derived_from"
  | "references"
  | "summarizes"
  | "translates"
  | "extends"
  | "reviews"
  | "approves"
  | "supersedes"
  | "publishes"
  | "contradicts";

export interface LineageReferenceProps {
  readonly sourceId: string;
  readonly targetId: string;
  readonly relationship: LineageRelationship;
  readonly declaredAt: string;
  readonly reason?: string;
}

export class LineageReference extends ValueObject<JsonObject> {
  public constructor(props: LineageReferenceProps) {
    const sourceId = props.sourceId.trim();
    const targetId = props.targetId.trim();
    if (sourceId.length === 0 || targetId.length === 0) {
      throw new ValidationError("LineageReference sourceId and targetId are required");
    }
    if (sourceId === targetId) {
      throw new ValidationError("LineageReference cannot point an object to itself");
    }
    if (!RELATIONSHIPS.has(props.relationship)) {
      throw new ValidationError("LineageReference relationship is not canonical", { relationship: props.relationship });
    }
    const reason = props.reason?.trim();
    const serialized: Record<string, JsonValue> = {
      sourceId,
      targetId,
      relationship: props.relationship,
      declaredAt: assertCanonicalTimestamp(props.declaredAt, "declaredAt")
    };
    if (reason !== undefined && reason.length > 0) serialized.reason = reason;
    super(serialized);
    Object.freeze(this);
  }
}
