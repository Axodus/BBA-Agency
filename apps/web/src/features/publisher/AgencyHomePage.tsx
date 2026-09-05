import { Badge, Card, Link } from "@bba/ui";

const services = [
  { name: "Plan publications", description: "Turn your Editorial Context into a coherent strategy and content for Blog, LinkedIn, and Instagram.", available: true },
  { name: "Create campaign", description: "Coordinated campaign planning and production.", available: false },
  { name: "Write article", description: "Research, writing, and review of scientific or editorial content.", available: false },
  { name: "Develop proposal", description: "Assisted composition of proposals and institutional documents.", available: false },
  { name: "Research market", description: "Structured research with sources and decision-oriented synthesis.", available: false },
] as const;

export function AgencyHomePage() {
  return <section className="bba-page agency-home"><header className="agency-hero"><span className="bba-page__eyebrow">BBA Agency</span><h1>How can we help?</h1><p>Choose a service. Our coordinated team of agents turns your context into deliverables ready for review and use.</p><div><Link className="bba-button bba-button--primary" to="/projects/new">Start new Project</Link><Link to="/projects">View Projects</Link></div></header><div className="bba-grid" aria-label="Agency services">{services.map((service) => <Card key={service.name}><div className="agency-service-heading"><h2>{service.name}</h2><Badge>{service.available ? "Available" : "Coming soon"}</Badge></div><p>{service.description}</p>{service.available ? <Link to="/projects/new">Create Project</Link> : <span className="agency-unavailable">Not available in this prototype</span>}</Card>)}</div><Card><span className="bba-page__eyebrow">What you get</span><h2>An Editorial Package, not a collection of prompts</h2><p>A single Editorial Context is converted into strategy, channel content, consistency review, and a traceable human decision. No external publication happens in this prototype.</p></Card></section>;
}
