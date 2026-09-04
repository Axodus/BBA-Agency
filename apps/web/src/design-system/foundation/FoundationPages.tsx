import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, Info, LockSimple, Plus } from "@phosphor-icons/react";
import {
  Button, Checkbox, EmptyState, Feedback, Field, Input, Modal, Panel, Select, Skeleton, StatusBadge,
  Table, Tabs, Textarea, type SemanticState,
} from "@bba/ui";
import { semanticStateLabels, type FoundationSurface } from "./contracts.js";
import { LineageRail, MetadataStrip, PageHeader, StatusLegend } from "./CanonicalPatterns.js";
import { lineageFixture } from "./fixtures.js";

export const surfaces = {
  assets: { eyebrow: "Biblioteca canônica", title: "Institutional Assets", description: "Registros institucionais controlados, rastreáveis e derivados de uma Mission.", canonicalOwner: "Human Governance", emptyTitle: "Nenhum Institutional Asset neste recorte", emptyDescription: "Ajuste os filtros ou inicie uma Mission para produzir um ativo sob governança.", record: { type: "Institutional Asset", id: "asset-institutional-brief-2026-3-v1", label: "Institutional Brief — Ciclo 2026.3", state: "awaiting", stateLabel: "Aguardando decisão", constraint: "Requer decisão do Steward antes de derivar Channel Variants." } },
  packages: { eyebrow: "Preparação de distribuição", title: "Distribution Packages", description: "Conjuntos de Channel Variants preparados para distribuição, sem pressupor publicação externa.", canonicalOwner: "Steward", emptyTitle: "Nenhum Distribution Package constituído", emptyDescription: "Pacotes só podem ser compostos a partir de Channel Variants aprovadas.", record: { type: "Distribution Package", id: "package-linkedin-brief-not-constituted", label: "DP — LinkedIn Brief Set 2026", state: "neutral", stateLabel: "Não constituído", constraint: "Preparação não equivale a publicação externa." } },
  governance: { eyebrow: "Controle humano", title: "Governança", description: "Fila de decisões, políticas aplicáveis e Audit Records das superfícies BBA.", canonicalOwner: "Steward", emptyTitle: "Nenhuma decisão pendente", emptyDescription: "Novas solicitações aparecerão quando a AI Workforce concluir uma etapa governada.", record: { type: "Steward decision", id: "decision-asset-brief-2026-3", label: "Revisar Institutional Brief", state: "awaiting", stateLabel: "Decisão pendente", constraint: "A decisão é local nesta referência e deve gerar Audit Record em integração futura." } },
  institution: { eyebrow: "Contexto institucional", title: "Instituição", description: "Identidade, princípios e referências que orientam todas as Missions e Institutional Assets.", canonicalOwner: "Instituição", emptyTitle: "Nenhuma referência adicional", emptyDescription: "Inclua documentos controlados para ampliar o contexto institucional.", record: { type: "Institutional reference", id: "institution-acme-principles-v1", label: "Carta de princípios e governança", state: "approved", stateLabel: "Controlada", constraint: "Disponível como referência; alterações exigem governança apropriada." } },
} satisfies Record<string, FoundationSurface>;

