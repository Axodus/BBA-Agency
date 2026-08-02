import { ReviewSessionId } from "../identity/ReviewSessionId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ReviewSessionReference extends TenantReference<ReviewSessionId> {
  public constructor(sessionId: ReviewSessionId, tenantId: TenantId) { super(sessionId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ReviewSessionReference {
    return new ReviewSessionReference(ReviewSessionId.from(value.id), TenantId.from(value.tenantId));
  }
}
