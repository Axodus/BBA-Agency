import { Card, Link } from "@bba/ui";

export function AiSettingsPage() {
  return <section className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Settings boundary</span><h1>Credential configuration is unavailable</h1><p>This browser surface does not receive or retain provider credentials, private endpoints, or model configuration.</p></header><Card><h2>Use Settings instead</h2><p>Interface, governance, and notification preferences remain local to the application.</p><Link to="/settings">Open Settings</Link></Card></section>;
}
