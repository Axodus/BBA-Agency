"use client";

import { useState } from "react";
import { ProcessArtwork } from "./components/ProcessArtwork";

type View = "home" | "services" | "service" | "dashboard" | "new" | "project" | "deliveries" | "models";

const services = [
  { n:"01", category:"Publication Strategy", name:"BBA Publisher", outcome:"Turn one editorial context into a coherent multichannel publication package.", deliverables:"Editorial core · Blog · LinkedIn · Instagram", status:"Available", time:"4–7 days" },
  { n:"02", category:"Advertising", name:"Advertising Campaign", outcome:"Turn a market brief into a structured campaign with strategy, concepts, messaging, and channel guidance.", deliverables:"Positioning · Concepts · Copy · Channel plan", status:"Beta", time:"5–8 days" },
  { n:"03", category:"Scientific Writing", name:"Scientific Article", outcome:"Turn a question, references, and evidence into a structured, reviewable scientific article.", deliverables:"Evidence map · Structure · Article · References", status:"Preview", time:"7–12 days" },
  { n:"04", category:"Governance", name:"Governance Proposal", outcome:"Turn an institutional problem and its evidence into a proposal ready for deliberation.", deliverables:"Diagnosis · Alternatives · Proposal · Risk analysis", status:"Beta", time:"6–10 days" },
  { n:"05", category:"Research", name:"Market Research", outcome:"Turn a business question into structured evidence, patterns, insights, and recommendations.", deliverables:"Research plan · Evidence · Insights · Report", status:"Available", time:"5–9 days" },
];

const projects = [
  { name:"Neurons protocol launch", service:"BBA Publisher", stage:"Content review", status:"Your decision", progress:72, update:"12 min ago" },
  { name:"Institutional awareness campaign", service:"Advertising Campaign", stage:"Creative production", status:"Team working", progress:48, update:"38 min ago" },
  { name:"Distributed cognition paper", service:"Scientific Article", stage:"Evidence collection", status:"Needs material", progress:26, update:"Yesterday" },
  { name:"Research governance proposal", service:"Governance Proposal", stage:"Proposal review", status:"Your decision", progress:81, update:"Yesterday" },
];

function AppHeader({view,setView}:{view:View,setView:(v:View)=>void}) {
  return <header className={`app-header ${view==="home"?"public":""}`}>
    <button className="wordmark button-reset" onClick={()=>setView("home")}>BBA Agency</button>
    <nav aria-label="Primary navigation">
      <button className={view==="services"?"active":""} onClick={()=>setView("services")}>Services</button>
      <button className={view==="dashboard"||view==="project"?"active":""} onClick={()=>setView("dashboard")}>Projects</button>
      <button className={view==="deliveries"?"active":""} onClick={()=>setView("deliveries")}>Deliveries</button>
      <button className={view==="models"?"active":""} onClick={()=>setView("models")}>AI Models</button>
    </nav>
    <div className="header-actions">
      {view==="home" && <button className="text-button" onClick={()=>setView("dashboard")}>Sign in</button>}
      <button className="button primary" onClick={()=>setView("new")}>Start a project</button>
    </div>
  </header>;
}

