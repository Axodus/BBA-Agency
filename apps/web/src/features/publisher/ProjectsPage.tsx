Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
Failed to create stream fd: Operation not permitted
import { Alert, Badge, Card, Link, Spinner } from "@bba/ui";
import { useProjectsQuery } from "@bba/sdk-react";

export function ProjectsPage() {
  const query = useProjectsQuery();
  if (query.isLoading) return <Spinner label="Carregando Projects" />;
  if (query.isError) return <Alert title="Unable to load os Projects">{query.error.message}</Alert>;
  return <section className="bba-page"><header><span className="bba-page__eyebrow">BBA Publisher</span><h1>Projects</h1><p>Cada Project reúne Context, Strategy, Content, Review e Delivery em um único workspace.</p></header>{query.data?.length ? <div className="bba-grid">{query.data.map((project) => <Card key={project.projectId}><Badge>{project.status}</Badge><h2>{project.context.title}</h2><p>{project.visibleStage}</p><Link to={`/projects/${project.projectId}`}>Abrir Workspace do Project</Link></Card>)}</div> : <Card><h2>Nenhum Project criado</h2><p>Start with the publication planning service.</p><Link to="/projects/new">Criar primeiro Project</Link></Card>}</section>;
}

