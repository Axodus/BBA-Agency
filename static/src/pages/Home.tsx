import { useNavigate } from "react-router-dom";
import { ProcessArtwork } from "../../app/components/ProcessArtwork.js";

const services = [
  { category: "Publication Strategy", name: "BBA Publisher", outcome: "Turn one editorial context into a coherent multichannel publication package.", deliverables: "Editorial core · Blog · LinkedIn · Instagram", status: "Available", time: "4–7 days" },
  { category: "Advertising", name: "Advertising Campaign", outcome: "Turn a market brief into a structured campaign with strategy, concepts, messaging, and channel guidance.", deliverables: "Positioning · Concepts · Copy · Channel plan", status: "Beta", time: "5–8 days" },
  { category: "Scientific Writing", name: "Scientific Article", outcome: "Turn a question, references, and evidence into a structured, reviewable scientific article.", deliverables: "Evidence map · Structure · Article · References", status: "Preview", time: "7–12 days" },
  { category: "Governance", name: "Governance Proposal", outcome: "Turn an institutional problem and its evidence into a proposal ready for deliberation.", deliverables: "Diagnosis · Alternatives · Proposal · Risk analysis", status: "Beta", time: "6–10 days" },
  { category: "Research", name: "Market Research", outcome: "Turn a business question into structured evidence, patterns, insights, and recommendations.", deliverables: "Research plan · Evidence · Insights · Report", status: "Available", time: "5–9 days" },
];

export function Home() {
  const navigate = useNavigate();
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span>Agency intelligence</span><span>Human directed</span></p>
          <h1>An intelligence team for communication, research, and strategy.</h1>
          <p className="lede">Choose the outcome you need. BBA Agency coordinates specialized AI agents, keeps you in control, and delivers work ready to use.</p>
          <div className="hero-actions">
            <button className="arrow-link" onClick={() => { void navigate("/projects/new"); }}>Start a project <span>→</span></button>
            <button className="under-button" onClick={() => { void navigate("/services"); }}>Explore services</button>
          </div>
        </div>
        <ProcessArtwork />
      </section>
      <section className="service-strip" aria-label="Service categories">
        {services.map(s => (
          <button className="service-index" key={s.n} onClick={() => { void navigate("/services"); }}>
            <span>{s.n}</span><strong>{s.category}</strong><i>→</i>
          </button>
        ))}
      </section>
      <section className="editorial-section dark-section">
        <div><p className="section-kicker">A different operating model</p><h2>You choose the result.<br />The Agency organizes the work.</h2></div>
        <div className="method-list">
          {["Choose a service", "Provide your context", "Follow the team", "Review key decisions", "Receive the final package"].map((x, i) => (
            <div key={x}><span>0{i + 1}</span><p>{x}</p></div>
          ))}
        </div>
      </section>
      <section className="editorial-section" id="outcomes">
        <div><p className="section-kicker">Ready-to-use outcomes</p><h2>Five disciplines.<br />One accountable team.</h2></div>
        <div className="outcome-grid">
          {services.map(s => (
            <article key={s.name}>
              <span>{s.n} / {s.category}</span>
              <h3>{s.name}</h3>
              <p>{s.outcome}</p>
              <button onClick={() => { void navigate("/services/publisher"); }}>View service →</button>
            </article>
          ))}
        </div>
      </section>
      <section className="human-control">
        <div className="control-mark"><span>AI</span><i>+</i><span>H</span></div>
        <div>
          <p className="section-kicker">Human control</p>
          <h2>Nothing important moves forward without you.</h2>
          <p>You approve the strategy, review the work, understand the impact of changes, and decide when the result is ready.</p>
        </div>
      </section>
    </main>
  );
}
