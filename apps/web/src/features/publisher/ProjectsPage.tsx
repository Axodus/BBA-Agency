import { Alert, Badge, Card, Link, Spinner } from "@bba/ui";
import { useProjectsQuery } from "@bba/sdk-react";

export function ProjectsPage() {
  const query = useProjectsQuery();
  if (query.isLoading) return <Spinner label="Carregando Projetos" />;
  if (query.isError) return <Alert title="Não foi possível carregar os Projetos">{query.error.message}</Alert>;
  return <section className="bba-page"><header><span className="bba-page__eyebrow">BBA Publisher</span><h1>Projetos</h1><p>Cada Projeto reúne Contexto, Estratégia, Conteúdos, Revisão e Entrega em um único workspace.</p></header>{query.data?.length ? <div className="bba-grid">{query.data.map((project) => <Card key={project.projectId}><Badge>{project.status}</Badge><h2>{project.context.title}</h2><p>{project.visibleStage}</p><Link to={`/projects/${project.projectId}`}>Abrir Workspace do Projeto</Link></Card>)}</div> : <Card><h2>Nenhum Projeto criado</h2><p>Comece pelo serviço de planejamento de publicações.</p><Link to="/projects/new">Criar primeiro Projeto</Link></Card>}</section>;
}
