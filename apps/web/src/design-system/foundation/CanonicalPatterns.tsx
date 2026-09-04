import type { ComponentType, ReactNode } from "react";
import { FileText, Flag, LockSimple, Package, Target } from "@phosphor-icons/react";
import { Lineage, StatusBadge, type LineageItem, type SemanticState } from "@bba/ui";
import type { AuditEntry, CanonicalReference } from "./contracts.js";

type FoundationIcon = ComponentType<{ size?: number; weight?: "regular" | "bold" }>;

const entityIcons: Record<CanonicalReference["type"], FoundationIcon> = {
  Mission: Target,
  "Institutional Asset": FileText,
  "Channel Variant": Flag,
  "Distribution Package": Package,
  "Audit Record": LockSimple,
};

export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return <header className="foundation-page-header">
    <div>
      <p className="foundation-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="foundation-lead">{description}</p>
    </div>
    {actions ? <div className="foundation-page-actions">{actions}</div> : null}
  </header>;
}

export function MetadataStrip({ items }: { items: ReadonlyArray<{ label: string; value: ReactNode }> }) {
  return <dl className="foundation-metadata-strip">
    {items.map((item) => <div key={item.label}>
      <dt>{item.label}</dt>
      <dd>{item.value}</dd>
    </div>)}
  </dl>;
}

export function LineageRail({ items }: { items: ReadonlyArray<CanonicalReference> }) {
  const lineageItems: readonly LineageItem[] = items.map((item) => {
    const Icon = entityIcons[item.type];
    return { ...item, icon: <Icon size={18} weight="bold" /> };
  });
  return <Lineage title="Cadeia institucional" lockLabel="lineage preservada" items={lineageItems} />;
}

export function AuditTimeline({ entries }: { entries: ReadonlyArray<AuditEntry> }) {
  return <section className="foundation-audit" aria-labelledby="audit-title">
    <div className="foundation-section-heading">
      <div><p className="foundation-kicker">Auditabilidade</p><h2 id="audit-title">Audit Record</h2></div>
      <span className="foundation-record-count">{entries.length} registros locais</span>
    </div>
    <ol>
      {entries.map((entry) => <li key={entry.id}>
        <time dateTime={entry.at}>{new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(entry.at))}</time>
        <div className="foundation-audit-marker" aria-hidden="true" />
        <div><strong>{entry.action}</strong><p>{entry.objectId}</p><small>{entry.actor}</small></div>
      </li>)}
    </ol>
  </section>;
}

const legend: ReadonlyArray<{ state: SemanticState; label: string }> = [
  { state: "neutral", label: "Neutro" },
  { state: "running", label: "Em andamento" },
  { state: "awaiting", label: "Aguardando decisão" },
  { state: "approved", label: "Aprovado" },
  { state: "rejected", label: "Rejeitado" },
  { state: "failed", label: "Falho" },
  { state: "attention", label: "Atenção" },
];

export function StatusLegend() {
  return <section className="foundation-status-legend" aria-label="Legenda dos estados semânticos">
    <span>Estados</span>
    {legend.map((item) => <StatusBadge key={item.state} state={item.state}>{item.label}</StatusBadge>)}
  </section>;
}
