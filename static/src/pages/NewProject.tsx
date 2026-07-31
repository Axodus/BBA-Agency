import { useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  { n: "01", name: "BBA Publisher", outcome: "Turn one editorial context into a coherent multichannel publication package." },
  { n: "02", name: "Advertising Campaign", outcome: "Turn a market brief into a structured campaign with strategy, concepts, messaging, and channel guidance." },
  { n: "03", name: "Scientific Article", outcome: "Turn a question, references, and evidence into a structured, reviewable scientific article." },
  { n: "04", name: "Governance Proposal", outcome: "Turn an institutional problem and its evidence into a proposal ready for deliberation." },
  { n: "05", name: "Market Research", outcome: "Turn a business question into structured evidence, patterns, insights, and recommendations." },
];

export function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState("BBA Publisher");
  const next = () => { setStep(Math.min(4, step + 1)); };
  return (
    <main className="wizard-shell">
      <div className="wizard-head">
        <button className="back-link" onClick={() => { void navigate("/projects"); }}>× Close</button>
        <p>New project</p>
        <span>Step {step} of 4</span>
      </div>
      <div className="stepper">
        {["Service", "Objective", "Context", "Confirm"].map((x, i) => (
          <div className={step >= i + 1 ? "done" : ""} key={x}>
            <span>0{i + 1}</span><i /><p>{x}</p>
          </div>
        ))}
      </div>
      {step === 1 && (
        <section className="wizard-content">
          <p className="section-kicker">Choose the outcome</p>
          <h1>What do you need to produce?</h1>
          <div className="choice-grid">
            {services.map(s => (
              <button
                className={chosen === s.name ? "chosen" : ""}
                onClick={() => { setChosen(s.name); }}
                key={s.name}
              >
                <span>{s.n}</span><strong>{s.name}</strong><p>{s.outcome}</p>
                <i>{chosen === s.name ? "Selected" : "Select"}</i>
              </button>
            ))}
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="wizard-content narrow">
          <p className="section-kicker">Define the objective</p>
          <h1>What should this project achieve?</h1>
          <label>Project name<input defaultValue="Neurons protocol launch" /></label>
          <label>Primary objective<textarea defaultValue="Build a clear editorial narrative for the public launch of the Neurons protocol, adapted for our owned channels." /></label>
          <div className="form-pair">
            <label>Primary audience<input defaultValue="Researchers, builders, and ecosystem partners" /></label>
            <label>Desired delivery<select defaultValue="7"><option value="7">Within 7 days</option><option>Within 14 days</option></select></label>
          </div>
        </section>
      )}
      {step === 3 && (
        <section className="wizard-content narrow">
          <p className="section-kicker">Context and materials</p>
          <h1>Give the team what it needs to understand the work.</h1>
          <label>Editorial context<textarea defaultValue="Neurons is the coordination and utility layer of the Axodus ecosystem. The launch should feel scientific, credible, and accessible without simplifying the underlying ideas." /></label>
          <div className="upload-box">
            <strong>Reference materials</strong>
            <p>Drop files or add links to research, brand documents, and source material.</p>
            <button>+ Add materials</button>
          </div>
          <label className="check"><input type="checkbox" defaultChecked /> The Agency may use these materials only for this project.</label>
        </section>
      )}
      {step === 4 && (
        <section className="wizard-content confirm-content">
          <p className="section-kicker">Outcome confirmation</p>
          <h1>Review the engagement before the team begins.</h1>
          <div className="confirmation-grid">
            {[
              ["You provide", "Editorial context · Source materials · Audience · Constraints"],
              ["You receive", "Editorial core · Channel strategy · Blog · LinkedIn · Instagram · Consistency report"],
              ["Agency team", "Context Analyst · Strategist · Producer · Editor · Quality Reviewer"],
              ["Human checkpoints", "Outcome confirmation · Editorial core approval · Content review · Final release"],
              ["Estimated execution", "4–7 days · 18–26 technical execution units"],
              ["Execution mode", "Work begins after confirmation. No external publication is automatic."],
            ].map(x => (
              <article key={x[0]}><span>{x[0]}</span><p>{x[1]}</p></article>
            ))}
          </div>
        </section>
      )}
      <div className="wizard-footer">
        <button disabled={step === 1} onClick={() => { setStep(step - 1); }}>Back</button>
        <p>Your progress is saved on this device.</p>
        {step < 4
          ? <button className="button primary" onClick={next}>Continue →</button>
          : <button className="button primary" onClick={() => { void navigate("/projects/neurons-protocol-launch"); }}>Confirm and create project →</button>
        }
      </div>
    </main>
  );
}
