import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Review({ approved, setApproved }: { readonly approved: boolean; readonly setApproved: (x: boolean) => void }) {
  const [version, setVersion] = useState("v2");
  return (
    <div className="review-layout">
      <section>
        <div className="review-toolbar">
          <div>
            <p className="section-kicker">Editorial core</p>
            <h2>"Intelligence becomes infrastructure when it can coordinate."</h2>
          </div>
          <div>
            <button className={version === "v1" ? "active" : ""} onClick={() => { setVersion("v1"); }}>v1</button>
            <button className={version === "v2" ? "active" : ""} onClick={() => { setVersion("v2"); }}>v2 current</button>
          </div>
        </div>
        <article className="document">
          <header><span>BBA Agency / Editorial Core</span><span>{version} · 29 July 2026</span></header>
          <h3>Neurons Protocol</h3>
          <h4>A coordination layer for distributed intelligence.</h4>
          <p>The Neurons protocol frames intelligence not as a feature contained within a product, but as a networked capability that can be coordinated, evaluated, and directed toward shared outcomes.</p>
          <p>Its role within Axodus is to connect specialized capabilities with real institutional and economic contexts—while preserving traceability, human control, and the integrity of each contribution.</p>
          <blockquote>Core proposition: Neurons turns distributed cognitive capacity into accountable, composable work.</blockquote>
          <p>This narrative will anchor every channel adaptation. Scientific language remains precise; public language makes the coordination model tangible without reducing it to automation.</p>
        </article>
      </section>
      <aside className="review-panel">
        <p className="section-kicker">Your decision</p>
        <h2>{approved ? "Editorial core approved" : "The team is waiting."}</h2>
        <p>{approved ? "Content production can now continue from this approved foundation." : "Approval unlocks channel production. A revision will return the Strategist and Reviewer to work."}</p>
        <div className="finding">
          <span>Quality review</span>
          <strong>No critical inconsistencies found</strong>
          <p>Audience, tone, claims, and source material remain aligned.</p>
        </div>
        <label>Guidance for the team<textarea placeholder="Add optional context or revision guidance…" /></label>
        <button className="button primary wide" onClick={() => { setApproved(true); }}>{approved ? "Approval recorded ✓" : "Approve editorial core"}</button>
        <button className="button wide" onClick={() => { setApproved(false); }}>Request changes</button>
        <small>Requesting changes is estimated to add 2–4 execution units and creates v3.</small>
      </aside>
    </div>
  );
}

function GenericProjectTab({ tab, approved }: { readonly tab: string; readonly approved: boolean }) {
  const content: Record<string, [string, string, string[]]> = {
    Context: ["Editorial context", "The shared foundation for the Agency team.", ["Primary audience: researchers, builders, and ecosystem partners", "Tone: scientific, credible, accessible", "Constraint: avoid financial or speculative token language"]],
    Plan: ["Execution plan", "Six coordinated stages with two human checkpoints.", ["Context synthesis complete", "Editorial core approval in progress", "Channel production begins after approval"]],
    Work: ["Team work", "See what is happening without entering a technical console.", ["Strategist structured the narrative", "Reviewer validated claims and tone", approved ? "Producer is adapting channel content" : "Producer is waiting for approval"]],
    Deliverables: ["Editorial package", "Every output stays connected to the approved core.", ["Editorial Core · v2", "Publication Strategy · Draft", "Blog, LinkedIn, Instagram · Waiting"]],
    Delivery: ["Final delivery", "The package will appear here when every required approval is recorded.", [approved ? "Production is now in progress" : "Editorial core approval is required", "No external publishing happens automatically", "Exports: DOCX · Markdown · PDF · ZIP"]],
  };
  const c = content[tab];
  if (c === undefined) return null;
  return (
    <section className="generic-tab">
      <p className="section-kicker">Project / {tab}</p>
      <h2>{c[0]}</h2>
      <p>{c[1]}</p>
      <div>
        {(c[2] ?? []).map((x, i) => (
          <article key={x}><span>0{i + 1}</span><strong>{x}</strong><i>{i === 0 ? "Current" : "Recorded"}</i></article>
        ))}
      </div>
    </section>
  );
}

