import { Badge, Card, Link } from "@bba/ui";

const services = [
  { name: "Planejar publicações", description: "Transforme seu Context Editorial em uma estratégia e conteúdos coerentes para Blog, LinkedIn e Instagram.", available: true },
  { name: "Criar campanha", description: "Planejamento e produção coordenada de uma campanha.", available: false },
  { name: "Escrever artigo", description: "Pesquisa, redação e revisão de conteúdo científico ou editorial.", available: false },
  { name: "Elaborar proposta", description: "Composição assistida de propostas e documentos institucionais.", available: false },
  { name: "Pesquisar mercado", description: "Pesquisa estruturada com fontes e síntese orientada a decisões.", available: false },
] as const;

export function AgencyHomePage() {
  return <section className="bba-page agency-home"><header className="agency-hero"><span className="bba-page__eyebrow">BBA Agency</span><h1>How can we help?</h1><p>Choose a service. Nossa equipe coordenada de agentes transforma seu contexto em entregáveis prontos para revisão e uso.</p><div><Link className="bba-button bba-button--primary" to="/projects/new">Começar novo Project</Link><Link to="/projects">Ver Projects</Link></div></header><div className="bba-grid" aria-label="Agency services">{services.map((service) => <Card key={service.name}><div className="agency-service-heading"><h2>{service.name}</h2><Badge>{service.available ? "Available" : "Coming soon"}</Badge></div><p>{service.description}</p>{service.available ? <Link to="/projects/new">Criar Project</Link> : <span className="agency-unavailable">Not available in this prototype</span>}</Card>)}</div><Card><span className="bba-page__eyebrow">What you get</span><h2>Um Pacote Editorial, not a collection of prompts</h2><p>Um único Context Editorial é convertido em estratégia, conteúdo por canal, revisão de consistência e uma decisão humana rastreável. No external publication happens in this prototype.</p></Card></section>;
}

