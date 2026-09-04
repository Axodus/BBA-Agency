import { NavLink } from "react-router-dom";
import { formatDate } from "../../i18n/index.js";
import { useStaticPublisher } from "../StaticPublisherProvider.js";

export function DeliveriesPage() {
  const deliveries = useStaticPublisher().projects.filter((project) => project.status === "READY_FOR_DELIVERY");
  return <div className="agency-page deliveries-page">
    <header className="agency-page-header"><div><p className="agency-kicker">Completed outcomes</p><h1>Deliveries</h1><p>Approved Editorial Packages prepared for review, export, and use. No external publication was performed.</p></div><NavLink to="/projects">View all Projects</NavLink></header>
    {deliveries.length === 0 ? <section className="agency-state"><h2>No deliveries yet.</h2><p>An approved package will appear here after its Human Governance checkpoints are complete.</p><NavLink className="agency-primary" to="/services/publisher/new">Start a Project</NavLink></section> : <section className="delivery-cards" aria-label="Recent deliveries">{deliveries.map((project) => <article className="delivery-card" key={project.projectId}><div><p className="agency-kicker">{project.product.name}</p><h2>{project.title}</h2><p>Blog · LinkedIn · Instagram</p></div><dl><div><dt>Status</dt><dd>Approved for delivery</dd></div><div><dt>Updated</dt><dd>{formatDate(project.updatedAt)}</dd></div><div><dt>External publication</dt><dd>Not performed</dd></div></dl><NavLink className="agency-arrow" to={`/projects/${project.projectId}/delivery`}>Open package →</NavLink></article>)}</section>}
  </div>;
}
