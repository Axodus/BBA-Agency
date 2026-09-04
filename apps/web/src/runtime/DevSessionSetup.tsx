import { Alert, Button, Card, Field, Input } from "@bba/ui";
import { type FormEvent, useState } from "react";
import type { DevSessionConfiguration } from "./dev-session.js";

export function DevSessionSetup({ initialBaseUrl, onConfigure }: { readonly initialBaseUrl: string; onConfigure(configuration: DevSessionConfiguration): void }) {
  const [error, setError] = useState<string>();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const configuration = { baseUrl: String(form.get("baseUrl") ?? "").trim(), accessToken: String(form.get("accessToken") ?? "").trim(), tenantId: String(form.get("tenantId") ?? "").trim(), subject: String(form.get("subject") ?? "").trim(), actorReference: String(form.get("actorReference") ?? "").trim() };
    if (Object.values(configuration).some((value) => !value)) { setError("Preencha API, token, tenant, subject e actor reference."); return; }
    try { new URL(configuration.baseUrl); } catch { setError("Informe uma URL absoluta válida para a API."); return; }
    onConfigure(configuration);
  }
  return <main className="bba-setup" id="main-content"><Card><span className="bba-page__eyebrow">Ambiente de desenvolvimento</span><h1>Configurar sessão efêmera</h1><p>Os valores permanecem apenas em memória e serão apagados ao recarregar a página.</p>{error === undefined ? null : <Alert title="Configuração inválida">{error}</Alert>}<form className="bba-form" onSubmit={submit}><Field id="baseUrl" label="API base URL"><Input defaultValue={initialBaseUrl} id="baseUrl" name="baseUrl" placeholder="http://localhost:3000" /></Field><Field id="accessToken" label="Bearer token"><Input autoComplete="off" id="accessToken" name="accessToken" type="password" /></Field><Field id="tenantId" label="Tenant"><Input id="tenantId" name="tenantId" /></Field><Field id="subject" label="Subject"><Input id="subject" name="subject" /></Field><Field id="actorReference" label="Actor reference"><Input id="actorReference" name="actorReference" /></Field><Button type="submit">Iniciar sessão local</Button></form></Card></main>;
}
