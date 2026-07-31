import { useNavigate } from "react-router-dom";

const process = [
  "Understand context",
  "Build editorial core",
  "Plan channels",
  "Produce content",
  "Review consistency",
  "Prepare delivery",
];

export function ServiceDetail() {
  const navigate = useNavigate();
  return (
    <main className="page-shell product-page">
      <button className="back-link" onClick={() => { void navigate("/services"); }}>← All services</button>
      <div className="product-hero">
        <div>
          <p className="section-kicker">Publication strategy / Available</p>
          <h1>BBA Publisher</h1>
          <p className="product-outcome">Turn one editorial context into a coherent multichannel publication package.</p>
          <button className="button primary big" onClick={() => { void navigate("/projects/new"); }}>Create this project</button>
        </div>
        <div className="package-preview">
          <span>Final package</span>
          <strong>Editorial<br />Package</strong>
          <small>Strategy · Blog · LinkedIn · Instagram</small>
          <i>Ready for review and export</i>
        </div>
      </div>
      <div className="product-facts">
        {[
          ["You provide", "Editorial context, source materials, audience, goals, and constraints."],
          ["The team produces", "An editorial core, channel strategy, adapted content, and consistency report."],
          ["You participate", "Confirm the outcome, approve the editorial core, review content, release the package."],
          ["Estimated execution", "4–7 days · 5 checkpoints · technical consumption shown before confirmation."],
        ].map(x => (
          <article key={x[0]}><span>{x[0]}</span><p>{x[1]}</p></article>
        ))}
      </div>
      <section className="pipeline-section">
        <p className="section-kicker">How the work happens</p>
        <h2>A coordinated team, not a collection of chatbots.</h2>
        <div className="pipeline">
          {process.map((x, i) => (
            <div key={x}>
              <span>0{i + 1}</span>
              <strong>{x}</strong>
              <p>{i === 1 || i === 4 ? "Human checkpoint" : "Agency team"}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
