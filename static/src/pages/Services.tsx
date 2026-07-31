import { useNavigate } from "react-router-dom";

const services = [
  { category: "Publication Strategy", name: "BBA Publisher", outcome: "Turn one editorial context into a coherent multichannel publication package.", deliverables: "Editorial core · Blog · LinkedIn · Instagram", status: "Available", time: "4–7 days" },
  { category: "Advertising", name: "Advertising Campaign", outcome: "Turn a market brief into a structured campaign with strategy, concepts, messaging, and channel guidance.", deliverables: "Positioning · Concepts · Copy · Channel plan", status: "Beta", time: "5–8 days" },
  { category: "Scientific Writing", name: "Scientific Article", outcome: "Turn a question, references, and evidence into a structured, reviewable scientific article.", deliverables: "Evidence map · Structure · Article · References", status: "Preview", time: "7–12 days" },
  { category: "Governance", name: "Governance Proposal", outcome: "Turn an institutional problem and its evidence into a proposal ready for deliberation.", deliverables: "Diagnosis · Alternatives · Proposal · Risk analysis", status: "Beta", time: "6–10 days" },
  { category: "Research", name: "Market Research", outcome: "Turn a business question into structured evidence, patterns, insights, and recommendations.", deliverables: "Research plan · Evidence · Insights · Report", status: "Available", time: "5–9 days" },
];

export function Services() {
  const navigate = useNavigate();
  return (
    <main className="page-shell">
      <div className="page-intro">
        <p className="section-kicker">Agency services / 05 disciplines</p>
        <h1>What outcome do you need?</h1>
        <p>Find a service by the problem you want to solve—not by the technology behind it.</p>
      </div>
      <div className="filter-row">
        {["All services", "Publication", "Campaigns", "Research", "Institutional", "Technical content"].map((f, i) => (
          <button className={i === 0 ? "selected" : ""} key={f}>{f}</button>
        ))}
      </div>
      <section className="catalog">
        {services.map(s => (
          <article className="catalog-card" key={s.name}>
            <div className="card-top"><span>{s.n}</span><em className={`status ${s.status.toLowerCase()}`}>{s.status}</em></div>
            <p className="category">{s.category}</p>
            <h2>{s.name}</h2>
            <p className="outcome">{s.outcome}</p>
            <div className="deliverables"><small>Package includes</small><p>{s.deliverables}</p></div>
            <div className="card-meta"><span>{s.time}</span><span>Human review required</span></div>
            <button onClick={() => { void navigate("/services/publisher"); }}>Explore service <span>→</span></button>
          </article>
        ))}
      </section>
    </main>
  );
}
