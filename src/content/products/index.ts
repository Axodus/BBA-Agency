import { agencyProducts } from "./generated/product-content.generated.js";

export { agencyProducts };
export type {
  AgencyProductContent,
  MarkdownBlock,
  MarkdownInline,
  ProductAgentRole,
  ProductAvailability,
  ProductContentSection,
  ProductDeliverable,
  ProductFaqItem,
  ProductWorkflowStage,
} from "./product-content.types.js";

export const agencyProductMap = new Map(
  agencyProducts.map((product) => [product.id, product] as const),
);

export const agencyProductRouteMap = new Map(
  agencyProducts.map((product) => [product.routeSegment, product] as const),
);

export function getAgencyProductById(productId: string) {
  return agencyProductMap.get(productId);
}

export function getAgencyProductByRouteSegment(routeSegment: string) {
  return agencyProductRouteMap.get(routeSegment);
}
