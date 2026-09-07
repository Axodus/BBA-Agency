import { useState } from "react";
import { Check, FileText, Info, LockSimple, Warning } from "@phosphor-icons/react";
import { Button, Feedback, Modal, Panel, StatusBadge, Table, type SemanticState } from "@bba/ui";
import { AuditTimeline, LineageRail, MetadataStrip, PageHeader, StatusLegend } from "./CanonicalPatterns.js";
import { Link, useParams } from "react-router-dom";
import { auditFixture, lineageFixture, missionFixture, workforceFixture } from "./fixtures.js";

type Decision = "approve" | "adjust" | "reject";
interface RecordedDecision { readonly decision: Decision; readonly note: string; readonly at: string }
const decisionStorageKey = "bba.foundation.mission.msn-024.decision";

const decisionLabels: Record<Decision, string> = {
  approve: "Approve Institutional Asset",
  adjust: "Request changes",
  reject: "Reject Institutional Asset",
};

const decisionStates: Record<Decision, SemanticState> = {
  approve: "approved",
  adjust: "attention",
  reject: "rejected",
};

const decisionStateLabels: Record<Decision, string> = {
  approve: "Approved",
  adjust: "Changes requested",
  reject: "Rejected",
};

function storedDecision(): RecordedDecision | undefined {
  const value = sessionStorage.getItem(decisionStorageKey);
  if (value === null) return undefined;
  const record: unknown = JSON.parse(value);
  if (typeof record === "object" && record !== null && "decision" in record && "note" in record && "at" in record
    && (record.decision === "approve" || record.decision === "adjust" || record.decision === "reject")
    && typeof record.note === "string" && typeof record.at === "string" && Number.isFinite(Date.parse(record.at))) {
    return { decision: record.decision, note: record.note, at: record.at };
  }
  throw new Error("Invalid local decision record");
}

function loadDecision(): { record: RecordedDecision | undefined; error: string | undefined } {
  try { return { record: storedDecision(), error: undefined }; }
  catch { return { record: undefined, error: "The local Audit Record could not be loaded. Decision recording is blocked to preserve existing evidence." }; }
}

function entriesWithDecision(record: RecordedDecision | undefined) {
  if (record === undefined) return auditFixture;
  return [{
    id: `audit-decision-${record.decision}`,
    at: record.at,
    actor: missionFixture.steward,
    action: `${decisionLabels[record.decision]}. ${record.note || "No governance note provided."}`,
    objectId: "asset-institutional-brief-2026-3-v1",
  }, ...auditFixture];
}

