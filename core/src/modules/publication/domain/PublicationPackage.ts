import { assertCanonicalTimestamp, deepFreeze, type JsonObject } from "../../../shared/common/index.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { PublicationPackageId, TenantId } from "../../../shared/identity/index.js";
import { AssetReference, AssetVersionReference, KnowledgeReference, PublicationPackageReference } from "../../../shared/references/index.js";
import type { PublicationPackageItemInput } from "./PublicationCommands.js";

export interface PublicationDestinationSnapshot { readonly tenantId: string; readonly key: string; readonly audience: string; readonly purpose: string; }
export class PublicationDestination {
  public readonly tenantId: TenantId;
  public readonly key: string;
  public readonly audience: string;
  public readonly purpose: string;
  public constructor(props: { readonly tenantId: TenantId; readonly key: string; readonly audience: string; readonly purpose: string }) {
    this.tenantId = props.tenantId;
    this.key = props.key.trim();
    this.audience = props.audience.trim();
    this.purpose = props.purpose.trim();
    if (this.key.length === 0 || this.audience.length === 0 || this.purpose.length === 0) throw new ValidationError("PublicationDestination requires key, audience and purpose");
    Object.freeze(this);
  }
  public toSnapshot(): PublicationDestinationSnapshot { return deepFreeze({ tenantId: this.tenantId.toString(), key: this.key, audience: this.audience, purpose: this.purpose }); }
  public static fromSnapshot(value: PublicationDestinationSnapshot): PublicationDestination {
    return new PublicationDestination({ tenantId: TenantId.from(value.tenantId), key: value.key, audience: value.audience, purpose: value.purpose });
  }
}

export interface PublicationPackageItemSnapshot { readonly assetReference: JsonObject; readonly assetVersionReference: JsonObject; }
export class PublicationPackageItem {
  public readonly assetReference: AssetReference;
  public readonly assetVersionReference: AssetVersionReference;
  public constructor(input: PublicationPackageItemInput) {
    if (!input.assetReference.tenantId.equals(input.assetVersionReference.tenantId)) throw new InvariantViolation("PublicationPackageItem cannot cross Tenant boundaries");
    if (!input.assetReference.id.equals(input.assetVersionReference.assetId)) throw new InvariantViolation("PublicationPackageItem must pair an Asset with a version of the same Asset");
    this.assetReference = input.assetReference;
    this.assetVersionReference = input.assetVersionReference;
    Object.freeze(this);
  }
  public toSnapshot(): PublicationPackageItemSnapshot { return deepFreeze({ assetReference: this.assetReference.toJSON(), assetVersionReference: this.assetVersionReference.toJSON() }); }
  public static fromSnapshot(value: PublicationPackageItemSnapshot): PublicationPackageItem {
    return new PublicationPackageItem({
      assetReference: AssetReference.fromJSON(value.assetReference as { id: string; tenantId: string }),
      assetVersionReference: AssetVersionReference.fromJSON(value.assetVersionReference as { assetId: string; versionId: string; tenantId: string })
    });
  }
}

export interface PublicationPackageSnapshot {
  readonly packageId: string;
  readonly tenantId: string;
  readonly items: readonly PublicationPackageItemSnapshot[];
  readonly destinations: readonly PublicationDestinationSnapshot[];
  readonly knowledgeReferences: readonly JsonObject[];
  readonly metadata: JsonObject;
  readonly createdAt: string;
}

export class PublicationPackage {
  public readonly id: PublicationPackageId;
  public readonly tenantId: TenantId;
  public readonly items: readonly PublicationPackageItem[];
  public readonly destinations: readonly PublicationDestination[];
  public readonly knowledgeReferences: readonly KnowledgeReference[];
  public readonly metadata: JsonObject;
  public readonly createdAt: string;

  private constructor(props: { readonly id: PublicationPackageId; readonly tenantId: TenantId; readonly items: readonly PublicationPackageItem[]; readonly destinations: readonly PublicationDestination[]; readonly knowledgeReferences: readonly KnowledgeReference[]; readonly metadata: JsonObject; readonly createdAt: string }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.items = Object.freeze([...props.items]);
    this.destinations = Object.freeze([...props.destinations]);
    this.knowledgeReferences = Object.freeze([...props.knowledgeReferences]);
    this.metadata = deepFreeze(props.metadata);
    this.createdAt = assertCanonicalTimestamp(props.createdAt, "createdAt");
    this.assertState();
    Object.freeze(this);
  }

  public static create(props: { readonly id: PublicationPackageId; readonly tenantId: TenantId; readonly items: readonly PublicationPackageItemInput[]; readonly destinations: readonly PublicationDestination[]; readonly knowledgeReferences?: readonly KnowledgeReference[]; readonly metadata?: JsonObject; readonly createdAt: string }): PublicationPackage {
    return new PublicationPackage({
      id: props.id, tenantId: props.tenantId, items: props.items.map((item) => new PublicationPackageItem(item)),
      destinations: props.destinations, knowledgeReferences: props.knowledgeReferences ?? [],
      metadata: props.metadata ?? {}, createdAt: props.createdAt
    });
  }

  public static fromSnapshot(snapshot: PublicationPackageSnapshot): PublicationPackage {
    return new PublicationPackage({
      id: PublicationPackageId.from(snapshot.packageId), tenantId: TenantId.from(snapshot.tenantId),
      items: snapshot.items.map(PublicationPackageItem.fromSnapshot),
      destinations: snapshot.destinations.map(PublicationDestination.fromSnapshot),
      knowledgeReferences: snapshot.knowledgeReferences.map((item) => KnowledgeReference.fromJSON(item as { id: string; tenantId: string })),
      metadata: snapshot.metadata, createdAt: snapshot.createdAt
    });
  }

  public get reference(): PublicationPackageReference { return new PublicationPackageReference(this.id, this.tenantId); }

  public toSnapshot(): PublicationPackageSnapshot {
    return deepFreeze({
      packageId: this.id.toString(), tenantId: this.tenantId.toString(), items: this.items.map((item) => item.toSnapshot()),
      destinations: this.destinations.map((item) => item.toSnapshot()), knowledgeReferences: this.knowledgeReferences.map((item) => item.toJSON()),
      metadata: this.metadata, createdAt: this.createdAt
    });
  }

  private assertState(): void {
    if (this.items.length === 0 || this.destinations.length === 0) throw new InvariantViolation("PublicationPackage requires at least one item and destination");
    const itemKeys = new Set<string>();
    for (const item of this.items) {
      if (!item.assetReference.tenantId.equals(this.tenantId) || !item.assetVersionReference.tenantId.equals(this.tenantId)) throw new InvariantViolation("PublicationPackage item must belong to the Publication Tenant");
      const key = `${item.assetReference.id.toString()}:${item.assetVersionReference.versionId.toString()}`;
      if (itemKeys.has(key)) throw new InvariantViolation("PublicationPackage cannot contain duplicate items");
      itemKeys.add(key);
    }
    const destinationKeys = new Set<string>();
    for (const destination of this.destinations) {
      if (!destination.tenantId.equals(this.tenantId)) throw new InvariantViolation("PublicationDestination must belong to the Publication Tenant");
      if (destinationKeys.has(destination.key)) throw new InvariantViolation("PublicationPackage cannot contain duplicate destinations");
      destinationKeys.add(destination.key);
    }
    for (const reference of this.knowledgeReferences) if (!reference.tenantId.equals(this.tenantId)) throw new InvariantViolation("PublicationPackage Knowledge references must belong to the Publication Tenant");
  }
}
