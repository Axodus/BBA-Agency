import { ConcurrencyConflict } from "../../../shared/errors/ConcurrencyConflict.js";
import { InvariantViolation } from "../../../shared/errors/InvariantViolation.js";
import { TenantViolation } from "../../../shared/errors/TenantViolation.js";
import type { ReviewId, TenantId } from "../../../shared/identity/index.js";
import type { Version } from "../../../shared/version/Version.js";
import { Review, type ReviewSnapshot } from "../domain/Review.js";
import type { ReviewRepository } from "../ports/ReviewRepository.js";

export class InMemoryReviewRepository implements ReviewRepository {
  private readonly snapshots = new Map<string, ReviewSnapshot>();

  public async save(review: Review, expectedVersion: Version): Promise<void> {
    const stored = this.snapshots.get(review.id.toString());
    if (stored === undefined) {
      if (expectedVersion.value !== 0) throw new ConcurrencyConflict("Review does not exist at the expected Version");
    } else {
      if (stored.tenantId !== review.tenantId.toString()) throw new TenantViolation("Review cannot cross a Tenant boundary");
      if (stored.version !== expectedVersion.value) throw new ConcurrencyConflict("Review optimistic Version check failed", {
        reviewId: review.id.toString(), expectedVersion: String(expectedVersion.value), actualVersion: String(stored.version)
      });
    }
    if (review.version.value <= expectedVersion.value) throw new InvariantViolation("Review save requires a newer Version");
    this.snapshots.set(review.id.toString(), review.toSnapshot());
  }

  public async findById(tenantId: TenantId, reviewId: ReviewId): Promise<Review | null> {
    const snapshot = this.snapshots.get(reviewId.toString());
    if (snapshot === undefined) return null;
    this.assertTenant(snapshot, tenantId);
    return Review.rehydrate(snapshot);
  }
  public async exists(tenantId: TenantId, reviewId: ReviewId): Promise<boolean> {
    const snapshot = this.snapshots.get(reviewId.toString());
    if (snapshot === undefined) return false;
    this.assertTenant(snapshot, tenantId);
    return true;
  }
  private assertTenant(snapshot: ReviewSnapshot, tenantId: TenantId): void {
    if (snapshot.tenantId !== tenantId.toString()) throw new TenantViolation("Review lookup crossed a Tenant boundary", { reviewId: snapshot.reviewId });
  }
}