function Home({go}:{go:(v:View)=>void}) {
  return <main>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span>Agency intelligence</span><span>Human directed</span></p>
        <h1>An intelligence team for communication, research, and strategy.</h1>
        <p className="lede">Choose the outcome you need. BBA Agency coordinates specialized AI agents, keeps you in control, and delivers work ready to use.</p>
        <div className="hero-actions"><button className="arrow-link" onClick={()=>go("new")}>Start a project <span>→</span></button><button className="under-button" onClick={()=>go("services")}>Explore services</button></div>
      </div>
      <ProcessArtwork/>
    </section>
    <section className="service-strip" aria-label="Service categories">
      {services.map(s=><button className="service-index" key={s.n} onClick={()=>go("service")}><span>{s.n}</span><strong>{s.category}</strong><i>→</i></button>)}
    </section>
    <section className="editorial-section dark-section">
      <div><p className="section-kicker">A different operating model</p><h2>You choose the result.<br/>The Agency organizes the work.</h2></div>
      <div className="method-list">
        {["Choose a service","Provide your context","Follow the team","Review key decisions","Receive the final package"].map((x,i)=><div key={x}><span>0{i+1}</span><p>{x}</p></div>)}
      </div>
    </section>
    <section className="editorial-section" id="outcomes">
      <div><p className="section-kicker">Ready-to-use outcomes</p><h2>Five disciplines.<br/>One accountable team.</h2></div>
      <div className="outcome-grid">{services.map(s=><article key={s.name}><span>{s.n} / {s.category}</span><h3>{s.name}</h3><p>{s.outcome}</p><button onClick={()=>go("service")}>View service →</button></article>)}</div>
    </section>
    <section className="human-control">
      <div className="control-mark"><span>AI</span><i>+</i><span>H</span></div>
      <div><p className="section-kicker">Human control</p><h2>Nothing important moves forward without you.</h2><p>You approve the strategy, review the work, understand the impact of changes, and decide when the result is ready.</p></div>
    </section>
    <footer><span className="wordmark">BBA Agency</span><p>Communication, research, and institutional production—coordinated by AI, accountable to people.</p><button onClick={()=>go("new")}>What do you need to produce? →</button></footer>
  </main>;
}

function Services({go}:{go:(v:View)=>void}) {
  return <main className="page-shell">
    <div className="page-intro"><p className="section-kicker">Agency services / 05 disciplines</p><h1>What outcome do you need?</h1><p>Find a service by the problem you want to solve—not by the technology behind it.</p></div>
    <div className="filter-row">{["All services","Publication","Campaigns","Research","Institutional","Technical content"].map((f,i)=><button className={i===0?"selected":""} key={f}>{f}</button>)}</div>
    <section className="catalog">{services.map(s=><article className="catalog-card" key={s.name}>
      <div className="card-top"><span>{s.n}</span><em className={`status ${s.status.toLowerCase()}`}>{s.status}</em></div>
      <p className="category">{s.category}</p><h2>{s.name}</h2><p className="outcome">{s.outcome}</p>
      <div className="deliverables"><small>Package includes</small><p>{s.deliverables}</p></div>
      <div className="card-meta"><span>{s.time}</span><span>Human review required</span></div>
      <button onClick={()=>go("service")}>Explore service <span>→</span></button>
    </article>)}</section>
  </main>;
}

function ServiceDetail({go}:{go:(v:View)=>void}) {
  return <main className="page-shell product-page">
    <button className="back-link" onClick={()=>go("services")}>← All services</button>
    <div className="product-hero">
      <div><p className="section-kicker">Publication strategy / Available</p><h1>BBA Publisher</h1><p className="product-outcome">Turn one editorial context into a coherent multichannel publication package.</p><button className="button primary big" onClick={()=>go("new")}>Create this project</button></div>
      <div className="package-preview"><span>Final package</span><strong>Editorial<br/>Package</strong><small>Strategy · Blog · LinkedIn · Instagram</small><i>Ready for review and export</i></div>
    </div>
    <div className="product-facts">{[["You provide","Editorial context, source materials, audience, goals, and constraints."],["The team produces","An editorial core, channel strategy, adapted content, and consistency report."],["You participate","Confirm the outcome, approve the editorial core, review content, release the package."],["Estimated execution","4–7 days · 5 checkpoints · technical consumption shown before confirmation."]].map(x=><article key={x[0]}><span>{x[0]}</span><p>{x[1]}</p></article>)}</div>
    <section className="pipeline-section"><p className="section-kicker">How the work happens</p><h2>A coordinated team, not a collection of chatbots.</h2><div className="pipeline">{["Understand context","Build editorial core","Plan channels","Produce content","Review consistency","Prepare delivery"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong><p>{i===1||i===4?"Human checkpoint":"Agency team"}</p></div>)}</div></section>
  </main>;
}

