import type { ReviewId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import type { Review } from "../domain/Review.js";

export interface ReviewRepository {
  save(review: Review, expectedVersion: Version): Promise<void>;
  findById(tenantId: TenantId, reviewId: ReviewId): Promise<Review | null>;
  exists(tenantId: TenantId, reviewId: ReviewId): Promise<boolean>;
}
