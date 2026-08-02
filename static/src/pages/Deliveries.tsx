import { useNavigate } from "react-router-dom";

export function Deliveries() {
  const navigate = useNavigate();
  return (
    <main className="page-shell">
      <div className="page-intro split container">
        <div>
          <p className="section-kicker">Delivery library / 12 packages</p>
          <h1>Work ready to use.</h1>
        </div>
        <p>Find completed outcomes independently from their original projects. Every package includes its versions, approvals, evidence, and exports.</p>
      </div>
      <div className="filter-row container">
        <button className="selected">All packages</button>
        <button>Publication</button>
        <button>Research</button>
        <button>Institutional</button>
      </div>
      <div className="delivery-library container">
        {[
          ["Research Package", "AI infrastructure market landscape", "Market Research", "v1.0 · Approved", "18 files"],
          ["Editorial Package", "Protocol architecture explainer", "BBA Publisher", "v2.1 · Approved", "9 files"],
          ["Institutional Package", "Open research governance framework", "Governance Proposal", "v1.2 · Approved", "12 files"],
        ].map((x, i) => (
          <article key={x[1]}>
            <div className="package-icon">0{i + 1}<span>ZIP</span></div>
            <div><p>{x[0]}</p><h2>{x[1]}</h2><span>{x[2]}</span></div>
            <em>{x[3]}</em>
            <span>{x[4]}</span>
            <button onClick={() => { void navigate("/projects/neurons-protocol-launch"); }}>Open package →</button>
          </article>
        ))}
      </div>
    </main>
  );
}
