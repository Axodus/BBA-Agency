import { ReviewId } from "../identity/ReviewId.js";
import { TenantId } from "../identity/TenantId.js";
import { TenantReference } from "./TenantReference.js";

export class ReviewReference extends TenantReference<ReviewId> {
  public constructor(reviewId: ReviewId, tenantId: TenantId) { super(reviewId, tenantId); }
  public static fromJSON(value: { readonly id: string; readonly tenantId: string }): ReviewReference {
    return new ReviewReference(ReviewId.from(value.id), TenantId.from(value.tenantId));
  }
}
