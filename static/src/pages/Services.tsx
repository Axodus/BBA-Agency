import { useEffect } from "react";
import { Link } from "react-router-dom";
import { services, availabilityLabels } from "../content/services.js";
import type { InformationalAgencyService } from "../content/services.js";

export function Services() {
  useEffect(() => {
    document.title = "Services | BBA Agency";
    return () => {
      document.title = "BBA Agency";
    };
  }, []);

  return (
    <main className="page-shell">
      <ServiceIndex />
      <HowEveryServiceWorks />
      <ServiceCatalog />
      <ServiceVsTechnology />
      <HumanControl />
      <PrototypeDisclosure />
      <RelatedInformationalCta />
    </main>
  );
}

function ServiceIndex() {
  return (
    <div className="page-intro container">
      <p className="section-kicker">Agency services / 05 disciplines</p>
      <h1>Services designed around the outcome you need</h1>
      <p>
        Choose the result you want to produce. BBA Agency organizes the
        context, specialized AI roles, human checkpoints, and deliverables
        required to complete the work.
      </p>
      <div className="disclosure-note">
        The services described here explain how the future BBA platform
        experience will work. The operational prototype is hosted separately at 
        <a
          href="https://dev.bba.country"
          target="_blank"
          rel="noopener noreferrer"
        >
          dev.bba.country
        </a>
        , an external environment. The static site you are viewing now does not
        execute work, create projects, or call any backend.
      </div>
      
    </div>
  );
}

function HowEveryServiceWorks() {
  return (
    <section className="workflow-section container" aria-labelledby="workflow-heading">
      <p className="section-kicker">How every service works</p>
      <h2 id="workflow-heading">One common journey for every service.</h2>
      <p className="workflow-intro">
        Regardless of the service, the experience follows the same path: choose
        a result, provide context, confirm the expected outcome, follow the
        coordinated AI team through execution, review key decisions, and receive
        a structured delivery package.
      </p>
      <div className="workflow-steps">
        <WorkflowStep number="1" label="Choose the result">
          The customer selects the service that best matches the work they need
          completed.
        </WorkflowStep>
        <WorkflowStep number="2" label="Provide context">
          The customer supplies objectives, audience, materials, constraints,
          references, and the expected deliverables.
        </WorkflowStep>
        <WorkflowStep
          number="3"
          label="Confirm the work"
        >
          The platform summarizes the expected outcome, deliverables, planned
          stages, participating agent roles, human checkpoints, estimated
          execution units, and known limitations.
        </WorkflowStep>
        <WorkflowStep number="4" label="Follow the Agency team">
          Specialized AI agents execute coordinated stages while the platform
          displays progress, outputs, findings, and pending decisions.
        </WorkflowStep>
        <WorkflowStep number="5" label="Review and direct">
          The customer approves, rejects, requests changes, provides guidance,
          compares versions, and reviews traceability.
        </WorkflowStep>
        <WorkflowStep number="6" label="Receive the final package">
          The completed result is delivered as a structured package containing
          approved outputs, versions, decisions, limitations, and supporting
          materials.
        </WorkflowStep>
      </div>
    </section>
  );
}

function WorkflowStep({
  number,
  label,
  children,
}: {
  readonly number: string;
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    <article className="workflow-step">
      <span className="step-number">0{number}</span>
      <h3>{label}</h3>
      <p>{children}</p>
    </article>
  );
}

