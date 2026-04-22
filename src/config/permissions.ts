// ─────────────────────────────────────────────────────────────
// AXODUS — Permission & Access Control Matrix
// DIRETRIZ 2: Isolamento de contexto (Minimum Privilege)
// ─────────────────────────────────────────────────────────────

/**
 * MCP Tools disponíveis no ecossistema
 */
export type MCPTool =
  | "figma-mcp"
  | "notion-mcp"
  | "meta-ads-api"
  | "google-ads-api"
  | "analytics-ga4"
  | "meta-pixel"
  | "bigquery"
  | "vector-db"
  | "mongo-db";

/**
 * ── Permissões por Agente ────────────────────────────────────
 * Princípio: Zero Trust + Least Privilege
 * Cada agente só acessa o que é absolutamente necessário
 */
export const AGENT_PERMISSIONS: Record<string, MCPTool[]> = {
  // ── ESTRATÉGIA (lê docs, sem execução financeira)
  BriefInterpreter: ["notion-mcp", "vector-db"],
  TrendAnalyst: ["analytics-ga4", "vector-db"],
  BrandStrategist: ["notion-mcp", "vector-db"],
  AudienceProfiler: ["analytics-ga4", "meta-pixel", "vector-db"],
  CampaignPlanner: ["notion-mcp"],

  // ── CRIAÇÃO (lê design, sem acesso a dados de cliente)
  CreativeDirector: ["vector-db"],
  Copywriter: ["vector-db"],
  VisualDesigner: ["figma-mcp", "vector-db"],
  MotionDesigner: ["figma-mcp"],
  UXCreative: ["figma-mcp"],

  // ── PERFORMANCE (acessa métricas, sem acesso a docs internos)
  GrowthHacker: ["analytics-ga4", "meta-pixel", "bigquery"],
  AdsSpecialist: ["meta-ads-api", "google-ads-api"], // ⚠️ Zero Notion!
  DataAnalyst: ["bigquery", "analytics-ga4", "vector-db"],
  AnalyticsAgent: ["analytics-ga4", "meta-pixel", "mongo-db", "vector-db"],
};

/**
 * ── REGRA CRÍTICA ────────────────────────────────────────────
 * Orchestrator é a ÚNICA entidade com acesso total
 * (coordena mas não executa — HITL valida antes de ações financeiras)
 */
export const ORCHESTRATOR_PERMISSIONS: MCPTool[] = [
  "figma-mcp",
  "notion-mcp",
  "meta-ads-api",
  "google-ads-api",
  "analytics-ga4",
  "meta-pixel",
  "bigquery",
  "vector-db",
  "mongo-db",
];

/**
 * ── Definições de Tool por Categoria ──────────────────────────
 * Usado para auditar que tipo de acesso está sendo solicitado
 */
export const TOOL_CATEGORIES = {
  "figma-mcp": "creative" as const,
  "notion-mcp": "docs" as const,
  "meta-ads-api": "execution" as const, // ⚠️ CRÍTICO: requer aprovação
  "google-ads-api": "execution" as const, // ⚠️ CRÍTICO
  "analytics-ga4": "read" as const,
  "meta-pixel": "read" as const,
  "bigquery": "read" as const,
  "vector-db": "read" as const,
  "mongo-db": "read" as const,
} as const;

/**
 * ── Tipos de acesso por categoria ────────────────────────────
 */
export const ACCESS_LEVELS = {
  read: {
    requiresApproval: false,
    requiresLogging: true,
    requiresAudit: false,
  },
  creative: {
    requiresApproval: false,
    requiresLogging: true,
    requiresAudit: false,
  },
  docs: {
    requiresApproval: false,
    requiresLogging: true,
    requiresAudit: true, // docs sensíveis
  },
  execution: {
    requiresApproval: true, // ⚠️ SEMPRE requer HITL
    requiresLogging: true,
    requiresAudit: true,
  },
} as const;

/**
 * ── Validator: Checar se agente pode usar uma tool ────────────
 */
export function canAgentUseTool(agent: string, tool: MCPTool): boolean {
  const permissions = AGENT_PERMISSIONS[agent];
  if (!permissions) {
    console.warn(`[PERMISSION] Agent ${agent} não registrado no matriz de permissões`);
    return false;
  }
  return permissions.includes(tool);
}

/**
 * ── Auditor: Classificar nível de acesso ─────────────────────
 */
export function getToolAccessLevel(tool: MCPTool) {
  const category = TOOL_CATEGORIES[tool];
  return ACCESS_LEVELS[category];
}

/**
 * ── Error: Permissão negada ──────────────────────────────────
 */
export class PermissionDeniedError extends Error {
  public readonly agent: string;
  public readonly tool: MCPTool;

  constructor(agent: string, tool: MCPTool) {
    const message = `[PERMISSION DENIED] Agent ${agent} não tem acesso à tool ${tool}`;
    super(message);
    this.name = "PermissionDeniedError";
    this.agent = agent;
    this.tool = tool;
  }
}

/**
 * ── Workspace isolado (estrutura de dados) ───────────────────
 * Cada agente recebe apenas seu workspace
 */
export interface AgentWorkspace {
  agentRole: string;
  allowedTools: MCPTool[];
  allowedDataScopes: string[];
  rateLimit: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
}

export function createAgentWorkspace(agentRole: string): AgentWorkspace {
  const tools = AGENT_PERMISSIONS[agentRole] ?? [];
  const isOrchestratorOrAdmin = agentRole === "Orchestrator" || agentRole === "Admin";

  return {
    agentRole,
    allowedTools: isOrchestratorOrAdmin ? ORCHESTRATOR_PERMISSIONS : tools,
    allowedDataScopes: isOrchestratorOrAdmin ? ["*"] : [agentRole.toLowerCase()],
    rateLimit: {
      requestsPerMinute: isOrchestratorOrAdmin ? 100 : 20,
      tokensPerDay: isOrchestratorOrAdmin ? 2000000 : 100000,
    },
  };
}
