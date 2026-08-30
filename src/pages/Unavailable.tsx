import { Link, useLocation, useSearchParams } from "react-router-dom";

export function Unavailable() {
  const location = useLocation();
  const [params] = useSearchParams();
  const destination = params.get("destination");
  const label = destination !== null && destination.length > 0
    ? destination.charAt(0).toUpperCase() + destination.slice(1)
    : "this page";
  const isProjectDestination = location.pathname.startsWith("/projects");
  const isDeliveryDestination = location.pathname.startsWith("/deliveries");
  const returnPath = isProjectDestination ? "/projects" : isDeliveryDestination ? "/deliveries" : "/services";
  const returnLabel = isProjectDestination ? "Return to Project examples" : isDeliveryDestination ? "Return to Delivery Packages" : "Explore services";

  return (
    <main className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Not yet available</p>
        <h1>{label}</h1>
        <p>
          This destination is not yet available in the current reference implementation.
          The approved BBA Agency experience continues to expand.
        </p>
        <div className="hero-actions">
          <Link className="arrow-link" to="/">Return to Home <span aria-hidden="true">→</span></Link>
          <Link className="under-button" to={returnPath}>{returnLabel}</Link>
        </div>
      </div>
    </main>
  );
}
