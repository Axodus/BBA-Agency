import { Button, Card, Field, Input } from "@bba/ui";
import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function MissionsPage() {
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const id = String(new FormData(event.currentTarget).get("missionId") ?? "").trim(); if (id) void navigate(`/missions/${encodeURIComponent(id)}`); }
  return <div className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Mission lookup</span><h1>Consultar Mission</h1><p>Informe o identificador público para carregar a projeção através do SDK gerado.</p></header><Card><form className="bba-form" onSubmit={submit}><Field id="missionId" label="Mission ID" hint="Exemplo: mission_institutional_review"><Input autoComplete="off" id="missionId" name="missionId" required /></Field><Button type="submit">Consultar Mission</Button></form></Card></div>;
}