function Dashboard({go}:{go:(v:View)=>void}) {
  return <main className="workspace-shell">
    <div className="dashboard-top"><div><p className="section-kicker">Wednesday / 29 July</p><h1>How can we help today?</h1></div><button className="button primary big" onClick={()=>go("new")}>+ New project</button></div>
    <section className="decision-band"><div><span className="decision-count">02</span><div><p className="section-kicker">Awaiting your decision</p><h2>The team needs your review to continue.</h2></div></div><button onClick={()=>go("project")}>Review decisions →</button></section>
    <div className="workspace-grid">
      <section><div className="section-head"><h2>Projects in progress</h2><button>View all</button></div>
        <div className="project-list">{projects.map((p,i)=><button className="project-row" key={p.name} onClick={()=>go("project")}><div><span className="project-no">0{i+1}</span><strong>{p.name}</strong><small>{p.service}</small></div><div><small>Current stage</small><span>{p.stage}</span></div><div><em>{p.status}</em><span className="mini-progress"><i style={{width:`${p.progress}%`}}/></span></div><time>{p.update}</time><b>→</b></button>)}</div>
      </section>
      <aside className="activity-panel"><div className="section-head"><h2>Team activity</h2></div>{["Editorial core prepared for review","Campaign audience refined","6 new sources added to evidence map","Risk analysis completed"].map((a,i)=><div className="activity" key={a}><span>{i+1}</span><p>{a}<small>{i*18+8} min ago</small></p></div>)}</aside>
    </div>
    <section className="recent-deliveries"><div className="section-head"><h2>Recent deliveries</h2><button onClick={()=>go("deliveries")}>Open library →</button></div><div className="package-row"><div><span>Research package / v1.0</span><h3>AI infrastructure market landscape</h3></div><em>Approved</em><span>18 files</span><button>Open package →</button></div></section>
  </main>;
}

function NewProject({go}:{go:(v:View)=>void}) {
  const [step,setStep]=useState(1); const [chosen,setChosen]=useState("BBA Publisher");
  const next=()=>setStep(Math.min(4,step+1));
  return <main className="wizard-shell">
    <div className="wizard-head"><button className="back-link" onClick={()=>go("dashboard")}>× Close</button><p>New project</p><span>Step {step} of 4</span></div>
    <div className="stepper">{["Service","Objective","Context","Confirm"].map((x,i)=><div className={step>=i+1?"done":""} key={x}><span>0{i+1}</span><i/><p>{x}</p></div>)}</div>
    {step===1&&<section className="wizard-content"><p className="section-kicker">Choose the outcome</p><h1>What do you need to produce?</h1><div className="choice-grid">{services.map(s=><button className={chosen===s.name?"chosen":""} onClick={()=>setChosen(s.name)} key={s.name}><span>{s.n}</span><strong>{s.name}</strong><p>{s.outcome}</p><i>{chosen===s.name?"Selected":"Select"}</i></button>)}</div></section>}
    {step===2&&<section className="wizard-content narrow"><p className="section-kicker">Define the objective</p><h1>What should this project achieve?</h1><label>Project name<input defaultValue="Neurons protocol launch"/></label><label>Primary objective<textarea defaultValue="Build a clear editorial narrative for the public launch of the Neurons protocol, adapted for our owned channels."/></label><div className="form-pair"><label>Primary audience<input defaultValue="Researchers, builders, and ecosystem partners"/></label><label>Desired delivery<select defaultValue="7"><option value="7">Within 7 days</option><option>Within 14 days</option></select></label></div></section>}
    {step===3&&<section className="wizard-content narrow"><p className="section-kicker">Context and materials</p><h1>Give the team what it needs to understand the work.</h1><label>Editorial context<textarea defaultValue="Neurons is the coordination and utility layer of the Axodus ecosystem. The launch should feel scientific, credible, and accessible without simplifying the underlying ideas."/></label><div className="upload-box"><strong>Reference materials</strong><p>Drop files or add links to research, brand documents, and source material.</p><button>+ Add materials</button></div><label className="check"><input type="checkbox" defaultChecked/> The Agency may use these materials only for this project.</label></section>}
    {step===4&&<section className="wizard-content confirm-content"><p className="section-kicker">Outcome confirmation</p><h1>Review the engagement before the team begins.</h1><div className="confirmation-grid">{[["You provide","Editorial context · Source materials · Audience · Constraints"],["You receive","Editorial core · Channel strategy · Blog · LinkedIn · Instagram · Consistency report"],["Agency team","Context Analyst · Strategist · Producer · Editor · Quality Reviewer"],["Human checkpoints","Outcome confirmation · Editorial core approval · Content review · Final release"],["Estimated execution","4–7 days · 18–26 technical execution units"],["Execution mode","Work begins after confirmation. No external publication is automatic."]].map(x=><article key={x[0]}><span>{x[0]}</span><p>{x[1]}</p></article>)}</div></section>}
    <div className="wizard-footer"><button disabled={step===1} onClick={()=>setStep(step-1)}>Back</button><p>Your progress is saved on this device.</p>{step<4?<button className="button primary" onClick={next}>Continue →</button>:<button className="button primary" onClick={()=>go("project")}>Confirm and create project →</button>}</div>
  </main>;
}

