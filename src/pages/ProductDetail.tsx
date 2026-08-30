import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAgencyProductByRouteSegment,
} from "../content/products/index.js";
import { ProductDetailPage } from "../components/products/ProductDetailPage.js";
import { Unavailable } from "./Unavailable.js";

export function ProductDetail() {
  const params = useParams<{ serviceSlug: string }>();
  const product = params.serviceSlug
    ? getAgencyProductByRouteSegment(params.serviceSlug)
    : undefined;

  useEffect(() => {
    document.title = product?.seo.title ?? "Unavailable | BBA Agency";
    return () => {
      document.title = "BBA Agency";
    };
  }, [product]);

  if (!product) {
    return <Unavailable />;
  }

  return <ProductDetailPage product={product} />;
}