export function FoundationOverview() {
  return <div className="foundation-page">
    <PageHeader eyebrow="BBA App UI Foundation" title="Trabalho de IA sob governança humana" description="Uma base visual e estrutural para Missions, Institutional Assets, decisões e registros auditáveis." actions={<Link className="foundation-primary-link" to="/missions/msn-024">Abrir Mission Workspace <ArrowRight size={17} /></Link>} />
    <MetadataStrip items={[{ label: "Instituição", value: "Instituto Acme" }, { label: "Missions ativas", value: "4" }, { label: "Decisões pendentes", value: <StatusBadge state="awaiting">3 aguardando</StatusBadge> }, { label: "Base", value: "Dados locais controlados" }]} />
    <div className="foundation-overview-grid">
      <Panel eyebrow="Referência do produto" title="Mission em foco" action={<StatusBadge state="awaiting">Aguardando decisão</StatusBadge>}><h3>Clareza institucional para o próximo ciclo</h3><p>Estabelecer uma narrativa institucional clara para orientar decisões e comunicações no ciclo 2026.3.</p><Link className="foundation-inline-link" to="/missions/msn-024">Ver workspace <ArrowRight size={15} /></Link></Panel>
      <Panel eyebrow="Human Governance" title="Fila do Steward"><div className="foundation-metric"><strong>03</strong><span>decisões requerem atenção</span></div><ul className="foundation-compact-list"><li><span>Institutional Brief — Ciclo 2026.3</span><StatusBadge state="awaiting">Revisar</StatusBadge></li><li><span>Manifesto institucional</span><StatusBadge state="attention">Atenção</StatusBadge></li></ul></Panel>
    </div>
    <LineageRail items={lineageFixture} />
    <StatusLegend />
  </div>;
}

export function SurfaceTemplate({ surface }: { surface: FoundationSurface }) {
  return <div className="foundation-page">
    <PageHeader eyebrow={surface.eyebrow} title={surface.title} description={surface.description} actions={<Button><Plus size={16} /> Novo registro</Button>} />
    <MetadataStrip items={[{ label: "Responsável canônico", value: surface.canonicalOwner }, { label: "Escopo", value: "Instituto Acme" }, { label: "Origem", value: "Dados locais" }, { label: "Auditabilidade", value: <StatusBadge state="approved">Ativa</StatusBadge> }]} />
    <Panel eyebrow="Registro local controlado" title={surface.record.label} action={<StatusBadge state={surface.record.state}>{surface.record.stateLabel}</StatusBadge>}>
      <Table><caption>Dados de referência visíveis nesta superfície; não há integração externa.</caption><thead><tr><th>Tipo</th><th>ID canônico</th><th>Limite</th><th>Estado</th></tr></thead><tbody><tr><td>{surface.record.type}</td><td>{surface.record.id}</td><td>{surface.record.constraint}</td><td><StatusBadge state={surface.record.state}>{surface.record.stateLabel}</StatusBadge></td></tr></tbody></Table>
    </Panel>
    <Panel eyebrow="Estado vazio" title="Ausência tratada"><EmptyState title={surface.emptyTitle}><p>{surface.emptyDescription}</p><Button variant="secondary" type="button">Entender o contrato</Button></EmptyState></Panel>
    <div className="foundation-state-row"><Panel title="Carregamento"><Skeleton lines={4} /></Panel><Panel title="Falha controlada"><Feedback title="Não foi possível carregar" tone="danger">Tente novamente sem perder o contexto atual.</Feedback></Panel><Panel title="Bloqueio canônico"><Feedback title="Ação indisponível">Uma decisão de Human Governance é necessária.</Feedback></Panel></div>
  </div>;
}

export function AccountPage() {
  return <div className="foundation-page"><PageHeader eyebrow="Conta" title="Perfil do Steward" description="Preferências pessoais e contexto de atuação. A autenticação real permanece fora deste escopo." />
    <div className="foundation-form-grid"><Panel eyebrow="Identidade local" title="Dados do perfil"><form className="foundation-form" onSubmit={(event) => event.preventDefault()}><Field label="Nome"><Input defaultValue="Ana Lemos" /></Field><Field label="Função"><Input defaultValue="Steward institucional" /></Field><Field label="E-mail de demonstração" hint="Não é utilizado para autenticação."><Input type="email" defaultValue="ana.lemos@example.invalid" /></Field><Button>Salvar preferências</Button></form></Panel><Panel eyebrow="Permissões preparadas" title="Escopo de governança"><ul className="foundation-permission-list"><li><Check size={17} />Revisar Institutional Assets</li><li><Check size={17} />Registrar decisões no Audit Record</li><li><LockSimple size={17} />Gerenciar Connectors — não disponível</li></ul></Panel></div>
  </div>;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("interface");
  return <div className="foundation-page"><PageHeader eyebrow="Configurações" title="Preferências do aplicativo" description="Ajustes locais de interface, governança e notificações, sem segredos ou configuração de infraestrutura." />
    <Tabs label="Seções de configuração" activeId={activeTab} onChange={setActiveTab} items={[{ id: "interface", label: "Interface", content: <div className="foundation-settings-panel"><Field label="Densidade"><Select defaultValue="comfortable"><option value="comfortable">Confortável</option><option value="compact">Compacta</option></Select></Field><Field label="Idioma"><Select defaultValue="pt-BR"><option value="pt-BR">Português (Brasil)</option><option value="en">English</option></Select></Field><Button>Salvar configurações</Button></div> }, { id: "governance", label: "Governança", content: <Feedback title="Políticas institucionais">As regras são somente exibidas nesta referência e não podem ser alteradas por esta interface.</Feedback> }, { id: "notifications", label: "Notificações", content: <div className="foundation-settings-panel"><Checkbox defaultChecked label="Avisar quando uma decisão de Steward estiver pendente" /><Checkbox defaultChecked label="Avisar quando uma execução local falhar" /><Checkbox label="Resumir atualizações da AI Workforce" /><Button variant="secondary">Salvar preferências de notificação</Button></div> }]} />
  </div>;
}

