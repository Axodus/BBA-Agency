import { useNavigate, useSearchParams } from "react-router-dom";

export function Unavailable() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = params.get("destination");
  const label = destination !== null && destination.length > 0
    ? destination.charAt(0).toUpperCase() + destination.slice(1)
    : "this page";

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
          <button className="arrow-link" onClick={() => { void navigate("/"); }}>
            Return to Home <span>→</span>
          </button>
          <button className="under-button" onClick={() => { void navigate("/services"); }}>
            Explore services
          </button>
        </div>
      </div>
    </main>
  );
}
