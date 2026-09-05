import { Alert, Badge, Card, Link, Spinner } from "@bba/ui";
import { useProjectsQuery } from "@bba/sdk-react";

export function ProjectsPage() {
  const query = useProjectsQuery();
  if (query.isLoading) return <Spinner label="Loading Projects" />;
  if (query.isError) return <Alert title="Unable to load Projects">{query.error.message}</Alert>;
  return <section className="bba-page"><header><span className="bba-page__eyebrow">BBA Publisher</span><h1>Projects</h1><p>Each Project brings Context, Strategy, Content, Review, and Delivery into one workspace.</p></header>{query.data?.length ? <div className="bba-grid">{query.data.map((project) => <Card key={project.projectId}><Badge>{project.status}</Badge><h2>{project.context.title}</h2><p>{project.visibleStage}</p><Link to={`/projects/${project.projectId}`}>Open Project Workspace</Link></Card>)}</div> : <Card><h2>No Projects created</h2><p>Start with the publication planning service.</p><Link to="/projects/new">Create first Project</Link></Card>}</section>;
}
