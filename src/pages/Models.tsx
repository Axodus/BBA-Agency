import { useState } from "react";

export function Models() {
  const [own, setOwn] = useState(false);
  return (
    <main className="page-shell">
      <div className="page-intro split container">
        <div>
          <p className="section-kicker">Service configuration</p>
          <h1>AI models &amp; privacy</h1>
        </div>
        <p>Choose how the Agency executes your work. Model configuration stays optional and never replaces the service experience.</p>
      </div>
      <section className="settings-grid container">
        <article className="setting-card">
          <div><span>01 / Recommended</span><em>Active</em></div>
          <h2>BBA managed models</h2>
          <p>The Agency chooses appropriate models by role, quality requirement, and task. Credentials and routing are managed for you.</p>
          <ul>
            <li>Model selection by specialist role</li>
            <li>Isolated project context</li>
            <li>Consumption shown before execution</li>
          </ul>
          <button className="button primary">Current configuration</button>
        </article>
        <article className="setting-card">
          <div><span>02 / Advanced</span><em>{own ? "Configured" : "Optional"}</em></div>
          <h2>Use your own credentials</h2>
          <p>Connect a supported provider credential. Your key is encrypted, scoped to your projects, and can be revoked at any time.</p>
          <ul>
            <li>OpenAI · Anthropic · Google</li>
            <li>Explicit consent and expiration</li>
            <li>No prompt or endpoint playground</li>
          </ul>
          <button className="button" onClick={() => { setOwn(!own); }}>{own ? "Remove configuration" : "Configure provider"}</button>
        </article>
      </section>
      <section className="privacy-note container">
        <span>Privacy note</span>
        <h2>Your project context is work material, not a product.</h2>
        <p>Credentials, materials, and outputs remain scoped to the execution mode you confirm. Model details and technical receipts are available as a secondary traceability layer.</p>
      </section>
    </main>
  );
}