function ServiceCatalog() {
  return (
    <section
      className="service-catalog container"
      aria-labelledby="catalog-heading"
    >
      <p className="section-kicker">The five disciplines</p>
      <h2 id="catalog-heading">Five service categories, one accountable team.</h2>
      <div className="catalog" id="services-catalog">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} featured={s.id === "publisher"} />
        ))}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  featured,
}: {
  readonly service: InformationalAgencyService;
  readonly featured: boolean;
}) {
  const availabilityLabel = availabilityLabels[service.availability];
  const availabilityTone =
    service.availability === "PROTOTYPE_AVAILABLE"
      ? "available"
      : "planned";

  return (
    <article
      className={`catalog-card ${featured ? "featured" : ""} ${availabilityTone}`}
      data-service-id={service.id}
    >
      <div className="card-top">
        <span
          className={`status ${availabilityTone} ${service.availability.toLowerCase()}`}
          aria-label={availabilityLabel}
        >
          {availabilityLabel}
        </span>
      </div>

      <p className="category">{service.category}</p>
      <h2>{service.name}</h2>
      <p className="catalog-headline">{service.headline}</p>

      <p className="outcome-label">Customer outcome</p>
      <p className="outcome">{service.customerOutcome}</p>

      <dl className="service-details">
        <div>
          <dt>Representative deliverables</dt>
          <dd>
            <ul>
              {service.deliverables.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Human review</dt>
          <dd>
            <p>{service.humanCheckpoints[0]}</p>
          </dd>
        </div>
      </dl>

      <div className="card-meta">
        <span aria-label={availabilityLabel}>{availabilityLabel}</span>
        <span>Human review required</span>
      </div>

      {service.detailHref && (
        <Link
          to={service.detailHref}
          className="button secondary right"
          aria-label={`View service details for ${service.name}`}
        >
          {service.availability === "PROTOTYPE_AVAILABLE"
            ? "Learn how it works"
            : "View product details"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}

function PrototypeDisclosure() {
  return (
    <section
      className="prototype-disclosure container"
      aria-labelledby="prototype-heading"
    >
      <p className="section-kicker">Where the platform experience lives</p>
      <h2 id="prototype-heading">See how the platform experience works.</h2>
      <p>
        The BBA Publisher prototype demonstrates how a customer will create a
        Project, provide Editorial Context, follow a coordinated AI team,
        review key decisions, and receive a final delivery package.
      </p>
      <button className="arrow-link" onClick={() => { window.open("https://dev.bba.country", "_blank", "noopener,noreferrer"); }}>
        Explore the BBA Publisher prototype <span aria-hidden="true">→</span>
      </button>
      <p className="disclosure-note">
      </p>
      <p className="disclosure-note">
        This link opens the external functional prototype at dev.bba.country.
        Not every service listed on this page is operational today. Only BBA
        Publisher is available in the prototype; the remaining services are
        planned.
      </p>
    </section>
  );
}

function RelatedInformationalCta() {
  return (
    <section className="prototype-disclosure container" aria-labelledby="related-cta-heading">
      <p className="section-kicker">Continue exploring</p>
      <h2 id="related-cta-heading">Read the product details before using the prototype.</h2>
      <p>
        Each product page explains the problem, the expected outcome, the
        customer inputs, the Agency team, the human checkpoints, and the
        limitations of the experience.
      </p>
      <button className="arrow-link" onClick={() => { void window.open("https://dev.bba.country", "_blank", "noopener,noreferrer"); }}>
        Explore the BBA Publisher prototype <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function ServiceVsTechnology() {
  return (
    <section
      className="service-vs-technology container"
      aria-labelledby="distinction-heading"
    >
      <h2 id="distinction-heading">
        You choose the outcome. The Agency organizes the execution.
      </h2>
      <p>
        Customers do not need to configure workflows, prompts, agents, or
        internal platform components. Each service defines the context
        required, the specialized roles involved, the review checkpoints, and
        the final deliverables.
      </p>
      <div className="distinction-grid">
        <div className="distinction-item">
          <strong>Services are what customers consume</strong>
          <p>
            A service is a contracted outcome — the problem it solves, the
            context the customer provides, the roles that participate, and the
            package that is delivered.
          </p>
        </div>
        <div className="distinction-item">
          <strong>Agents are execution roles</strong>
          <p>
            Specialized AI agents carry out coordinated work under human
            direction, but they are not products the customer configures.
          </p>
        </div>
        <div className="distinction-item">
          <strong>The Platform remains internal infrastructure</strong>
          <p>
            Mission orchestration, knowledge, review, publication, and
            Connector subsystems operate behind the customer experience.
          </p>
        </div>
      </div>
    </section>
  );
}

function HumanControl() {
  return (
    <section
      className="human-control"
      aria-labelledby="human-control-heading"
    >
      <div className="control-mark" aria-hidden="true">
        <span>AI</span>
        <i>+</i>
        <span>H</span>
      </div>
      <div>
        <p className="section-kicker">Human control</p>
        <h2 id="human-control-heading">
          Nothing important moves forward without you.
        </h2>
        <p>
          Every service keeps important decisions under human control. You can
          approve intermediate interpretations, request changes, reject
          unsuitable results, review evidence and traceability, compare versions,
          and approve the final package before delivery.
        </p>
      </div>
    </section>
  );
}
