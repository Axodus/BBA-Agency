type FilterValue = string | number | boolean | null;
export type ProductFilter = Readonly<Record<string, FilterValue | undefined>>;

export function canonicalFilter(filter: ProductFilter = {}): readonly (readonly [string, FilterValue])[] {
  return Object.entries(filter).filter((entry): entry is [string, FilterValue] => entry[1] !== undefined).sort(([left], [right]) => left.localeCompare(right));
}

const detail = (name: string) => (tenantId: string, id: string) => [name, tenantId, "detail", id] as const;
const list = (name: string) => (tenantId: string, filter: ProductFilter = {}) => [name, tenantId, "list", canonicalFilter(filter)] as const;

export const missionKeys = { all: (tenantId: string) => ["missions", tenantId] as const, detail: detail("missions") };
export const authorityKeys = { all: (tenantId: string) => ["authorities", tenantId] as const, detail: detail("authorities") };
export const decisionKeys = { all: (tenantId: string) => ["decisions", tenantId] as const, detail: detail("decisions") };
export const agentKeys = { all: (tenantId: string) => ["agents", tenantId] as const, detail: detail("agents") };
export const executionKeys = { all: (tenantId: string) => ["executions", tenantId] as const, detail: detail("executions") };
export const assetKeys = { all: (tenantId: string) => ["assets", tenantId] as const, list: list("assets"), detail: detail("assets") };
export const knowledgeKeys = { all: (tenantId: string) => ["knowledge", tenantId] as const, list: list("knowledge"), detail: detail("knowledge") };
export const policyKeys = { all: (tenantId: string) => ["policies", tenantId] as const, list: list("policies"), detail: detail("policies") };
export const workflowKeys = { all: (tenantId: string) => ["workflows", tenantId] as const, detail: detail("workflows"), execution: (tenantId: string, workflowId: string | null, executionId: string) => ["workflow-executions", tenantId, workflowId ?? "unscoped", executionId] as const, executions: (tenantId: string) => ["workflow-executions", tenantId] as const };
export const reviewKeys = { all: (tenantId: string) => ["reviews", tenantId] as const, detail: detail("reviews") };
export const publicationKeys = { all: (tenantId: string) => ["publications", tenantId] as const, detail: detail("publications") };
export const connectorKeys = { all: (tenantId: string) => ["connectors", tenantId] as const, detail: detail("connectors"), execution: detail("connector-executions"), executions: (tenantId: string) => ["connector-executions", tenantId] as const };
