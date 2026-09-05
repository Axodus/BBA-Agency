import { useState } from "react";
import { Check, FileText, Info, LockSimple, Warning } from "@phosphor-icons/react";
import { Button, Feedback, Modal, Panel, StatusBadge, Table } from "@bba/ui";
import { AuditTimeline, LineageRail, MetadataStrip, PageHeader, StatusLegend } from "./CanonicalPatterns.js";
import { auditFixture, lineageFixture, missionFixture, workforceFixture } from "./fixtures.js";

type Decision = "approve" | "adjust" | "reject";

const decisionLabels: Record<Decision, string> = {
  approve: "Approve Institutional Asset",
  adjust: "Request changes",
  reject: "Reject Institutional Asset",
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
      actions={<><Button variant="secondary">Export Audit Record</Button><Button onClick={() => setReviewOpen(true)}>Review decision</Button></>}
    />
    {recorded ? <Feedback title="Decision recorded locally" tone="success">{decisionLabels[decision]}. No external publication was initiated.</Feedback> : null}
    <MetadataStrip items={[
      { label: "Current state", value: <StatusBadge state="awaiting">Awaiting decision</StatusBadge> },
      { label: "Steward", value: missionFixture.steward },
      { label: "Updated", value: "Sep 3, 2026 · 2:32 PM" },
      { label: "Due date", value: "Sep 18, 2026" },
    ]} />

    <LineageRail items={lineageFixture} />

    <div className="foundation-workspace-grid">
      <article className="foundation-asset-sheet">
        <div className="foundation-sheet-header">
          <div><p className="foundation-kicker">Institutional Asset</p><h2>Institutional Brief — Cycle 2026.3</h2><span>asset-institutional-brief-2026-3-v1</span></div>
          <StatusBadge state="awaiting">Awaiting decision</StatusBadge>
        </div>
        <p className="foundation-asset-summary">A decision-oriented institutional synthesis derived from controlled sources and prepared by the AI Workforce under Human Governance direction.</p>

        <section className="foundation-copy-section">
          <h3>Canonical direction</h3>
          <p>Strengthen clarity about the next cycle's purpose, priorities, and commitments without turning the Institutional Asset into a promotional message or assuming external distribution.</p>
        </section>

        <section className="foundation-copy-section">
          <h3>Institutional propositions</h3>
          <ul><li>Consistency between the stated purpose and operational decisions.</li><li>Transparency about constraints, responsibilities, and evaluation criteria.</li><li>Traceability between the Mission and every future derivation.</li></ul>
        </section>

        <section className="foundation-canonical-table" aria-labelledby="canonical-title">
          <div className="foundation-subheading"><div><p className="foundation-kicker">Structural contract</p><h3 id="canonical-title">Canonical structure and derivation</h3></div><LockSimple size={19} /></div>
          <Table>
            <thead><tr><th>Object</th><th>Role</th><th>Rule</th><th>State</th></tr></thead>
            <tbody>
              <tr><td>Mission</td><td>Governed intent</td><td>Immutable origin of the lineage</td><td><StatusBadge state="awaiting">Open</StatusBadge></td></tr>
              <tr><td>Institutional Asset</td><td>Canonical record</td><td>Requires a Steward decision</td><td><StatusBadge state="awaiting">Under review</StatusBadge></td></tr>
              <tr><td>Channel Variant</td><td>Contextual derivation</td><td>Only after approval</td><td><StatusBadge state="neutral">Blocked</StatusBadge></td></tr>
              <tr><td>Distribution Package</td><td>Distribution package</td><td>Does not constitute publication</td><td><StatusBadge state="neutral">Not created</StatusBadge></td></tr>
            </tbody>
          </Table>
        </section>

        <div className="foundation-workforce-sources">
          <section><p className="foundation-kicker">AI Workforce</p><h3>Completed contributions</h3>{workforceFixture.map((item) => <div className="foundation-workforce-row" key={item.role}><Check size={16} weight="bold" /><span><strong>{item.role}</strong><small>{item.contribution}</small></span><StatusBadge state={item.state}>Completed</StatusBadge></div>)}</section>
          <section><p className="foundation-kicker">Controlled sources</p><h3>Institutional references</h3><ul className="foundation-source-list"><li><FileText size={17} />Institutional plan 2026–2028</li><li><FileText size={17} />Principles and governance charter</li><li><FileText size={17} />Cycle report 2026.2</li></ul></section>
        </div>
      </article>

      <aside className="foundation-governance-rail">
        <Panel eyebrow="Human Governance" title="Pending decision">
          <p className="foundation-governance-intro">The Institutional Asset requires an explicit decision before any Channel Variant can be prepared.</p>
          <fieldset className="foundation-decision-list"><legend>Steward decision</legend>{(Object.keys(decisionLabels) as Decision[]).map((value) => <label key={value}><input type="radio" name="decision" value={value} checked={decision === value} onChange={() => setDecision(value)} /><span>{decisionLabels[value]}</span></label>)}</fieldset>
          <label className="foundation-note-field">Governance note<textarea rows={4} defaultValue="The content preserves institutional direction and makes its distribution constraints explicit." /></label>
          <Button onClick={() => setReviewOpen(true)}>Continue review</Button>
        </Panel>
        <Panel eyebrow="Policy" title="Applicable context"><ul className="foundation-policy-list"><li><Check size={16} />Institutional sources identified</li><li><Check size={16} />Complete and traceable lineage</li><li><Warning size={16} />Channel Variant remains blocked</li></ul></Panel>
        <div className="foundation-publication-notice"><Info size={20} /><div><strong>Distribution is not publication</strong><p>A Distribution Package only organizes artifacts. External publication requires a configured Connector and a recorded success.</p></div></div>
      </aside>
    </div>

    <AuditTimeline entries={auditFixture} />
    <StatusLegend />

    <Modal open={reviewOpen} onOpenChange={setReviewOpen} title="Confirm governance decision" description="This record changes local demonstration data only.">
      <div className="foundation-review-summary"><span>Selected decision</span><strong>{decisionLabels[decision]}</strong><p>The Audit Record will be updated. No Channel Variant will be published and no Connector will be triggered.</p></div>
      <div className="foundation-modal-actions"><Button variant="secondary" onClick={() => setReviewOpen(false)}>Back</Button><Button onClick={recordDecision}>Record decision</Button></div>
    </Modal>
  </div>;
}
