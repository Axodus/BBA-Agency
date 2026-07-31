import { services, availabilityLabels } from "../content/services.js";
import type { InformationalAgencyService } from "../content/services.js";

export function Services() {
  return (
    <main className="page-shell">
      <ServiceIndex />
      <HowEveryServiceWorks />
      <ServiceCatalog />
      <PrototypeDisclosure />
      <ServiceVsTechnology />
      <HumanControl />
    </main>
  );
}

function ServiceIndex() {
  return (
    <div className="page-intro">
      <p className="section-kicker">Agency services / 05 disciplines</p>
      <h1>Services designed around the outcome you need</h1>
      <p>
        BBA Agency offers communication, marketing, research, publishing, and
        institutional content services executed by coordinated AI agents under
        human direction and review. Choose the result you want to produce. The
        Agency will organize the context, specialized AI agents, human
        checkpoints, and deliverables required to complete the work.
      </p>
      <p>
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
      </p>
    </div>
  );
}

function HowEveryServiceWorks() {
  return (
    <section className="workflow-section" aria-labelledby="workflow-heading">
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
      className="service-catalog"
      aria-labelledby="catalog-heading"
    >
      <p className="section-kicker">The five disciplines</p>
      <h2 id="catalog-heading">Five service categories, one accountable team.</h2>
      <div className="catalog">
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
        <em
          className={`status ${availabilityTone} ${service.availability.toLowerCase()}`}
          aria-label={availabilityLabel}
        >
          {availabilityLabel}
        </em>
      </div>

      <p className="category">{service.category}</p>
      <h2>{service.name}</h2>

      <p className="problem">{service.customerProblem}</p>

      <p className="outcome-label">Customer outcome</p>
      <p className="outcome">{service.customerOutcome}</p>

      <dl className="service-details">
        <div>
          <dt>What you provide</dt>
          <dd>
            <ul>
              {service.customerProvides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>The Agency performs</dt>
          <dd>
            <ul>
              {service.agencyPerforms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Human checkpoints</dt>
          <dd>
            <ul>
              {service.humanCheckpoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Typical deliverables</dt>
          <dd>
            <ul>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="card-meta">
        <span aria-label={availabilityLabel}>{availabilityLabel}</span>
        <span>Human review required</span>
      </div>

      {service.detailHref && (
        <a
          href={service.detailHref}
          className="card-action"
          aria-label={`View service details for ${service.name}`}
        >
          Learn how it works <span aria-hidden="true">→</span>
        </a>
      )}
      {!service.detailHref && service.availability === "PLANNED" && (
        <span className="card-action card-action--disabled" aria-label={`Service ${service.name} is planned`}>
          Coming soon <span aria-hidden="true">→</span>
        </span>
      )}
    </article>
  );
}

function PrototypeDisclosure() {
  return (
    <section
      className="prototype-disclosure editorial-section"
      aria-labelledby="prototype-heading"
    >
      <p className="section-kicker">Where the platform experience lives</p>
      <h2 id="prototype-heading">See how the platform experience works.</h2>
      <p>
        The BBA Publisher prototype demonstrates how a customer will create a
        Project, provide Editorial Context, follow a coordinated AI team,
        review key decisions, and receive a final delivery package.
      </p>
      <p>
        <a
          href="https://dev.bba.country"
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-link"
        >
          Explore the Publisher prototype <span aria-hidden="true">→</span>
        </a>
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

function ServiceVsTechnology() {
  return (
    <section
      className="service-vs-technology"
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
