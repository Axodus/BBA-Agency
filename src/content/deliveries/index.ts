import { agencyDeliveryPackages } from "./generated/delivery-content.generated.js";

export { agencyDeliveryPackages };
export type { AgencyDeliveryPackageContent, DeliveryApprovalModel, DeliveryArtifact, DeliveryFaqItem, DeliveryPackageStatus, DeliveryQualityGate, DeliveryReviewCheckpoint, DeliveryRevisionPolicy, DeliveryTraceRecord, DeliveryVersionRecord } from "./delivery-content.types.js";

export const agencyDeliveryPackagesById = new Map(agencyDeliveryPackages.map((deliveryPackage) => [deliveryPackage.id, deliveryPackage] as const));
export const agencyDeliveryPackagesBySlug = new Map(agencyDeliveryPackages.map((deliveryPackage) => [deliveryPackage.slug, deliveryPackage] as const));
export function getAgencyDeliveryPackageByRouteSegment(slug: string) { return agencyDeliveryPackagesBySlug.get(slug); }
