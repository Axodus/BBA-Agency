import { Button, Card, Field, Input, Link } from "@bba/ui";
import { type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function MissionsPage() {
  const navigate = useNavigate();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const id = String(new FormData(event.currentTarget).get("missionId") ?? "").trim(); if (id) void navigate(`/missions/${encodeURIComponent(id)}`); }
  return <div className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Mission workspace</span><h1>Missions</h1><p>Create a Mission or query its public projection through the SDK.</p></header><Card><form className="bba-form" onSubmit={submit}><Field id="missionId" label="Mission ID" hint="Example: mission_institutional_review"><Input autoComplete="off" id="missionId" name="missionId" required /></Field><Button type="submit">Query Mission</Button></form></Card><Link to="/missions/new">Create Mission</Link></div>;
}