function Project({go}:{go:(v:View)=>void}) {
  const [tab,setTab]=useState("Overview"); const [approved,setApproved]=useState(false); const [technical,setTechnical]=useState(false);
  return <main className="project-shell">
    <div className="project-breadcrumb"><button onClick={()=>go("dashboard")}>Projects</button><span>/</span><span>Neurons protocol launch</span></div>
    <section className="project-header"><div><p className="section-kicker">BBA Publisher / Editorial package</p><h1>Neurons protocol launch</h1><p>Build a coherent public narrative for the Neurons protocol across owned channels.</p></div><div className="project-actions"><em className={approved?"approved":"waiting"}>{approved?"Approved":"Awaiting your review"}</em><button className="button" onClick={()=>setTechnical(true)}>Technical details</button><button className="button primary" onClick={()=>setTab("Review")}>Review editorial core</button></div></section>
    <div className="project-meta">{[["Current stage",approved?"Content production":"Editorial core review"],["Team","5 agents · 2 active"],["Last update","12 minutes ago"],["Consumption","14 of 26 units"]].map(x=><div key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong></div>)}</div>
    <nav className="project-tabs">{["Overview","Context","Plan","Work","Deliverables","Review","Delivery"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}</button>)}</nav>
    {tab==="Overview"&&<div className="project-content">
      <section className="project-main"><div className="attention-card"><span>01 / Decision needed</span><h2>Editorial core is ready for your review.</h2><p>The team has synthesized your context into the central narrative that will guide all channel content.</p><button onClick={()=>setTab("Review")}>Review editorial core →</button></div>
      <div className="section-head"><h2>Project progress</h2><span>03 of 06 stages</span></div><div className="timeline">{["Context understood","Editorial strategy","Editorial core review","Channel production","Consistency review","Package delivery"].map((x,i)=><div className={i<2?"complete":i===2?"current":""} key={x}><span>{i<2?"✓":`0${i+1}`}</span><div><strong>{x}</strong><p>{i<2?"Completed":i===2?"Waiting for your approval":"Begins after approval"}</p></div></div>)}</div></section>
      <aside className="team-panel"><div className="section-head"><h2>Project team</h2><span>5 specialists</span></div>{[["CA","Context Analyst","Complete"],["ST","Editorial Strategist","Complete"],["PR","Content Producer","Waiting"],["ED","Editorial Reviewer","Reviewing"],["QA","Quality Reviewer","Waiting"]].map(x=><div className="agent" key={x[1]}><span>{x[0]}</span><p><strong>{x[1]}</strong><small>{x[2]}</small></p><i className={x[2].toLowerCase()}/></div>)}</aside>
    </div>}
    {tab==="Review"&&<Review approved={approved} setApproved={setApproved}/>}
    {["Context","Plan","Work","Deliverables","Delivery"].includes(tab)&&<GenericProjectTab tab={tab} approved={approved}/>}
    {technical&&<div className="drawer-backdrop" onClick={()=>setTechnical(false)}><aside className="technical-drawer" onClick={e=>e.stopPropagation()}><button onClick={()=>setTechnical(false)}>×</button><p className="section-kicker">Optional technical layer</p><h2>Execution details</h2>{[["Project receipt","BBA-PUB-2026-0729"],["Models","GPT-5.6 · Claude Sonnet 4.5"],["Elapsed time","01:42:18"],["Technical consumption","14.2 execution units"],["Evidence references","18 source fragments"],["Lineage status","Complete"]].map(x=><div key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong></div>)}<p className="drawer-note">These details support traceability. They do not organize the main project experience.</p></aside></div>}
  </main>;
}