export function UiKitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="foundation-page"><PageHeader eyebrow="Design System / UI SDK" title="UI Kit BBA" description="Tokens, estados e componentes desacoplados de endpoints, prontos para reutilização nas superfícies do app." />
    <Panel eyebrow="Semântica" title="Estados de domínio"><p className="foundation-component-description">Cada estado combina marcador e rótulo, para que cor nunca seja o único sinal operacional.</p><div className="foundation-component-row">{(Object.entries(semanticStateLabels) as Array<[SemanticState, string]>).map(([state, label]) => <StatusBadge state={state} key={state}>{label}</StatusBadge>)}</div></Panel>
    <div className="foundation-component-grid"><Panel title="Ações"><div className="foundation-component-stack"><Button>Primária</Button><Button variant="secondary">Secundária</Button><Button variant="ghost">Discreta</Button><Button variant="danger">Rejeitar</Button><Button disabled>Indisponível</Button></div></Panel><Panel title="Campos"><div className="foundation-form"><Field label="Título" hint="Mensagem de ajuda objetiva."><Input placeholder="Nome canônico" /></Field><Field label="Estado"><Select><option>Aguardando decisão</option><option>Aprovado</option></Select></Field><Field label="Nota de governança"><Textarea rows={3} /></Field></div></Panel><Panel title="Feedback"><div className="foundation-component-stack"><Feedback title="Ação concluída" tone="success">Registro salvo localmente.</Feedback><Feedback title="Atenção">Decisão necessária.</Feedback><Feedback title="Falha visível" tone="danger">A operação não foi concluída.</Feedback></div></Panel></div>
    <Panel eyebrow="Dados estruturados" title="Tabela"><Table><thead><tr><th>Objeto</th><th>ID canônico</th><th>Estado</th></tr></thead><tbody><tr><td>Mission</td><td>mission-institutional-clarity-2026-3</td><td><StatusBadge state="running">Em andamento</StatusBadge></td></tr><tr><td>Institutional Asset</td><td>asset-institutional-brief-2026-3-v1</td><td><StatusBadge state="awaiting">Aguardando decisão</StatusBadge></td></tr></tbody></Table></Panel>
    <Panel eyebrow="Composição" title="Modal, vazio e loading"><div className="foundation-component-row"><Button onClick={() => setModalOpen(true)}>Abrir modal</Button><span className="foundation-inline-note"><Info size={17} /> Foco retorna ao acionador após o fechamento.</span></div><Modal open={modalOpen} onOpenChange={setModalOpen} title="Padrão de decisão" description="Modais mantêm contexto, descrição e ações explícitas."><p>Use para decisões que exigem confirmação sem ocultar suas consequências.</p><div className="foundation-modal-actions"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={() => setModalOpen(false)}>Confirmar</Button></div></Modal></Panel>
  </div>;
}
