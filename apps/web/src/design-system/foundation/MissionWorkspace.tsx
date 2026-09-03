import { useState } from "react";
import { Check, FileText, Info, LockSimple, Warning } from "@phosphor-icons/react";
import { Button, Feedback, Modal, Panel, StatusBadge, Table } from "@bba/ui";
import { AuditTimeline, LineageRail, MetadataStrip, PageHeader, StatusLegend } from "./CanonicalPatterns.js";
import { auditFixture, lineageFixture, missionFixture, workforceFixture } from "./fixtures.js";

type Decision = "approve" | "adjust" | "reject";

const decisionLabels: Record<Decision, string> = {
  approve: "Aprovar Institutional Asset",
  adjust: "Solicitar ajustes",
  reject: "Rejeitar Institutional Asset",
};

export function MissionWorkspace() {
  const [decision, setDecision] = useState<Decision>("approve");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const recordDecision = () => {
    setRecorded(true);
    setReviewOpen(false);
  };

  return <div className="foundation-page foundation-mission-page">
    <PageHeader
      eyebrow="Mission · Human Governance"
      title={missionFixture.title}
      description={missionFixture.objective}
      actions={<><Button variant="secondary">Exportar Audit Record</Button><Button onClick={() => setReviewOpen(true)}>Revisar decisão</Button></>}
    />
    {recorded ? <Feedback title="Decisão registrada localmente" tone="success">{decisionLabels[decision]}. Nenhuma publicação externa foi iniciada.</Feedback> : null}
    <MetadataStrip items={[
      { label: "Estado atual", value: <StatusBadge state="awaiting">Aguardando decisão</StatusBadge> },
      { label: "Steward", value: missionFixture.steward },
      { label: "Atualizado", value: "03 set 2026 · 14:32" },
      { label: "Prazo", value: "18 set 2026" },
    ]} />

    <LineageRail items={lineageFixture} />

    <div className="foundation-workspace-grid">
      <article className="foundation-asset-sheet">
        <div className="foundation-sheet-header">
          <div><p className="foundation-kicker">Institutional Asset</p><h2>Institutional Brief — Ciclo 2026.3</h2><span>asset-institutional-brief-2026-3-v1</span></div>
          <StatusBadge state="awaiting">Aguardando decisão</StatusBadge>
        </div>
        <p className="foundation-asset-summary">Uma síntese institucional orientada a decisões, derivada de fontes controladas e preparada pela AI Workforce sob direção da Human Governance.</p>

        <section className="foundation-copy-section">
          <h3>Direcionamento canônico</h3>
          <p>Reforçar a clareza sobre propósito, prioridades e compromissos do próximo ciclo sem converter o Institutional Asset em mensagem promocional ou pressupor distribuição externa.</p>
        </section>

        <section className="foundation-copy-section">
          <h3>Proposições institucionais</h3>
          <ul><li>Coerência entre o propósito declarado e as decisões operacionais.</li><li>Transparência sobre limites, responsabilidades e critérios de avaliação.</li><li>Rastreabilidade entre a Mission e cada derivação futura.</li></ul>
        </section>

        <section className="foundation-canonical-table" aria-labelledby="canonical-title">
          <div className="foundation-subheading"><div><p className="foundation-kicker">Contrato estrutural</p><h3 id="canonical-title">Canonicidade e derivação</h3></div><LockSimple size={19} /></div>
          <Table>
            <thead><tr><th>Objeto</th><th>Papel</th><th>Regra</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>Mission</td><td>Intenção governada</td><td>Origem imutável da cadeia</td><td><StatusBadge state="awaiting">Aberta</StatusBadge></td></tr>
              <tr><td>Institutional Asset</td><td>Registro canônico</td><td>Requer decisão de Steward</td><td><StatusBadge state="awaiting">Em revisão</StatusBadge></td></tr>
              <tr><td>Channel Variant</td><td>Derivação contextual</td><td>Somente após aprovação</td><td><StatusBadge state="neutral">Bloqueada</StatusBadge></td></tr>
              <tr><td>Distribution Package</td><td>Pacote de distribuição</td><td>Não equivale a publicação</td><td><StatusBadge state="neutral">Não constituído</StatusBadge></td></tr>
            </tbody>
          </Table>
        </section>

        <div className="foundation-workforce-sources">
          <section><p className="foundation-kicker">AI Workforce</p><h3>Contribuições concluídas</h3>{workforceFixture.map((item) => <div className="foundation-workforce-row" key={item.role}><Check size={16} weight="bold" /><span><strong>{item.role}</strong><small>{item.contribution}</small></span><StatusBadge state={item.state}>Concluído</StatusBadge></div>)}</section>
          <section><p className="foundation-kicker">Fontes controladas</p><h3>Referências institucionais</h3><ul className="foundation-source-list"><li><FileText size={17} />Plano institucional 2026–2028</li><li><FileText size={17} />Carta de princípios e governança</li><li><FileText size={17} />Relatório de ciclo 2026.2</li></ul></section>
        </div>
      </article>

      <aside className="foundation-governance-rail">
        <Panel eyebrow="Human Governance" title="Decisão pendente">
          <p className="foundation-governance-intro">O Institutional Asset precisa de uma decisão explícita antes que qualquer Channel Variant possa ser preparada.</p>
          <fieldset className="foundation-decision-list"><legend>Decisão do Steward</legend>{(Object.keys(decisionLabels) as Decision[]).map((value) => <label key={value}><input type="radio" name="decision" value={value} checked={decision === value} onChange={() => setDecision(value)} /><span>{decisionLabels[value]}</span></label>)}</fieldset>
          <label className="foundation-note-field">Nota de governança<textarea rows={4} defaultValue="O conteúdo preserva o direcionamento institucional e explicita seus limites de distribuição." /></label>
          <Button onClick={() => setReviewOpen(true)}>Continuar revisão</Button>
        </Panel>
        <Panel eyebrow="Política" title="Contexto aplicável"><ul className="foundation-policy-list"><li><Check size={16} />Fontes institucionais identificadas</li><li><Check size={16} />Lineage completa e rastreável</li><li><Warning size={16} />Channel Variant ainda bloqueada</li></ul></Panel>
        <div className="foundation-publication-notice"><Info size={20} /><div><strong>Distribuição não é publicação</strong><p>Um Distribution Package apenas organiza artefatos. A publicação externa depende de Connector configurado e sucesso registrado.</p></div></div>
      </aside>
    </div>

    <AuditTimeline entries={auditFixture} />
    <StatusLegend />

    <Modal open={reviewOpen} onOpenChange={setReviewOpen} title="Confirmar decisão de governança" description="O registro altera apenas os dados locais de demonstração.">
      <div className="foundation-review-summary"><span>Decisão selecionada</span><strong>{decisionLabels[decision]}</strong><p>O Audit Record será atualizado. Nenhuma Channel Variant será publicada e nenhum Connector será acionado.</p></div>
      <div className="foundation-modal-actions"><Button variant="secondary" onClick={() => setReviewOpen(false)}>Voltar</Button><Button onClick={recordDecision}>Registrar decisão</Button></div>
    </Modal>
  </div>;
}
