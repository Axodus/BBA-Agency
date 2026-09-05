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
  assets: { eyebrow: "Canonical library", title: "Institutional Assets", description: "Controlled, traceable institutional records derived from a Mission.", canonicalOwner: "Human Governance", emptyTitle: "No Institutional Assets in this view", emptyDescription: "Adjust the filters or start a Mission to produce a governed asset.", record: { type: "Institutional Asset", id: "asset-institutional-brief-2026-3-v1", label: "Institutional Brief — Cycle 2026.3", state: "awaiting", stateLabel: "Awaiting decision", constraint: "A Steward decision is required before deriving Channel Variants." } },
  packages: { eyebrow: "Distribution preparation", title: "Distribution Packages", description: "Sets of Channel Variants prepared for distribution without assuming external publication.", canonicalOwner: "Steward", emptyTitle: "No Distribution Package created", emptyDescription: "Packages can only be composed from approved Channel Variants.", record: { type: "Distribution Package", id: "package-linkedin-brief-not-constituted", label: "DP — LinkedIn Brief Set 2026", state: "neutral", stateLabel: "Not created", constraint: "Preparation does not constitute external publication." } },
  governance: { eyebrow: "Human control", title: "Governance", description: "Decision queue, applicable policies, and Audit Records for BBA surfaces.", canonicalOwner: "Steward", emptyTitle: "No pending decisions", emptyDescription: "New requests will appear when the AI Workforce completes a governed stage.", record: { type: "Steward decision", id: "decision-asset-brief-2026-3", label: "Review Institutional Brief", state: "awaiting", stateLabel: "Pending decision", constraint: "This decision is local to this reference and will create an Audit Record in a future integration." } },
  institution: { eyebrow: "Institutional context", title: "Institution", description: "Identity, principles, and references that guide every Mission and Institutional Asset.", canonicalOwner: "Institution", emptyTitle: "No additional references", emptyDescription: "Add controlled documents to expand the institutional context.", record: { type: "Institutional reference", id: "institution-acme-principles-v1", label: "Principles and governance charter", state: "approved", stateLabel: "Controlled", constraint: "Available as a reference; changes require appropriate governance." } },
} satisfies Record<string, FoundationSurface>;

export function FoundationOverview() {
  return <div className="foundation-page">
    <PageHeader eyebrow="BBA App UI Foundation" title="AI work under human governance" description="A visual and structural foundation for Missions, Institutional Assets, decisions, and auditable records." actions={<Link className="foundation-primary-link" to="/missions/msn-024">Open Mission Workspace <ArrowRight size={17} /></Link>} />
    <MetadataStrip items={[{ label: "Institution", value: "Acme Institute" }, { label: "Active Missions", value: "4" }, { label: "Pending decisions", value: <StatusBadge state="awaiting">3 awaiting</StatusBadge> }, { label: "Base", value: "Controlled local data" }]} />
    <div className="foundation-overview-grid">
      <Panel eyebrow="Product reference" title="Mission in focus" action={<StatusBadge state="awaiting">Awaiting decision</StatusBadge>}><h3>Institutional clarity for the next cycle</h3><p>Establish a clear institutional narrative to guide decisions and communications in cycle 2026.3.</p><Link className="foundation-inline-link" to="/missions/msn-024">View workspace <ArrowRight size={15} /></Link></Panel>
      <Panel eyebrow="Human Governance" title="Steward queue"><div className="foundation-metric"><strong>03</strong><span>decisions require attention</span></div><ul className="foundation-compact-list"><li><span>Institutional Brief — Cycle 2026.3</span><StatusBadge state="awaiting">Review</StatusBadge></li><li><span>Institutional manifesto</span><StatusBadge state="attention">Attention</StatusBadge></li></ul></Panel>
    </div>
    <LineageRail items={lineageFixture} />
    <StatusLegend />
  </div>;
}

export function SurfaceTemplate({ surface }: { surface: FoundationSurface }) {
  return <div className="foundation-page">
    <PageHeader eyebrow={surface.eyebrow} title={surface.title} description={surface.description} actions={<Button><Plus size={16} /> New record</Button>} />
    <MetadataStrip items={[{ label: "Canonical owner", value: surface.canonicalOwner }, { label: "Scope", value: "Acme Institute" }, { label: "Source", value: "Local data" }, { label: "Auditability", value: <StatusBadge state="approved">Active</StatusBadge> }]} />
    <Panel eyebrow="Controlled local record" title={surface.record.label} action={<StatusBadge state={surface.record.state}>{surface.record.stateLabel}</StatusBadge>}>
      <Table><caption>Reference data visible on this surface; no external integration is active.</caption><thead><tr><th>Type</th><th>Canonical ID</th><th>Constraint</th><th>State</th></tr></thead><tbody><tr><td>{surface.record.type}</td><td>{surface.record.id}</td><td>{surface.record.constraint}</td><td><StatusBadge state={surface.record.state}>{surface.record.stateLabel}</StatusBadge></td></tr></tbody></Table>
    </Panel>
    <Panel eyebrow="Empty state" title="Handled absence"><EmptyState title={surface.emptyTitle}><p>{surface.emptyDescription}</p><Button variant="secondary" type="button">Understand the contract</Button></EmptyState></Panel>
    <div className="foundation-state-row"><Panel title="Loading"><Skeleton lines={4} /></Panel><Panel title="Controlled failure"><Feedback title="Unable to load" tone="danger">Try again without losing the current context.</Feedback></Panel><Panel title="Canonical block"><Feedback title="Action unavailable">A Human Governance decision is required.</Feedback></Panel></div>
  </div>;
}

