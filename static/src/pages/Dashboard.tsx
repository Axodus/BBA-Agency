import { useNavigate } from "react-router-dom";

const projects = [
  { name: "Neurons protocol launch", service: "BBA Publisher", stage: "Content review", status: "Your decision", progress: 72, update: "12 min ago" },
  { name: "Institutional awareness campaign", service: "Advertising Campaign", stage: "Creative production", status: "Team working", progress: 48, update: "38 min ago" },
  { name: "Distributed cognition paper", service: "Scientific Article", stage: "Evidence collection", status: "Needs material", progress: 26, update: "Yesterday" },
  { name: "Research governance proposal", service: "Governance Proposal", stage: "Proposal review", status: "Your decision", progress: 81, update: "Yesterday" },
];

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <main className="workspace-shell">
      <div className="dashboard-top">
        <div>
          <p className="section-kicker">Wednesday / 29 July</p>
          <h1>How can we help today?</h1>
        </div>
        <button className="button primary big" onClick={() => { void navigate("/projects/new"); }}>+ New project</button>
      </div>
      <section className="decision-band">
        <div>
          <span className="decision-count">02</span>
          <div>
            <p className="section-kicker">Awaiting your decision</p>
            <h2>The team needs your review to continue.</h2>
          </div>
        </div>
        <button onClick={() => { void navigate("/projects/neurons-protocol-launch"); }}>Review decisions →</button>
      </section>
      <div className="workspace-grid">
        <section>
          <div className="section-head"><h2>Projects in progress</h2><button>View all</button></div>
          <div className="project-list">
            {projects.map((p, i) => (
              <button
                className="project-row"
                key={p.name}
                onClick={() => { void navigate("/projects/neurons-protocol-launch"); }}
              >
                <div>
                  <span className="project-no">0{i + 1}</span>
                  <strong>{p.name}</strong>
                  <small>{p.service}</small>
                </div>
                <div><small>Current stage</small><span>{p.stage}</span></div>
                <div>
                  <em>{p.status}</em>
                  <span className="mini-progress"><i style={{ width: `${p.progress}%` }} /></span>
                </div>
                <time>{p.update}</time>
                <b>→</b>
              </button>
            ))}
          </div>
        </section>
        <aside className="activity-panel">
          <div className="section-head"><h2>Team activity</h2></div>
          {["Editorial core prepared for review", "Campaign audience refined", "6 new sources added to evidence map", "Risk analysis completed"].map((a, i) => (
            <div className="activity" key={a}>
              <span>{i + 1}</span>
              <p>{a}<small>{i * 18 + 8} min ago</small></p>
            </div>
          ))}
        </aside>
      </div>
      <section className="recent-deliveries">
        <div className="section-head">
          <h2>Recent deliveries</h2>
          <button onClick={() => { void navigate("/deliveries"); }}>Open library →</button>
        </div>
        <div className="package-row">
          <div><span>Research package / v1.0</span><h3>AI infrastructure market landscape</h3></div>
          <em>Approved</em>
          <span>18 files</span>
          <button>Open package →</button>
        </div>
      </section>
    </main>
  );
}