function Review({approved,setApproved}:{approved:boolean,setApproved:(x:boolean)=>void}) {
  const [version,setVersion]=useState("v2");
  return <div className="review-layout"><section><div className="review-toolbar"><div><p className="section-kicker">Editorial core</p><h2>“Intelligence becomes infrastructure when it can coordinate.”</h2></div><div><button className={version==="v1"?"active":""} onClick={()=>setVersion("v1")}>v1</button><button className={version==="v2"?"active":""} onClick={()=>setVersion("v2")}>v2 current</button></div></div>
    <article className="document"><header><span>BBA Agency / Editorial Core</span><span>{version} · 29 July 2026</span></header><h3>Neurons Protocol</h3><h4>A coordination layer for distributed intelligence.</h4><p>The Neurons protocol frames intelligence not as a feature contained within a product, but as a networked capability that can be coordinated, evaluated, and directed toward shared outcomes.</p><p>Its role within Axodus is to connect specialized capabilities with real institutional and economic contexts—while preserving traceability, human control, and the integrity of each contribution.</p><blockquote>Core proposition: Neurons turns distributed cognitive capacity into accountable, composable work.</blockquote><p>This narrative will anchor every channel adaptation. Scientific language remains precise; public language makes the coordination model tangible without reducing it to automation.</p></article></section>
    <aside className="review-panel"><p className="section-kicker">Your decision</p><h2>{approved?"Editorial core approved":"The team is waiting."}</h2><p>{approved?"Content production can now continue from this approved foundation.":"Approval unlocks channel production. A revision will return the Strategist and Reviewer to work."}</p><div className="finding"><span>Quality review</span><strong>No critical inconsistencies found</strong><p>Audience, tone, claims, and source material remain aligned.</p></div><label>Guidance for the team<textarea placeholder="Add optional context or revision guidance…"/></label><button className="button primary wide" onClick={()=>setApproved(true)}>{approved?"Approval recorded ✓":"Approve editorial core"}</button><button className="button wide" onClick={()=>setApproved(false)}>Request changes</button><small>Requesting changes is estimated to add 2–4 execution units and creates v3.</small></aside>
  </div>;
}

function GenericProjectTab({tab,approved}:{tab:string,approved:boolean}) {
  const content:Record<string,[string,string,string[]]>={
    Context:["Editorial context","The shared foundation for the Agency team.",["Primary audience: researchers, builders, and ecosystem partners","Tone: scientific, credible, accessible","Constraint: avoid financial or speculative token language"]],
    Plan:["Execution plan","Six coordinated stages with two human checkpoints.",["Context synthesis complete","Editorial core approval in progress","Channel production begins after approval"]],
    Work:["Team work","See what is happening without entering a technical console.",["Strategist structured the narrative","Reviewer validated claims and tone",approved?"Producer is adapting channel content":"Producer is waiting for approval"]],
    Deliverables:["Editorial package","Every output stays connected to the approved core.",["Editorial Core · v2","Publication Strategy · Draft","Blog, LinkedIn, Instagram · Waiting"]],
    Delivery:["Final delivery","The package will appear here when every required approval is recorded.",[approved?"Production is now in progress":"Editorial core approval is required","No external publishing happens automatically","Exports: DOCX · Markdown · PDF · ZIP"]]
  }; const c=content[tab];
  return <section className="generic-tab"><p className="section-kicker">Project / {tab}</p><h2>{c[0]}</h2><p>{c[1]}</p><div>{c[2].map((x,i)=><article key={x}><span>0{i+1}</span><strong>{x}</strong><i>{i===0?"Current":"Recorded"}</i></article>)}</div></section>;
}

