import { NavLink } from "react-router-dom";

export function StaticAiSettings() {
  return <section className="agency-page ai-settings"><header><p className="agency-kicker">Settings boundary</p><h1>Credential configuration is unavailable</h1><p>This controlled local reference does not accept provider credentials, tokens, private endpoints, or model configuration in the browser.</p></header><section className="agency-state"><h2>Use the canonical Settings surface</h2><p>Interface, governance, and notification preferences are available without storing or handling credentials.</p><NavLink className="agency-primary" to="/settings">Open Settings</NavLink></section></section>;
}
