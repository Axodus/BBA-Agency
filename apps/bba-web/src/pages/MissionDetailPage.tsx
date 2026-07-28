import { Alert, Badge, Card, Link, Spinner } from "@bba/ui";
import { useMissionQuery } from "@bba/sdk-react";
import { useParams } from "react-router-dom";

const titles = { UNAUTHENTICATED: "Sessão não autenticada", FORBIDDEN: "Acesso negado", NOT_FOUND: "Mission não encontrada", CONFLICT: "Conflito de estado", APPLICATION_FAILURE: "Falha da aplicação", UNKNOWN: "Falha inesperada", CONFIGURATION_MISSING: "Configuração ausente", SESSION_ERROR: "Falha de sessão" } as const;
export function Component() {
  const missionId = useParams().missionId ?? ""; const query = useMissionQuery(missionId);
  if (query.isPending) return <div className="bba-page"><Spinner label="Carregando Mission" /></div>;
  if (query.error !== undefined) return <div className="bba-page bba-page--narrow"><Alert title={titles[query.error.code]}>{query.error.message}</Alert><Link to="/missions">Voltar para consulta</Link></div>;
  if (query.data === undefined) return null;
  return <div className="bba-page bba-page--narrow"><header><span className="bba-page__eyebrow">Mission</span><h1>{query.data.id}</h1></header><Card><dl className="bba-definition"><div><dt>Status</dt><dd><Badge tone="positive">{query.data.status ?? "UNKNOWN"}</Badge></dd></div><div><dt>Tenant</dt><dd>{query.data.tenantId}</dd></div><div><dt>Version</dt><dd>{query.data.version}</dd></div></dl></Card><Link to="/missions">Consultar outra Mission</Link></div>;
}
