import { KnowledgeId } from "../identity/KnowledgeId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class KnowledgeReference extends TenantReference<KnowledgeId> {
  public constructor(knowledgeId: KnowledgeId, tenantId: TenantId) { super(knowledgeId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): KnowledgeReference {
    return new KnowledgeReference(KnowledgeId.from(value.id), TenantId.from(value.tenantId));
  }
}
