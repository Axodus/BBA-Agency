import { Button, Card, Field, Input, Link } from "@bba/ui";
import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function MissionsPage() {
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const id = String(new FormData(event.currentTarget).get("missionId") ?? "").trim(); if (id) void navigate(`/missions/${encodeURIComponent(id)}`); }
  return <div className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Mission workspace</span><h1>Missions</h1><p>Crie uma Mission ou consulte sua projeção pública através do SDK.</p></header><Card><form className="bba-form" onSubmit={submit}><Field id="missionId" label="Mission ID" hint="Exemplo: mission_institutional_review"><Input autoComplete="off" id="missionId" name="missionId" required /></Field><Button type="submit">Consultar Mission</Button></form></Card><Link to="/missions/new">Criar Mission</Link></div>;
}
