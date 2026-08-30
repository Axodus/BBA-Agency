import { Link } from "react-router-dom";
import type { AgencyProjectContent } from "../../content/projects/index.js";

export function ProjectContentCard({
  project,
  featured = false,
}: {
  readonly project: AgencyProjectContent;
  readonly featured?: boolean;
}) {
  const representativeStages = project.workflow.slice(0, 3);
  const statusLabel = project.availability.label;
  return (
    <article className={`project-example-card ${featured ? "project-example-card-featured" : ""}`.trim()}>
      <div className="project-example-card-top">
        <span>{project.category}</span>
        <em className={`project-example-status ${project.exampleStatus.toLowerCase()}`}>{statusLabel}</em>
      </div>
      <p className="section-kicker">{project.productName}</p>
      <h3>{project.name}</h3>
      <p className="project-example-card-summary">{project.summary}</p>
      <dl className="project-example-card-facts">
        <div><dt>Customer objective</dt><dd>{project.customerObjective}</dd></div>
        <div><dt>Representative stages</dt><dd>{representativeStages.map((stage) => stage.label).join(" · ")}</dd></div>
        <div><dt>Human review</dt><dd>{project.humanDecisions.length} documented checkpoints</dd></div>
        <div><dt>Final Package</dt><dd>{project.packageName}</dd></div>
      </dl>
      <Link className="button muted right" to={project.route}>
        How this works <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
