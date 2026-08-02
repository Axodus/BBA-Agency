import type { JsonObject, JsonValue } from "../../../shared/common/serialization.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { TenantId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, KnowledgeReference, PolicyReference } from "../../../shared/references/index.js";
import { ValueObject } from "../../../shared/valueobject/ValueObject.js";

export type ReviewScopeTarget = AssetReference | AssetVersionReference | KnowledgeReference | PolicyReference;
export type ReviewScopeTargetKind = "asset" | "asset_version" | "knowledge" | "policy";
export interface ReviewScopeTargetSnapshot { readonly kind: ReviewScopeTargetKind; readonly reference: JsonObject; }

function serializeTarget(target: ReviewScopeTarget): ReviewScopeTargetSnapshot {
  if (target instanceof AssetVersionReference) return { kind: "asset_version", reference: target.toJSON() };
  if (target instanceof AssetReference) return { kind: "asset", reference: target.toJSON() };
  if (target instanceof KnowledgeReference) return { kind: "knowledge", reference: target.toJSON() };
  return { kind: "policy", reference: target.toJSON() };
}

function deserializeTarget(snapshot: ReviewScopeTargetSnapshot): ReviewScopeTarget {
  if (snapshot.kind === "asset") return AssetReference.fromJSON(snapshot.reference as { id: string; tenantId: string });
  if (snapshot.kind === "asset_version") return AssetVersionReference.fromJSON(snapshot.reference as { assetId: string; versionId: string; tenantId: string });
  if (snapshot.kind === "knowledge") return KnowledgeReference.fromJSON(snapshot.reference as { id: string; tenantId: string });
  if (snapshot.kind === "policy") return PolicyReference.fromJSON(snapshot.reference as { id: string; tenantId: string });
  throw new ValidationError("ReviewScope target kind is unsupported");
}

function targetKey(target: ReviewScopeTarget): string {
  const serialized = serializeTarget(target);
  const reference = serialized.reference;
  if (serialized.kind === "asset_version") return `${serialized.kind}:${String(reference.assetId)}:${String(reference.versionId)}`;
  return `${serialized.kind}:${String(reference.id)}`;
}

export class ReviewScope extends ValueObject<JsonObject> {
  public readonly tenantId: TenantId;
  public readonly targets: readonly ReviewScopeTarget[];

  public constructor(tenantId: TenantId, targets: readonly ReviewScopeTarget[]) {
    if (targets.length === 0) throw new ValidationError("ReviewScope requires at least one reference");
    for (const target of targets) {
      if (!target.tenantId.equals(tenantId)) throw new ValidationError("ReviewScope reference crossed a Tenant boundary");
    }
    const ordered = [...targets].sort((left, right) => targetKey(left).localeCompare(targetKey(right)));
    if (new Set(ordered.map(targetKey)).size !== ordered.length) throw new ValidationError("ReviewScope references must be unique");
    super({ tenantId: tenantId.toString(), targets: ordered.map(serializeTarget) as unknown as JsonValue });
    this.tenantId = tenantId;
    this.targets = Object.freeze(ordered);
    Object.freeze(this);
  }

  public static fromJSON(value: JsonObject): ReviewScope {
    const targets = (value.targets as unknown as readonly ReviewScopeTargetSnapshot[]).map(deserializeTarget);
    return new ReviewScope(TenantId.from(String(value.tenantId)), targets);
  }
}
