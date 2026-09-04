import type { SemanticState } from "@bba/ui";

export type CanonicalEntity = "Mission" | "Institutional Asset" | "Channel Variant" | "Distribution Package" | "Audit Record";

export interface CanonicalReference {
  readonly type: CanonicalEntity;
  readonly id: string;
  readonly label: string;
  readonly state: SemanticState;
  readonly stateLabel: string;
  readonly locked?: boolean;
}

export interface AuditEntry {
  readonly id: string;
  readonly at: string;
  readonly actor: string;
  readonly action: string;
  readonly objectId: string;
}

export interface WorkforceContribution {
  readonly role: string;
  readonly contribution: string;
  readonly state: SemanticState;
}

export interface FoundationSurface {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly canonicalOwner: string;
  readonly emptyTitle: string;
  readonly emptyDescription: string;
  readonly record: {
    readonly type: string;
    readonly id: string;
    readonly label: string;
    readonly state: SemanticState;
    readonly stateLabel: string;
    readonly constraint: string;
  };
}

export const semanticStateLabels: Readonly<Record<SemanticState, string>> = Object.freeze({
  neutral: "Neutro",
  running: "Em andamento",
  awaiting: "Aguardando decisão",
  approved: "Aprovado",
  rejected: "Rejeitado",
  failed: "Falha",
  attention: "Atenção",
});
