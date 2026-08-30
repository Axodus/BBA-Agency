import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { DeliveryPackagePage } from "../components/deliveries/DeliveryPackagePage.js";
import { getAgencyDeliveryPackageByRouteSegment } from "../content/deliveries/index.js";
import { Unavailable } from "./Unavailable.js";

export function DeliveryDetail() {
  const { deliverySlug } = useParams<{ deliverySlug: string }>();
  const deliveryPackage = deliverySlug ? getAgencyDeliveryPackageByRouteSegment(deliverySlug) : undefined;
  useEffect(() => { document.title = deliveryPackage?.seo.title ?? "Unavailable | BBA Agency"; return () => { document.title = "BBA Agency"; }; }, [deliveryPackage]);
  return deliveryPackage ? <DeliveryPackagePage deliveryPackage={deliveryPackage} /> : <Unavailable />;
}
