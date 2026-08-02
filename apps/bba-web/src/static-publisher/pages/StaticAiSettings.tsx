import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { providerMessages, type ProviderScenario } from "../fixtures/provider-configurations.js";

const scenarios: readonly ProviderScenario[] = ["provider-not-configured", "checking", "configured", "invalid", "rate-limit", "provider-expired"];

export function sanitizeProviderConfiguration(input: { provider: string; apiKey: string; consent: boolean }) {
  return { provider: input.provider, configured: input.apiKey.trim().length >= 8 && input.consent, consent: input.consent };
}

export function StaticAiSettings() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("scenario") as ProviderScenario | null) ?? "provider-not-configured";
  const [scenario, setScenario] = useState<ProviderScenario>(initial);
  const [provider, setProvider] = useState("OpenAI");
  const [apiKey, setApiKey] = useState("");
  const [consent, setConsent] = useState(false);

  function selectScenario(next: ProviderScenario) {
    setScenario(next);
    setParams({ scenario: next });
  }

  function configure() {
    setScenario("checking");
    const result = sanitizeProviderConfiguration({ provider, apiKey, consent });
    selectScenario(result.configured ? "configured" : "invalid");
    setApiKey("");
  }

  function removeConfiguration() {
    setApiKey("");
    setConsent(false);
    selectScenario("provider-not-configured");
  }

  return <div className="agency-page ai-settings">
    <header><p className="agency-kicker">Product setting / Visual BYOK</p><h1>AI Models</h1><p>Choose how a future Agency execution could use your provider. This reference implementation demonstrates configuration states without sending, storing, or validating a real credential.</p></header>
    <section className="settings-panel" aria-labelledby="configuration-title"><div aria-live="polite"><span id="configuration-title">Configuration state</span><strong>{providerMessages[scenario]}</strong><small>{scenario === "configured" ? `${provider} · memory-only demonstration · expires when this session ends` : "No usable credential is stored"}</small>{scenario === "configured" ? <button className="settings-remove" onClick={removeConfiguration}>Remove configuration</button> : null}</div><form onSubmit={(event) => { event.preventDefault(); configure(); }}><label>Provider<select value={provider} onChange={(event) => setProvider(event.target.value)}><option>OpenAI</option><option>Anthropic</option></select></label><label>API key<input aria-describedby="api-key-privacy" autoComplete="off" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} /></label><p id="api-key-privacy" className="settings-privacy">The key remains only in this field until the visual check. It is cleared immediately and is never returned by application state.</p><label className="consent"><input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" />I consent to the future transmission of the Editorial Context to the selected provider.</label><button className="agency-primary" disabled={scenario === "checking"} type="submit">{scenario === "checking" ? "Verifying…" : "Verify and configure"}</button></form></section>
    <section className="settings-boundaries" aria-label="Configuration boundaries"><article><span>Privacy</span><strong>No credential persistence</strong><p>This deterministic prototype makes no provider request.</p></article><article><span>Consent</span><strong>Required before configuration</strong><p>Consent is explicit and can be withdrawn by removing the configuration.</p></article><article><span>Expiration</span><strong>End of the current session</strong><p>Refresh or removal returns the demonstration to not configured.</p></article></section>
    <p className="settings-disclaimer">Temporary prototype configuration. No credential is stored and no external AI execution occurs.</p>
    <section className="scenario-switcher"><h2>Demonstrate configuration states</h2><p>These controls select deterministic UI fixtures; they do not contact a provider.</p>{scenarios.map((item) => <button aria-pressed={scenario === item} className={scenario === item ? "active" : ""} key={item} onClick={() => selectScenario(item)}>{item}</button>)}</section>
  </div>;
}
