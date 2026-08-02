import { Badge, Card, Link } from "@bba/ui";

const services = [
  { name: "Planejar publicações", description: "Transforme seu Contexto Editorial em uma estratégia e conteúdos coerentes para Blog, LinkedIn e Instagram.", available: true },
  { name: "Criar campanha", description: "Planejamento e produção coordenada de uma campanha.", available: false },
  { name: "Escrever artigo", description: "Pesquisa, redação e revisão de conteúdo científico ou editorial.", available: false },
  { name: "Elaborar proposta", description: "Composição assistida de propostas e documentos institucionais.", available: false },
  { name: "Pesquisar mercado", description: "Pesquisa estruturada com fontes e síntese orientada a decisões.", available: false },
] as const;

export function AgencyHomePage() {
  return <section className="bba-page agency-home"><header className="agency-hero"><span className="bba-page__eyebrow">BBA Agency</span><h1>Como podemos ajudar?</h1><p>Escolha um serviço. Nossa equipe coordenada de agentes transforma seu contexto em entregáveis prontos para revisão e uso.</p><div><Link className="bba-button bba-button--primary" to="/projects/new">Começar novo Projeto</Link><Link to="/projects">Ver Projetos</Link></div></header><div className="bba-grid" aria-label="Serviços da Agency">{services.map((service) => <Card key={service.name}><div className="agency-service-heading"><h2>{service.name}</h2><Badge>{service.available ? "Disponível" : "Em breve"}</Badge></div><p>{service.description}</p>{service.available ? <Link to="/projects/new">Criar Projeto</Link> : <span className="agency-unavailable">Ainda não disponível neste protótipo</span>}</Card>)}</div><Card><span className="bba-page__eyebrow">O que você leva</span><h2>Um Pacote Editorial, não uma coleção de prompts</h2><p>Um único Contexto Editorial é convertido em estratégia, conteúdo por canal, revisão de consistência e uma decisão humana rastreável. Nenhuma publicação externa acontece neste protótipo.</p></Card></section>;
}
