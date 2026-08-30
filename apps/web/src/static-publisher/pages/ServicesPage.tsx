import { NavLink } from "react-router-dom";
import { serviceProducts } from "../fixtures/products.js";

export function ServicesPage() {
  return <div className="agency-page services-page">
    <header className="agency-page-header"><div><p className="agency-kicker">Agency services</p><h1>Choose the outcome.</h1><p>Five disciplines share one editorial, human-directed operating model. Publisher is the only executable reference service in this prototype.</p></div><NavLink className="agency-primary" to="/services/publisher/new">Start a Project</NavLink></header>
    <section className="agency-service-grid" aria-label="Agency disciplines">{serviceProducts.map((service, index) => <article className={service.status === "AVAILABLE" ? "available" : "planned"} key={service.id}><div><span>0{index + 1} / {service.category}</span><em>{service.status === "AVAILABLE" ? "Available" : "Planned"}</em></div><h2>{service.name}</h2><p>{service.outcome}</p><small>{service.deliverables}</small>{service.status === "AVAILABLE" ? <NavLink to="/services/publisher">View service →</NavLink> : <span className="agency-muted">Planned discipline — no simulated workflow</span>}</article>)}</section>
  </div>;
}
