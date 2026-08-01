import { Link } from "react-router-dom";
import {
  getAgencyProductById,
  type AgencyProductContent,
} from "../../content/products/index.js";
import { ProductContentBlocks } from "./ProductContentBlocks.js";

const productArtworkMap = new Map<string, string>([
  ["bba-publisher", "publisher-board.svg"],
  ["advertising-campaign", "advertising-board.svg"],
  ["scientific-article", "scientific-board.svg"],
  ["governance-proposal", "governance-board.svg"],
  ["market-research", "research-board.svg"],
]);

function AvailabilityBadge({
  label,
  tone,
}: {
  readonly label: string;
  readonly tone: "available" | "planned" | "preview";
}) {
  return (
    <span className={`status product-detail-status ${tone}`}>
      {label}
    </span>
  );
}

function ProductSection({
  eyebrow,
  title,
  children,
  id,
  className,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly id?: string;
  readonly className?: string;
}) {
  return (
    <section
      id={id}
      className={`product-detail-section ${className ?? ""}`.trim()}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <p className="section-kicker">{eyebrow}</p>
      <h2 id={id ? `${id}-heading` : undefined}>{title}</h2>
      <div className="product-detail-copy">{children}</div>
    </section>
  );
}

export function ProductDetailPage({
  product,
}: {
  readonly product: AgencyProductContent;
}) {
  const previousProduct =
    product.navigation.previousProduct === null
      ? null
      : getAgencyProductById(product.navigation.previousProduct);
  const nextProduct =
    product.navigation.nextProduct === null
      ? null
      : getAgencyProductById(product.navigation.nextProduct);
  const relatedProducts = product.relatedProducts.reduce<AgencyProductContent[]>(
    (items, productId) => {
      const relatedProduct = getAgencyProductById(productId);
      if (relatedProduct) {
        items.push(relatedProduct);
      }
      return items;
    },
    [],
  );
  const checkpointStages = product.workflow.filter((stage) => stage.checkpoint);
  const packageDeliverable = [...product.deliverables].reverse().find((item) =>
    item.name.endsWith("Package"),
  );
  const prototypeAvailable = product.status === "PROTOTYPE_AVAILABLE" && product.prototypeUrl;

  return (
    <main className="page-shell product-detail-page">
      <Link to="/services" className="back-link">
        ← Return to Services
      </Link>

      <section className="product-detail-hero">
        <div className="product-detail-hero-copy">
          <p className="section-kicker">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-headline">{product.headline}</p>
          <p className="product-detail-summary">{product.summary}</p>

          <div className="product-detail-hero-meta">
            <AvailabilityBadge
              label={product.availability.label}
              tone={
                product.status === "PROTOTYPE_AVAILABLE"
                  ? "available"
                  : product.status === "PLANNED"
                    ? "planned"
                    : "preview"
              }
            />
            <span>Informational page only</span>
            <span>
              {product.agentTeamStatus === "PROTOTYPE_IMPLEMENTED"
                ? "Prototype team"
                : "Proposed agent team"}
            </span>
          </div>

          <div className="product-detail-hero-actions">
            {prototypeAvailable ? (
              <a
                href={product.prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="arrow-link"
                aria-label={`Explore the functional prototype for ${product.name} in an external environment`}
              >
                Explore the functional prototype <span aria-hidden="true">→</span>
              </a>
            ) : (
              <a href="#product-workflow" className="arrow-link">
                Learn how the product will work <span aria-hidden="true">→</span>
              </a>
            )}
          </div>

          {product.prototypeDisclosure && (
            <p className="product-detail-disclosure">
              {product.prototypeDisclosure}
            </p>
          )}
        </div>

        <aside className="product-detail-package" aria-label="Illustrative package preview">
          <div className="product-detail-package-artwork" aria-hidden="true">
            <img
              src={`/assets/product-heroes/${productArtworkMap.get(product.id) ?? "product-planning-board.svg"}`}
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </div>
          <span>Final package</span>
          <strong>{packageDeliverable?.name ?? "Structured Package"}</strong>
          <small>
            {product.deliverables.map((deliverable) => deliverable.name).join(" · ")}
          </small>
          <i>Illustrative only. No live project runs on this static page.</i>
        </aside>
      </section>

      <section className="product-detail-overview-grid" aria-label="Product overview facts">
        <article>
          <span className="section-kicker">Availability</span>
          <p>{product.availability.label}</p>
        </article>
        <article>
          <span className="section-kicker">Primary audience</span>
          <p>{product.primaryAudience.join(" · ")}</p>
        </article>
        <article>
          <span className="section-kicker">Human checkpoints</span>
          <p>{checkpointStages.length} review points in the documented workflow</p>
        </article>
        <article>
          <span className="section-kicker">Package</span>
          <p>{packageDeliverable?.name ?? "Structured package"}</p>
        </article>
      </section>

      <ProductSection eyebrow="Overview" title={product.sections.overview.title}>
        <ProductContentBlocks blocks={product.sections.overview.blocks} />
      </ProductSection>

      <section className="product-detail-problem-outcome" aria-labelledby="problem-outcome-heading">
        <p className="section-kicker">Problem and outcome</p>
        <h2 id="problem-outcome-heading">What this product solves and what it produces</h2>
        <div className="product-detail-problem-outcome-grid">
          <article>
            <span className="section-kicker">The problem it addresses</span>
            <p>{product.customerProblem}</p>
          </article>
          <article>
            <span className="section-kicker">The outcome</span>
            <p>{product.customerOutcome}</p>
          </article>
        </div>
      </section>

      <ProductSection eyebrow="Audience" title={product.sections.audience.title}>
        <ProductContentBlocks blocks={product.sections.audience.blocks} />
        <ul className="product-detail-audience-list">
          {product.primaryAudience.map((audience) => (
            <li key={audience}>{audience}</li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection eyebrow="Customer inputs" title={product.sections.customerInputs.title}>
        <ProductContentBlocks blocks={product.sections.customerInputs.blocks} />
      </ProductSection>

      <ProductSection
        eyebrow="Product workflow"
        title={product.sections.productWorkflow.title}
        id="product-workflow"
      >
        <ProductContentBlocks blocks={product.sections.productWorkflow.blocks} />
        <div className="product-detail-workflow">
          {product.workflow.map((stage) => (
            <article
              key={stage.id}
              className={`product-detail-workflow-stage ${stage.checkpoint ? "checkpoint" : ""}`}
            >
              <span>0{stage.order}</span>
              <h3>{stage.label}</h3>
              <dl>
                <div>
                  <dt>Customer contribution</dt>
                  <dd>{stage.customerRole}</dd>
                </div>
                <div>
                  <dt>Agency contribution</dt>
                  <dd>{stage.agencyRole}</dd>
                </div>
                <div>
                  <dt>Expected output</dt>
                  <dd>{stage.expectedOutput}</dd>
                </div>
                <div>
                  <dt>Review status</dt>
                  <dd>{stage.checkpoint ? "Human checkpoint" : "Agency stage"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </ProductSection>

      <ProductSection eyebrow="Agent team" title={product.sections.agentTeam.title}>
        <ProductContentBlocks blocks={product.sections.agentTeam.blocks} />
        <div className="product-detail-agent-grid">
          {product.agentTeam.map((role) => (
            <article key={role.id} className="product-detail-agent-card">
              <span>{role.stage}</span>
              <h3>{role.name}</h3>
              <p>{role.responsibility}</p>
              <small>
                {product.agentTeamStatus === "PROTOTYPE_IMPLEMENTED"
                  ? "Prototype team role"
                  : "Proposed team role"}
              </small>
            </article>
          ))}
        </div>
      </ProductSection>

      <ProductSection eyebrow="Human review" title={product.sections.humanReview.title}>
        <ProductContentBlocks blocks={product.sections.humanReview.blocks} />
        <div className="product-detail-checkpoint-band">
          <span>Human checkpoint</span>
          <span>Customer decision</span>
          <span>Review required</span>
        </div>
        <ul className="product-detail-checkpoint-list">
          {checkpointStages.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.label}</strong>
              <p>{stage.customerRole}</p>
            </li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection eyebrow="Deliverables" title={product.sections.customerReceives.title}>
        <ProductContentBlocks blocks={product.sections.customerReceives.blocks} />
        <div className="product-detail-deliverables-grid">
          {product.deliverables.map((deliverable) => (
            <article key={deliverable.id} className="product-detail-deliverable-card">
              <span>{deliverable.requiresApproval ? "Approval required" : "Reviewable output"}</span>
              <h3>{deliverable.name}</h3>
              <p>{deliverable.description}</p>
              <small>Format: {deliverable.format.join(" · ")}</small>
              <i>
                {deliverable.name === packageDeliverable?.name
                  ? "Final package"
                  : `Included in ${packageDeliverable?.name ?? "the structured package"}`}
              </i>
            </article>
          ))}
        </div>
      </ProductSection>

      <ProductSection eyebrow="Illustrative example" title={product.sections.exampleProject.title}>
        <div className="product-detail-example">
          <ProductContentBlocks blocks={product.sections.exampleProject.blocks} />
        </div>
      </ProductSection>

      <ProductSection eyebrow="Quality and traceability" title={product.sections.qualityTraceability.title}>
        <ProductContentBlocks blocks={product.sections.qualityTraceability.blocks} />
      </ProductSection>

      <ProductSection
        eyebrow="What the product does not do"
        title={product.sections.limitations.title}
        className="product-detail-limitations"
      >
        <ProductContentBlocks blocks={product.sections.limitations.blocks} />
      </ProductSection>

      <ProductSection eyebrow="Availability" title={product.sections.availability.title}>
        <ProductContentBlocks blocks={product.sections.availability.blocks} />
        {prototypeAvailable && (
          <p className="product-detail-availability-link">
            <a
              href={product.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the functional prototype at dev.bba.country
            </a>
          </p>
        )}
      </ProductSection>

      <ProductSection eyebrow="Platform relationship" title={product.sections.platformRelationship.title}>
        <ProductContentBlocks blocks={product.sections.platformRelationship.blocks} />
      </ProductSection>

      <ProductSection eyebrow="Frequently asked questions" title="Frequently asked questions">
        <div className="product-detail-faq-list">
          {product.sections.faq.map((item) => (
            <article key={item.question} className="product-detail-faq-item">
              <h3>{item.question}</h3>
              <ProductContentBlocks blocks={item.answer} />
            </article>
          ))}
        </div>
      </ProductSection>

      <section className="product-detail-related" aria-labelledby="related-products-heading">
        <p className="section-kicker">Related products</p>
        <h2 id="related-products-heading">Explore adjacent Agency outcomes</h2>
        <div className="product-detail-related-grid">
          {relatedProducts.map((relatedProduct) => (
            <article key={relatedProduct.id} className="product-detail-related-card">
              <p>{relatedProduct.category}</p>
              <h3>{relatedProduct.name}</h3>
              <p>{relatedProduct.customerOutcome}</p>
              <Link to={relatedProduct.route}>View product details →</Link>
            </article>
          ))}
        </div>
      </section>

      <nav className="product-detail-nav" aria-label="Product navigation">
        <Link to="/services">All services</Link>
        {previousProduct ? (
          <Link to={previousProduct.route}>Previous: {previousProduct.name}</Link>
        ) : (
          <span>Previous: none</span>
        )}
        {nextProduct ? (
          <Link to={nextProduct.route}>Next: {nextProduct.name}</Link>
        ) : (
          <span>Next: none</span>
        )}
      </nav>
    </main>
  );
}