export function AccountPage() {
  return <div className="foundation-page"><PageHeader eyebrow="Account" title="Steward profile" description="Personal preferences and operating context. Real authentication remains outside this scope." />
    <div className="foundation-form-grid"><Panel eyebrow="Local identity" title="Profile data"><form className="foundation-form" onSubmit={(event) => event.preventDefault()}><Field label="Name"><Input defaultValue="Ana Lemos" /></Field><Field label="Role"><Input defaultValue="Institutional Steward" /></Field><Field label="Demo email" hint="Not used for authentication."><Input type="email" defaultValue="ana.lemos@example.invalid" /></Field><Button>Save preferences</Button></form></Panel><Panel eyebrow="Prepared permissions" title="Governance scope"><ul className="foundation-permission-list"><li><Check size={17} />Review Institutional Assets</li><li><Check size={17} />Record decisions in the Audit Record</li><li><LockSimple size={17} />Manage Connectors — unavailable</li></ul></Panel></div>
  </div>;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("interface");
  return <div className="foundation-page"><PageHeader eyebrow="Settings" title="Application preferences" description="Local interface, governance, and notification settings without secrets or infrastructure configuration." />
    <Tabs label="Settings sections" activeId={activeTab} onChange={setActiveTab} items={[{ id: "interface", label: "Interface", content: <div className="foundation-settings-panel"><Field label="Density"><Select defaultValue="comfortable"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></Select></Field><Field label="Language"><Select defaultValue="en-US"><option value="en-US">English (United States)</option></Select></Field><Button>Save settings</Button></div> }, { id: "governance", label: "Governance", content: <Feedback title="Institutional policies">Rules are display-only in this reference and cannot be changed through this interface.</Feedback> }, { id: "notifications", label: "Notifications", content: <div className="foundation-settings-panel"><Checkbox defaultChecked label="Notify me when a Steward decision is pending" /><Checkbox defaultChecked label="Notify me when a local execution fails" /><Checkbox label="Summarize AI Workforce updates" /><Button variant="secondary">Save notification preferences</Button></div> }]} />
  </div>;
}

export function UiKitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="foundation-page"><PageHeader eyebrow="Design System / UI SDK" title="BBA UI Kit" description="Tokens, states, and components decoupled from endpoints and ready for reuse across app surfaces." />
    <Panel eyebrow="Semantics" title="Domain states"><p className="foundation-component-description">Each state combines a marker and label, so color is never the only operational signal.</p><div className="foundation-component-row">{(Object.entries(semanticStateLabels) as Array<[SemanticState, string]>).map(([state, label]) => <StatusBadge state={state} key={state}>{label}</StatusBadge>)}</div></Panel>
    <div className="foundation-component-grid"><Panel title="Actions"><div className="foundation-component-stack"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Subtle</Button><Button variant="danger">Reject</Button><Button disabled>Unavailable</Button></div></Panel><Panel title="Fields"><div className="foundation-form"><Field label="Title" hint="A concise, useful help message."><Input placeholder="Canonical name" /></Field><Field label="State"><Select><option>Awaiting decision</option><option>Approved</option></Select></Field><Field label="Governance note"><Textarea rows={3} /></Field></div></Panel><Panel title="Feedback"><div className="foundation-component-stack"><Feedback title="Action completed" tone="success">Record saved locally.</Feedback><Feedback title="Attention">A decision is required.</Feedback><Feedback title="Visible failure" tone="danger">The operation did not complete.</Feedback></div></Panel></div>
    <Panel eyebrow="Structured data" title="Table"><Table><thead><tr><th>Object</th><th>Canonical ID</th><th>State</th></tr></thead><tbody><tr><td>Mission</td><td>mission-institutional-clarity-2026-3</td><td><StatusBadge state="running">In progress</StatusBadge></td></tr><tr><td>Institutional Asset</td><td>asset-institutional-brief-2026-3-v1</td><td><StatusBadge state="awaiting">Awaiting decision</StatusBadge></td></tr></tbody></Table></Panel>
    <Panel eyebrow="Composition" title="Modal, empty, and loading"><div className="foundation-component-row"><Button onClick={() => setModalOpen(true)}>Open modal</Button><span className="foundation-inline-note"><Info size={17} /> Focus returns to the trigger after closing.</span></div><Modal open={modalOpen} onOpenChange={setModalOpen} title="Decision pattern" description="Modals preserve context, descriptions, and explicit actions."><p>Use this for decisions that require confirmation without hiding their consequences.</p><div className="foundation-modal-actions"><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Confirm</Button></div></Modal></Panel>
  </div>;
}
