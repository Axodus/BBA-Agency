import { ReviewRequestId } from "../identity/ReviewRequestId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ReviewRequestReference extends TenantReference<ReviewRequestId> {
  public constructor(requestId: ReviewRequestId, tenantId: TenantId) { super(requestId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ReviewRequestReference {
    return new ReviewRequestReference(ReviewRequestId.from(value.id), TenantId.from(value.tenantId));
  }
}
