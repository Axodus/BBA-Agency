import { Alert, Badge, Button, Card, Link, Spinner } from "@bba/ui";
import { useMissionGetMissionQuery } from "@bba/sdk-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RouteActionPanel } from "../features/shared/RouteActionPanel.js";
import { ActivateMissionForm, CompleteMissionForm, RenameMissionForm } from "../features/missions/operations/actions/Forms.js";

const titles = { UNAUTHENTICATED: "Sessão não autenticada", FORBIDDEN: "Acesso negado", NOT_FOUND: "Mission não encontrada", CONFLICT: "Conflito de estado", APPLICATION_FAILURE: "Falha da aplicação", UNKNOWN: "Falha inesperada", CONFIGURATION_MISSING: "Configuração ausente", SESSION_ERROR: "Falha de sessão" } as const;
export function Component() {
  const missionId = useParams().missionId ?? ""; const query = useMissionGetMissionQuery(missionId); const [search] = useSearchParams(); const navigate = useNavigate(); const action = search.get("action");
  if (query.isPending) return <div className="bba-page"><Spinner label="Carregando Mission" /></div>;
  if (query.error !== undefined) return <div className="bba-page bba-page--narrow"><Alert title={titles[query.error.code]}>{query.error.message}</Alert><Link to="/missions">Voltar para consulta</Link></div>;
  if (query.data === undefined) return null;
  const close = () => { void navigate(`/missions/${encodeURIComponent(missionId)}`); };
  const panel = action === "missionRenameMission" ? <RouteActionPanel title="Rename Mission" description="Change the public Mission title." onClose={close}><RenameMissionForm missionId={missionId} version={query.data.version} /></RouteActionPanel> : action === "missionActivateMission" ? <RouteActionPanel title="Activate Mission" description="Record the governing authority and evidence." onClose={close}><ActivateMissionForm missionId={missionId} version={query.data.version} /></RouteActionPanel> : action === "missionCompleteMission" ? <RouteActionPanel title="Complete Mission" description="Record the final governed outcome." onClose={close}><CompleteMissionForm missionId={missionId} version={query.data.version} /></RouteActionPanel> : null;
  return <div className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Mission</span><h1>{query.data.title ?? query.data.id}</h1><p>{query.data.summary ?? query.data.description ?? "Public Mission projection"}</p></header><Card><dl className="bba-definition"><div><dt>ID</dt><dd>{query.data.id}</dd></div><div><dt>Status</dt><dd><Badge tone="positive">{query.data.status ?? "UNKNOWN"}</Badge></dd></div><div><dt>Tenant</dt><dd>{query.data.tenantId}</dd></div><div><dt>Version</dt><dd>{query.data.version}</dd></div></dl></Card><div className="bba-cluster"><Button onClick={() => { void navigate(`?action=missionRenameMission`); }}>Rename</Button><Button onClick={() => { void navigate(`?action=missionActivateMission`); }} variant="secondary">Activate</Button><Button onClick={() => { void navigate(`?action=missionCompleteMission`); }} variant="secondary">Complete</Button></div><Link to="/missions">Consultar outra Mission</Link>{panel}</div>;
}
