import { Link } from "react-router-dom";
import { services, availabilityLabels } from "../content/services.js";

export function ServiceDetail() {
  const service = services[0]!;

  return (
    <main className="page-shell product-page">
      <Link to="/services" className="back-link">
        ← All services
      </Link>

      <div className="product-hero">
        <div>
          <p className="section-kicker">
            {service.category} / {availabilityLabels[service.availability]}
          </p>
          <h1>{service.name}</h1>
          <p className="product-outcome">{service.customerOutcome}</p>

          <p>
            This page explains how {service.name} operates inside the
            functional BBA platform. The operational experience is hosted at
            the external prototype. This static surface does not create
            projects, execute work, or make backend calls.
          </p>

          {service.prototypeHref && (
            <a
              href={service.prototypeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="arrow-link"
            >
              Explore the prototype <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        <div className="package-preview">
          <span>Final package</span>
          <strong>
            {service.category === "Publication Strategy"
              ? "Editorial\nPackage"
              : "Delivery\nPackage"}
          </strong>
          <small>
            {service.deliverables.slice(0, 4).join(" · ")}
          </small>
          <i>Illustrative — not generated from a live run</i>
        </div>
      </div>

      <div className="product-facts">
        <dl>
          <dt>You provide</dt>
          <dd>
            <ul>
              {service.customerProvides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>The Agency performs</dt>
          <dd>
            <ul>
              {service.agencyPerforms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>You review</dt>
          <dd>
            <ul>
              {service.humanCheckpoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>What you receive</dt>
          <dd>
            <ul>
              {service.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>

      <section className="pipeline-section" aria-labelledby="detail-process-heading">
        <p className="section-kicker">How the work happens</p>
        <h2 id="detail-process-heading">
          A coordinated team, not a collection of chatbots.
        </h2>
        <div className="pipeline">
          {[
            "Understand context",
            "Build editorial core",
            "Plan channels",
            "Produce content",
            "Review consistency",
            "Prepare delivery",
          ].map((x, i) => (
            <div
              key={x}
              className={i === 1 || i === 4 ? "checkpoint" : "agency-stage"}
            >
              <span>0{i + 1}</span>
              <strong>{x}</strong>
              <p>
                {i === 1 || i === 4 ? (
                  <>Human checkpoint — <em>your approval is required</em></>
                ) : (
                  "Agency team"
                )}
              </p>
            </div>
          ))}
        </div>
        <p className="pipeline-note">
          This sequence illustrates the prototype flow. No operational action
          occurs on this static page.
        </p>
      </section>
    </main>
  );
}