export function Project() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState("Overview");
  const [approved, setApproved] = useState(false);
  const [technical, setTechnical] = useState(false);
  const projectTitle = id === "neurons-protocol-launch" ? "Neurons protocol launch" : (id ?? "Project");

  return (
    <main className="project-shell">
      <div className="project-breadcrumb">
        <button onClick={() => { void navigate("/projects"); }}>Projects</button>
        <span>/</span>
        <span>{projectTitle}</span>
      </div>
      <section className="project-header">
        <div>
          <p className="section-kicker">BBA Publisher / Editorial package</p>
          <h1>{projectTitle}</h1>
          <p>Build a coherent public narrative for the Neurons protocol across owned channels.</p>
        </div>
        <div className="project-actions">
          <em className={approved ? "approved" : "waiting"}>{approved ? "Approved" : "Awaiting your review"}</em>
          <button className="button" onClick={() => { setTechnical(true); }}>Technical details</button>
          <button className="button primary" onClick={() => { setTab("Review"); }}>Review editorial core</button>
        </div>
      </section>
      <div className="project-meta">
        {[["Current stage", approved ? "Content production" : "Editorial core review"], ["Team", "5 agents · 2 active"], ["Last update", "12 minutes ago"], ["Consumption", "14 of 26 units"]].map(x => (
          <div key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong></div>
        ))}
      </div>
      <nav className="project-tabs">
        {["Overview", "Context", "Plan", "Work", "Deliverables", "Review", "Delivery"].map(x => (
          <button className={tab === x ? "active" : ""} onClick={() => { setTab(x); }} key={x}>{x}</button>
        ))}
      </nav>
      {tab === "Overview" && (
        <div className="project-content">
          <section className="project-main">
            <div className="attention-card">
              <span>01 / Decision needed</span>
              <h2>Editorial core is ready for your review.</h2>
              <p>The team has synthesized your context into the central narrative that will guide all channel content.</p>
              <button onClick={() => { setTab("Review"); }}>Review editorial core →</button>
            </div>
            <div className="section-head"><h2>Project progress</h2><span>03 of 06 stages</span></div>
            <div className="timeline">
              {["Context understood", "Editorial strategy", "Editorial core review", "Channel production", "Consistency review", "Package delivery"].map((x, i) => (
                <div className={i < 2 ? "complete" : i === 2 ? "current" : ""} key={x}>
                  <span>{i < 2 ? "✓" : `0${i + 1}`}</span>
                  <div>
                    <strong>{x}</strong>
                    <p>{i < 2 ? "Completed" : i === 2 ? "Waiting for your approval" : "Begins after approval"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <aside className="team-panel">
            <div className="section-head"><h2>Project team</h2><span>5 specialists</span></div>
            {[["CA", "Context Analyst", "Complete"], ["ST", "Editorial Strategist", "Complete"], ["PR", "Content Producer", "Waiting"], ["ED", "Editorial Reviewer", "Reviewing"], ["QA", "Quality Reviewer", "Waiting"]].map(x => (
              <div className="agent" key={x[1]}>
                <span>{x[0]}</span>
                <p><strong>{x[1]}</strong><small>{x[2]}</small></p>
                <i className={(x[2] ?? "").toLowerCase()} />
              </div>
            ))}
          </aside>
        </div>
      )}
      {tab === "Review" && <Review approved={approved} setApproved={setApproved} />}
      {["Context", "Plan", "Work", "Deliverables", "Delivery"].includes(tab) && <GenericProjectTab tab={tab} approved={approved} />}
      {technical && (
        <div className="drawer-backdrop" onClick={() => { setTechnical(false); }}>
          <aside className="technical-drawer" onClick={e => { e.stopPropagation(); }}>
            <button onClick={() => { setTechnical(false); }}>×</button>
            <p className="section-kicker">Optional technical layer</p>
            <h2>Execution details</h2>
            {[["Project receipt", "BBA-PUB-2026-0729"], ["Models", "GPT-5.6 · Claude Sonnet 4.5"], ["Elapsed time", "01:42:18"], ["Technical consumption", "14.2 execution units"], ["Evidence references", "18 source fragments"], ["Lineage status", "Complete"]].map(x => (
              <div key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong></div>
            ))}
            <p className="drawer-note">These details support traceability. They do not organize the main project experience.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
