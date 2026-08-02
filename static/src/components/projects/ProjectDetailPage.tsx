import { Link } from "react-router-dom";
import { getAgencyProductById } from "../../content/products/index.js";
import type {
  AgencyProjectContent,
  ProjectDeliverable,
  ProjectHumanDecision,
} from "../../content/projects/index.js";
import type { ProjectMarkdownSection } from "../../content/projects/project-content.types.js";

function Section({
  eyebrow,
  title,
  children,
  className,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return <section className={`project-example-section ${className ?? ""}`.trim()}><p className="section-kicker">{eyebrow}</p><h2>{title}</h2>{children}</section>;
}

function ContentLead({ content }: { readonly content: string }) {
  return <p className="project-example-content-lead">{content}</p>;
}

function StatusBadge({ project }: { readonly project: AgencyProjectContent }) {
  return <span className={`project-example-status ${project.exampleStatus.toLowerCase()}`}>{project.availability.label}</span>;
}

function ArtifactNames({ ids, deliverables }: { readonly ids: string[]; readonly deliverables: ProjectDeliverable[] }) {
  const map = new Map(deliverables.map((deliverable) => [deliverable.id, deliverable.name]));
  return <>{ids.map((id) => map.get(id) ?? id).join(" · ")}</>;
}

function DecisionNames({ ids, decisions }: { readonly ids: string[]; readonly decisions: ProjectHumanDecision[] }) {
  const map = new Map(decisions.map((decision) => [decision.id, decision.name]));
  return <>{ids.map((id) => map.get(id) ?? id).join(" · ")}</>;
}

function requiredSection(project: AgencyProjectContent, title: string): ProjectMarkdownSection {
  const section = project.sections[title];
  if (!section) throw new Error(`Missing generated Project section: ${title}`);
  return section;
}

export function ProjectDetailPage({ project }: { readonly project: AgencyProjectContent }) {
  const relatedProduct = getAgencyProductById(project.relatedProductId);
  const rolesById = new Map(project.agentTeam.roles.map((role) => [role.id, role]));
  const decisionsById = new Map(project.humanDecisions.map((decision) => [decision.id, decision]));
  const materialById = new Map(project.context.materials.map((material) => [material.id, material]));
  const previous = project.navigation.previousProject;
  const next = project.navigation.nextProject;
  const overview = requiredSection(project, "Overview");
  const customerObjectiveSection = requiredSection(project, "Customer objective");
  const whyItMatters = requiredSection(project, "Why this Project matters");
  const contextAndMaterials = requiredSection(project, "Context and materials");
  const expectedOutcome = requiredSection(project, "Expected outcome");
  const execution = requiredSection(project, "How the Project is executed");
  const agentTeam = requiredSection(project, "Agent team");
  const checkpoints = requiredSection(project, "Human checkpoints");
  const revision = requiredSection(project, "Illustrative revision");
  const deliverables = requiredSection(project, "Deliverables and final Package");
  const traceability = requiredSection(project, "Traceability");
  const quality = requiredSection(project, "Quality considerations");
  const limitations = requiredSection(project, "Limitations");
  const platformRelationship = requiredSection(project, "Relationship to the functional platform");
  const faq = requiredSection(project, "Frequently asked questions");

  return (
    <main className="page-shell project-example-page">
      <Link className="back-link container" to="/projects">← Return to Project examples</Link>

      <section className="project-example-hero container" aria-labelledby="project-example-heading">
        <div>
          <p className="section-kicker">{project.eyebrow}</p>
          <StatusBadge project={project} />
          <h1 id="project-example-heading">{project.name}</h1>
          <p className="project-example-headline">{project.headline}</p>
          <p className="project-example-summary">{project.summary}</p>
          <div className="project-example-hero-meta"><span>{project.productName}</span><span>{project.category}</span><span>{project.packageName}</span></div>
          <p className="project-example-disclosure">{project.prototype.disclosure}</p>
          {project.prototype.available ? (
            <a className="project-example-external-link" href={project.prototype.url} target="_blank" rel="noopener noreferrer" aria-label={`Explore the functional Publisher prototype at dev.bba.country in a new tab`}>
              Explore the functional Publisher prototype at dev.bba.country <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
        <aside className="project-example-package-panel" aria-label="Expected final Package">
          <span>Expected final Package</span>
          <strong>{project.packageName}</strong>
          <p>{project.customerOutcome}</p>
          <i>{project.exampleStatus === "PROTOTYPE_BACKED" ? "Prototype-backed informational example" : "Illustrative planned example"}</i>
        </aside>
      </section>

      <section className="project-example-overview bkg-white" aria-label="Project overview">
        <article><span>Customer objective</span><p>{project.customerObjective}</p></article>
        <article><span>Audience</span><p>{project.audience.join(" · ")}</p></article>
        <article><span>Human checkpoints</span><p>{project.humanDecisions.length} documented decisions</p></article>
        <article><span>Final Package</span><p>{project.packageName}</p></article>
      </section>

      <Section className="container" eyebrow="Overview" title={overview.title}>
        <ContentLead content={overview.body} />
      </Section>

      <Section className="container" eyebrow="Customer objective" title={customerObjectiveSection.title}>
        <div className="project-example-objective-grid">
          <article><span>What the customer needs to achieve</span><p>{project.customerObjective}</p></article>
          <article><span>Why this Project matters</span><p>{whyItMatters.body}</p></article>
        </div>
      </Section>

      <Section className="container" eyebrow="Context and materials" title={contextAndMaterials.title}>
        <ContentLead content={contextAndMaterials.body} />
        <div className="project-example-context-grid">
          <article><h3>Objectives</h3><ul>{project.context.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></article>
          <article><h3>Materials</h3><ul>{project.context.materials.map((material) => <li key={material.id}><strong>{material.name}</strong><span>{material.type}</span><p>{material.description}</p></li>)}</ul></article>
          <article><h3>Trusted facts</h3><ul>{project.context.trustedFacts.map((fact) => <li key={fact.id}>{fact.statement}<small>Source: {materialById.get(fact.sourceReference)?.name ?? fact.sourceReference}</small></li>)}</ul></article>
          <article><h3>Constraints and terminology</h3><ul>{project.context.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul><p><strong>Required:</strong> {project.context.requiredTerms.join(" · ")}</p><p><strong>Prohibited:</strong> {project.context.prohibitedClaims.join(" · ")}</p><p><strong>Uncertainties:</strong> {project.context.uncertainties.join(" · ")}</p></article>
        </div>
      </Section>

      <Section className="container" eyebrow="Expected outcome" title={expectedOutcome.title}>
        <ContentLead content={expectedOutcome.body} />
        <div className="project-example-outcome-panel">
          <article><span>Agreed result</span><p>{project.expectedOutcome.description}</p></article>
          <article><span>Included deliverables</span><p><ArtifactNames ids={project.expectedOutcome.deliverableIds} deliverables={project.deliverables} /></p></article>
          <article><span>Human approvals</span><p><DecisionNames ids={project.expectedOutcome.checkpointIds} decisions={project.humanDecisions} /></p></article>
          <article><span>Known limitations</span><p>{project.expectedOutcome.knownLimitations.join(" ")}</p></article>
        </div>
      </Section>

      <Section className="container" eyebrow="Execution timeline" title={execution.title}>
        <ContentLead content={execution.body} />
        <ol className="project-example-timeline">
          {project.workflow.map((stage) => (
            <li key={stage.id} className={stage.humanCheckpoint ? "project-timeline-stage checkpoint" : "project-timeline-stage"}>
              <div className="project-timeline-order">{String(stage.order).padStart(2, "0")}</div>
              <div className="project-timeline-title"><h3>{stage.label}</h3><p>{stage.objective}</p></div>
              <dl>
                <div><dt>Agency activity</dt><dd>{stage.agencyActivity}</dd></div>
                <div><dt>Customer involvement</dt><dd>{stage.customerInvolvement}</dd></div>
                <div><dt>Participating roles</dt><dd>{stage.agentRoleIds.map((id) => rolesById.get(id)?.name ?? id).join(" · ")}</dd></div>
                <div><dt>Produced artifact</dt><dd><ArtifactNames ids={stage.artifactIds} deliverables={project.deliverables} /></dd></div>
                <div><dt>Checkpoint</dt><dd>{stage.humanCheckpoint ? `Human checkpoint: ${decisionsById.get(stage.decisionId ?? "")?.name ?? "Decision required"}` : "Agency stage"}</dd></div>
              </dl>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="container" eyebrow={project.agentTeam.status === "PROTOTYPE_IMPLEMENTED" ? "Prototype team" : "Illustrative proposed team"} title={agentTeam.title}>
        <ContentLead content={agentTeam.body} />
        <div className="project-example-agent-grid">
          {project.agentTeam.roles.map((role) => <article key={role.id}><span>{role.stageIds.length} stages</span><h3>{role.name}</h3><p>{role.responsibility}</p><small><strong>Stages:</strong> {role.stageIds.map((id) => project.workflow.find((stage) => stage.id === id)?.label ?? id).join(" · ")}</small><small><strong>Artifacts:</strong> <ArtifactNames ids={role.artifactIds} deliverables={project.deliverables} /></small></article>)}
        </div>
      </Section>

      <Section className="container" eyebrow="Human checkpoints" title={checkpoints.title}>
        <ContentLead content={checkpoints.body} />
        <div className="project-example-checkpoint-grid">
          {project.humanDecisions.map((decision) => <article key={decision.id}><span>Human checkpoint</span><h3>{decision.name}</h3><p>{decision.purpose}</p><dl><div><dt>Related stage</dt><dd>{project.workflow.find((stage) => stage.id === decision.stageId)?.label ?? decision.stageId}</dd></div><div><dt>Available in the functional platform</dt><dd>{decision.availableResponses.map((response) => response.toLowerCase().replaceAll("_", " ")).join(", ")}</dd></div><div><dt>Effect</dt><dd>{decision.effect}</dd></div></dl></article>)}
        </div>
      </Section>

      <Section className="container" eyebrow="Illustrative revision" title={revision.title}>
        <ContentLead content={revision.body} />
        <article className="project-example-revision"><span>Illustrative revision</span><h3>{project.revisionExample.title}</h3><dl><div><dt>Customer request</dt><dd>{project.revisionExample.request}</dd></div><div><dt>Reason</dt><dd>{project.revisionExample.reason}</dd></div><div><dt>Affected artifacts</dt><dd><ArtifactNames ids={project.revisionExample.affectedArtifactIds} deliverables={project.deliverables} /></dd></div><div><dt>Repeated stages</dt><dd>{project.revisionExample.repeatedStageIds.map((id) => project.workflow.find((stage) => stage.id === id)?.label ?? id).join(" · ")}</dd></div><div><dt>Preserved artifacts</dt><dd><ArtifactNames ids={project.revisionExample.preservedArtifactIds} deliverables={project.deliverables} /></dd></div><div><dt>Resulting version</dt><dd>Version {project.revisionExample.resultingVersion}</dd></div></dl><p>{project.revisionExample.traceabilityNote}</p></article>
      </Section>

      <Section className="container" eyebrow="Deliverables and final Package" title={deliverables.title}>
        <ContentLead content={deliverables.body} />
        <div className="project-example-deliverable-grid">
          {project.deliverables.map((deliverable) => <article key={deliverable.id}><span>{deliverable.requiresApproval ? "Human approval applies" : "Reviewable output"}</span><h3>{deliverable.name}</h3><p>{deliverable.description}</p><small><strong>Purpose:</strong> {deliverable.purpose}</small><small><strong>Format:</strong> {deliverable.format.join(" · ")}</small><i>{deliverable.includedInFinalPackage ? `Included in ${project.packageName}` : "Not included in final Package"}</i></article>)}
        </div>
      </Section>

      <Section className="container" eyebrow="Traceability" title={traceability.title}>
        <ContentLead content={traceability.body} />
        <div className="project-example-traceability-list">
          {project.traceability.map((record) => <article key={record.id}><span>Illustrative trace record</span><h3>{materialById.get(record.sourceReference)?.name ?? record.sourceReference}</h3><p>{record.contextItem}</p><dl><div><dt>Workflow stage</dt><dd>{project.workflow.find((stage) => stage.id === record.workflowStageId)?.label ?? record.workflowStageId}</dd></div><div><dt>Agent role</dt><dd>{rolesById.get(record.agentRoleId)?.name ?? record.agentRoleId}</dd></div><div><dt>Artifact and version</dt><dd>{project.deliverables.find((item) => item.id === record.artifactId)?.name ?? record.artifactId} · v{record.artifactVersion}</dd></div><div><dt>Human decision</dt><dd>{decisionsById.get(record.decisionId)?.name ?? record.decisionId}</dd></div><div><dt>Rationale</dt><dd>{record.rationale}</dd></div></dl></article>)}
        </div>
      </Section>

      <Section className="container" eyebrow="Quality considerations" title={quality.title}>
        <ContentLead content={quality.body} />
      </Section>

      <Section eyebrow="Limitations" title={limitations.title} className="project-example-limitations">
        <ContentLead content={limitations.body} />
        <ul>{project.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>
      </Section>

      <Section className="container" eyebrow="Functional platform relationship" title={platformRelationship.title}>
        <ContentLead content={platformRelationship.body} />
      </Section>

      <Section className="container" eyebrow="Frequently asked questions" title={faq.title}>
        <div className="project-example-faq-list">{project.faq.map((item) => <article className="bkg-white" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div>
      </Section>

      <section className="project-example-related container" aria-label="Related Product and Project navigation">
        <article><p className="section-kicker">Related Product</p><h2>{relatedProduct?.name ?? project.productName}</h2><p>{relatedProduct?.customerOutcome ?? project.customerOutcome}</p><Link to={relatedProduct?.route ?? project.productRoute}>View Product details →</Link></article>
        <nav aria-label="Project navigation"><Link to="/projects">All Project examples</Link>{previous ? <Link to={`/projects/${previous}`}>Previous Project</Link> : <span>Previous Project: none</span>}{next ? <Link to={`/projects/${next}`}>Next Project</Link> : <span>Next Project: none</span>}</nav>
      </section>
    </main>
  );
}
