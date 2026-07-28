import { Badge, Card } from "@bba/ui";

const modules = ["Mission", "Human Governance", "AI Workforce", "Institutional Assets", "Knowledge / Policy", "Workflow", "Review", "Publication", "Connector"];
export function OverviewPage() { return <div className="bba-page"><header><span className="bba-page__eyebrow">Platform overview</span><h1>AI executes. Humans govern.</h1><p>A fundação web consome exclusivamente os contratos públicos da BBA Application API.</p></header><div className="bba-grid">{modules.map((module) => <Card key={module}><Badge tone={module === "Mission" ? "positive" : "neutral"}>{module === "Mission" ? "Disponível" : "Planejado"}</Badge><h2>{module}</h2><p>Superfície pública preparada para evolução incremental.</p></Card>)}</div></div>; }