export function MissionWorkspace() {
  const { missionId } = useParams();
  const [initial] = useState(loadDecision);
  const [decision, setDecision] = useState<Decision>(initial.record?.decision ?? "approve");
  const [governanceNote, setGovernanceNote] = useState(initial.record?.note ?? "The content preserves institutional direction and makes its distribution constraints explicit.");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [recordedDecision, setRecordedDecision] = useState<RecordedDecision | undefined>(initial.record);
  const [storageError, setStorageError] = useState(initial.error);
  const auditEntries = entriesWithDecision(recordedDecision);

  const recordDecision = () => {
    if (recordedDecision || storageError) return;
    const record = { decision, note: governanceNote.trim(), at: new Date().toISOString() };
    try { sessionStorage.setItem(decisionStorageKey, JSON.stringify(record)); }
    catch { setStorageError("The local Audit Record could not be saved. The decision was not recorded; keep the governance note and retry when browser storage is available."); setReviewOpen(false); return; }
    setRecordedDecision(record);
    setReviewOpen(false);
  };

  const recorded = recordedDecision?.decision;
  const assetState = recorded === undefined ? "awaiting" : decisionStates[recorded];
  const assetStateLabel = recorded === undefined ? "Awaiting decision" : decisionStateLabels[recorded];
  const missionState: SemanticState = recorded === undefined ? "awaiting" : recorded === "approve" ? "running" : "blocked";
  const missionStateLabel = recorded === undefined ? "Awaiting decision" : recorded === "approve" ? "In progress" : "Blocked";
  const lineage = lineageFixture.map((item) => item.type === "Institutional Asset" ? { ...item, state: assetState, stateLabel: assetStateLabel }
    : item.type === "Mission" ? { ...item, state: missionState, stateLabel: missionStateLabel } : item);

  if (missionId !== undefined && missionId !== "msn-024") return <div className="foundation-page"><PageHeader eyebrow="Mission" title="Mission not found" description="This local reference contains only msn-024." /><Link to="/missions">Return to Missions</Link></div>;

  return <div className="foundation-page foundation-mission-page">
    <PageHeader
      eyebrow="Mission · Human Governance"
      title={missionFixture.title}
      description={missionFixture.objective}
      actions={<><Button aria-label="Export Audit Record unavailable in local reference" disabled title="Audit export requires a configured integration." variant="secondary">Export Audit Record</Button><Button disabled={recordedDecision !== undefined || storageError !== undefined} onClick={() => setReviewOpen(true)}>{recordedDecision === undefined ? "Review decision" : "Decision recorded"}</Button></>}
    />
    <p>Local reference: decisions persist in this browser tab only. Clearing browser storage removes them. No server audit service is connected.</p>
    {storageError ? <><Feedback title="Decision recording blocked" tone="danger">{storageError}</Feedback><Button variant="secondary" onClick={() => {
      const next = loadDecision();
      setStorageError(next.error);
      if (next.record) { setRecordedDecision(next.record); setDecision(next.record.decision); setGovernanceNote(next.record.note); }
    }}>Retry local storage</Button></> : null}
    {recordedDecision ? <Feedback title="Decision recorded locally" tone="success">{decisionLabels[recordedDecision.decision]}. The Audit Record was updated. No external publication was initiated.</Feedback> : null}
    <MetadataStrip items={[
      { label: "Mission state", value: <StatusBadge state={missionState}>{missionStateLabel}</StatusBadge> },
      { label: "Steward", value: missionFixture.steward },
      { label: "Updated", value: recordedDecision ? new Date(recordedDecision.at).toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }) : "Sep 3, 2026 · 2:32 PM" },
      { label: "Due date", value: "Sep 18, 2026" },
    ]} />

    <LineageRail items={lineage} />

    <div className="foundation-workspace-grid">
      <article className="foundation-asset-sheet">
        <div className="foundation-sheet-header">
          <div><p className="foundation-kicker">Institutional Asset</p><h2>Institutional Brief — Cycle 2026.3</h2><span>asset-institutional-brief-2026-3-v1</span></div>
          <StatusBadge state={assetState}>{assetStateLabel}</StatusBadge>
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
              <tr><td>Mission</td><td>Governed intent</td><td>Immutable origin of the lineage</td><td><StatusBadge state={missionState}>{missionStateLabel}</StatusBadge></td></tr>
              <tr><td>Institutional Asset</td><td>Canonical record</td><td>Requires a Steward decision</td><td><StatusBadge state={assetState}>{assetStateLabel}</StatusBadge></td></tr>
              <tr><td>Channel Variant</td><td>Contextual derivation</td><td>Only after approval</td><td><StatusBadge state="blocked">Blocked</StatusBadge></td></tr>
              <tr><td>Distribution Package</td><td>Distribution package</td><td>Does not constitute publication</td><td><StatusBadge state="blocked">Blocked</StatusBadge></td></tr>
            </tbody>
          </Table>
        </section>

        <div className="foundation-workforce-sources">
          <section><p className="foundation-kicker">AI Workforce</p><h3>Completed contributions</h3>{workforceFixture.map((item) => <div className="foundation-workforce-row" key={item.role}><Check size={16} weight="bold" /><span><strong>{item.role}</strong><small>{item.contribution}</small></span><StatusBadge state={item.state}>Completed</StatusBadge></div>)}</section>
          <section><p className="foundation-kicker">Controlled sources</p><h3>Institutional references</h3><ul className="foundation-source-list"><li><FileText size={17} />Institutional plan 2026–2028</li><li><FileText size={17} />Principles and governance charter</li><li><FileText size={17} />Cycle report 2026.2</li></ul></section>
        </div>
      </article>

      <aside className="foundation-governance-rail">
        <Panel eyebrow="Human Governance" title={recordedDecision ? "Recorded decision" : "Pending decision"}>
          <p className="foundation-governance-intro">The Institutional Asset requires an explicit decision before any Channel Variant can be prepared.</p>
          <fieldset className="foundation-decision-list" disabled={recordedDecision !== undefined || storageError !== undefined}><legend>Steward decision</legend>{(Object.keys(decisionLabels) as Decision[]).map((value) => <label key={value}><input type="radio" name="decision" value={value} checked={decision === value} onChange={() => setDecision(value)} /><span>{decisionLabels[value]}</span></label>)}</fieldset>
          <label className="foundation-note-field">Governance note<textarea disabled={recordedDecision !== undefined || storageError !== undefined} rows={4} value={governanceNote} onChange={(event) => setGovernanceNote(event.target.value)} /></label>
          <Button disabled={recordedDecision !== undefined || storageError !== undefined} onClick={() => setReviewOpen(true)}>{recordedDecision === undefined ? "Continue review" : "Decision recorded"}</Button>
        </Panel>
        <Panel eyebrow="Policy" title="Applicable context"><ul className="foundation-policy-list"><li><Check size={16} />Institutional sources identified</li><li><Check size={16} />Complete and traceable lineage</li><li><Warning size={16} />Channel Variant creation is unavailable in this reference</li></ul></Panel>
        <div className="foundation-publication-notice"><Info size={20} /><div><strong>Distribution is not publication</strong><p>A Distribution Package only organizes artifacts. External publication requires a configured Connector and a recorded success.</p></div></div>
      </aside>
    </div>

    <AuditTimeline entries={auditEntries} />
    <StatusLegend />

    <Modal open={reviewOpen} onOpenChange={setReviewOpen} title="Confirm governance decision" description="This record changes local demonstration data only.">
      <div className="foundation-review-summary"><span>Selected decision</span><strong>{decisionLabels[decision]}</strong><p>{governanceNote}</p><p>The Audit Record will be updated with the governance note. No Channel Variant will be published and no Connector will be triggered.</p></div>
      <div className="foundation-modal-actions"><Button variant="secondary" onClick={() => setReviewOpen(false)}>Back</Button><Button onClick={recordDecision}>Record decision</Button></div>
    </Modal>
  </div>;
}