function Deliveries({go}:{go:(v:View)=>void}) {
  return <main className="page-shell"><div className="page-intro split"><div><p className="section-kicker">Delivery library / 12 packages</p><h1>Work ready to use.</h1></div><p>Find completed outcomes independently from their original projects. Every package includes its versions, approvals, evidence, and exports.</p></div>
    <div className="filter-row"><button className="selected">All packages</button><button>Publication</button><button>Research</button><button>Institutional</button></div>
    <div className="delivery-library">{[["Research Package","AI infrastructure market landscape","Market Research","v1.0 · Approved","18 files"],["Editorial Package","Protocol architecture explainer","BBA Publisher","v2.1 · Approved","9 files"],["Institutional Package","Open research governance framework","Governance Proposal","v1.2 · Approved","12 files"]].map((x,i)=><article key={x[1]}><div className="package-icon">0{i+1}<span>ZIP</span></div><div><p>{x[0]}</p><h2>{x[1]}</h2><span>{x[2]}</span></div><em>{x[3]}</em><span>{x[4]}</span><button onClick={()=>go("project")}>Open package →</button></article>)}</div>
  </main>;
}

function Models() {
  const [own,setOwn]=useState(false);
  return <main className="page-shell"><div className="page-intro split"><div><p className="section-kicker">Service configuration</p><h1>AI models & privacy</h1></div><p>Choose how the Agency executes your work. Model configuration stays optional and never replaces the service experience.</p></div>
    <section className="settings-grid"><article className="setting-card"><div><span>01 / Recommended</span><em>Active</em></div><h2>BBA managed models</h2><p>The Agency chooses appropriate models by role, quality requirement, and task. Credentials and routing are managed for you.</p><ul><li>Model selection by specialist role</li><li>Isolated project context</li><li>Consumption shown before execution</li></ul><button className="button primary">Current configuration</button></article>
    <article className="setting-card"><div><span>02 / Advanced</span><em>{own?"Configured":"Optional"}</em></div><h2>Use your own credentials</h2><p>Connect a supported provider credential. Your key is encrypted, scoped to your projects, and can be revoked at any time.</p><ul><li>OpenAI · Anthropic · Google</li><li>Explicit consent and expiration</li><li>No prompt or endpoint playground</li></ul><button className="button" onClick={()=>setOwn(!own)}>{own?"Remove configuration":"Configure provider"}</button></article></section>
    <section className="privacy-note"><span>Privacy note</span><h2>Your project context is work material, not a product.</h2><p>Credentials, materials, and outputs remain scoped to the execution mode you confirm. Model details and technical receipts are available as a secondary traceability layer.</p></section>
  </main>;
}

export default function Page() {
  const [view,setView]=useState<View>("home");
  return <div className={view==="home"?"public-experience":"authenticated-experience"}>
    <AppHeader view={view} setView={setView}/>
    {view==="home"&&<Home go={setView}/>}
    {view==="services"&&<Services go={setView}/>}
    {view==="service"&&<ServiceDetail go={setView}/>}
    {view==="dashboard"&&<Dashboard go={setView}/>}
    {view==="new"&&<NewProject go={setView}/>}
    {view==="project"&&<Project go={setView}/>}
    {view==="deliveries"&&<Deliveries go={setView}/>}
    {view==="models"&&<Models/>}
  </div>;
}
