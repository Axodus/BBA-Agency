import { Link } from "react-router-dom";
import { ProjectExampleCard } from "../components/projects/ProjectExampleCard.js";
import { agencyProjects } from "../content/projects/index.js";

const anatomy = [
  ["Service", "The BBA Agency Product selected for the requested outcome."],
  ["Objective", "The result the customer needs to achieve."],
  ["Context", "Materials, facts, audiences, references, restrictions, and existing knowledge."],
  ["Execution plan", "The specialist stages and roles required to produce the result."],
  ["Human checkpoints", "Moments where interpretation, direction, or the final Package needs review."],
  ["Deliverables", "The reviewable artifacts produced through the Project."],
  ["Package", "The approved collection of final deliverables."],
  ["Traceability", "The relationship between source context, work, artifacts, versions, findings, and decisions."],
];

const executionModel = [
  "Choose the service",
  "Define the outcome",
  "Provide context and materials",
  "Confirm the expected Package",
  "Follow coordinated execution",
  "Review important decisions",
  "Request revisions when necessary",
  "Receive the approved delivery",
];

export function Projects() {
  const featuredProject = agencyProjects.find((project) => project.id === "neurons-protocol-launch");
  return (
    <main className="page-shell projects-page">
      <section className="projects-hero container" aria-labelledby="projects-heading">
        <div>
          <p className="section-kicker">Project examples</p>
          <h1 id="projects-heading">See how an outcome becomes a coordinated Agency Project</h1>
          <p>Each Project organizes customer context, specialized AI roles, human decisions, and final deliverables around a defined outcome.</p>
        </div>
        <aside className="projects-disclosure" aria-label="Informational website disclosure">
          <span>Informational website</span>
          <p>These examples explain how Projects are intended to work inside the BBA platform. This informational website does not execute Projects.</p>
        </aside>
      </section>

      <section className="projects-section container" aria-labelledby="project-definition-heading">
        <p className="section-kicker">What a Project contains</p>
        <h2 id="project-definition-heading">A structured Agency engagement, not a record in a dashboard</h2>
        <div className="projects-anatomy-grid">
          {anatomy.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="projects-section container" aria-labelledby="execution-model-heading">
        <p className="section-kicker">Common execution model</p>
        <h2 id="execution-model-heading">How a defined outcome becomes a reviewed delivery</h2>
        <ol className="projects-execution-model">
          {executionModel.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}
        </ol>
      </section>

      {featuredProject && (
        <section className="projects-section projects-featured container" aria-labelledby="featured-project-heading">
          <p className="section-kicker">Featured Project example</p>
          <h2 id="featured-project-heading">The current Publisher prototype in context</h2>
          <ProjectExampleCard project={featuredProject} featured />
          <div className="projects-featured-note">
            <p>The example explains Editorial Context, Context Analysis, an approved Editorial Core, publication strategy, Blog, LinkedIn, and Instagram adaptation, semantic consistency review, final Package review, and an Editorial Package without external publication.</p>
            <a className="button secondary" href="https://dev.bba.country" target="_blank" rel="noopener noreferrer" aria-label="Explore the functional Publisher prototype at dev.bba.country in a new tab">Check Dev Prototype <span aria-hidden="true">→</span></a>
          </div>
        </section>
      )}

      <section className="projects-section container" aria-labelledby="project-catalog-heading">
        <p className="section-kicker">Examples by service</p>
        <h2 id="project-catalog-heading">Five product-specific Project structures</h2>
        <div className="projects-catalog">
          {agencyProjects.map((project) => <ProjectExampleCard key={project.id} project={project} />)}
        </div>
      </section>

      <section className="projects-closing-grid container" aria-label="Review and delivery explanation">
        <article><p className="section-kicker">Human review and revision</p><h2>Important interpretation stays with people</h2><p>Each example shows where the customer validates an interpretation, provides direction, requests changes, and reviews the final Package. The static site explains those checkpoints without making decisions.</p></article>
        <article><p className="section-kicker">Package delivery</p><h2>Delivery retains its context</h2><p>A Package groups the final deliverables with visible source relationships, quality findings, limitations, versions, and human decisions. It does not imply external publication or an active export.</p></article>
      </section>

      <section className="projects-platform-note" aria-labelledby="projects-platform-heading">
        <p className="section-kicker">Static site and functional platform</p>
        <h2 id="projects-platform-heading">The examples explain the experience; the prototype demonstrates Publisher behavior</h2>
        <p>Only the Neurons Protocol Launch example is backed by the separately hosted BBA Publisher prototype. The other examples illustrate planned BBA Agency Products and are not operational implementations.</p>
        <Link to="/services" >Explore BBA Agency Products <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
