// ─────────────────────────────────────────────────────────────
// AXODUS — Custom Errors & Diagnostics
// ─────────────────────────────────────────────────────────────

/**
 * Base Error para todo o sistema Axodus
 */
export class AxodusError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(code: string, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = "AxodusError";
    this.code = code;
    this.timestamp = new Date();
    this.context = context;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
    };
  }
}

/**
 * Contract Violation Error (Schema Zod)
 */
export class ContractViolationError extends AxodusError {
  public readonly zodError: any;
  public readonly agent: string;
  public readonly step: string;

  constructor(agent: string, step: string, zodError: any) {
    const flatError = zodError.flatten ? zodError.flatten() : zodError;
    const message = `Contract violation in step "${step}" for agent "${agent}"`;
    super("CONTRACT_VIOLATION", message, { agent, step, errors: flatError });
    this.name = "ContractViolationError";
    this.agent = agent;
    this.step = step;
    this.zodError = zodError;
  }
}

/**
 * Permission Denied Error (Access Control)
 */
export class PermissionDeniedError extends AxodusError {
  public readonly agent: string;
  public readonly tool: string;

  constructor(agent: string, tool: string) {
    const message = `Agent "${agent}" is not permitted to use tool "${tool}"`;
    super("PERMISSION_DENIED", message, { agent, tool });
    this.name = "PermissionDeniedError";
    this.agent = agent;
    this.tool = tool;
  }
}

/**
 * Cost Exceeded Error (Budget Guard)
 */
export class CostExceededError extends AxodusError {
  public readonly currentCost: number;
  public readonly maxBudget: number;
  public readonly ratio: number;

  constructor(currentCost: number, maxBudget: number, ratio: number) {
    const message = `Token cost exceeded: ${currentCost.toFixed(2)} USD / ${maxBudget.toFixed(2)} USD budget (ratio: ${(ratio * 100).toFixed(2)}%)`;
    super("COST_EXCEEDED", message, { currentCost, maxBudget, ratio });
    this.name = "CostExceededError";
    this.currentCost = currentCost;
    this.maxBudget = maxBudget;
    this.ratio = ratio;
  }
}

/**
 * Intervention Required Error (HITL)
 */
export class InterventionRequiredError extends AxodusError {
  public readonly action: string;
  public readonly budget: number;
  public readonly timeoutMs: number;

  constructor(action: string, budget: number, timeoutMs: number) {
    const message = `Human intervention required for action: "${action}" (budget: R$ ${budget})`;
    super("INTERVENTION_REQUIRED", message, { action, budget, timeoutMs });
    this.name = "InterventionRequiredError";
    this.action = action;
    this.budget = budget;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Auto-Correction Helper (Contract Recovery)
 */
export class AutoCorrectionError extends AxodusError {
  public readonly attempt: number;
  public readonly maxAttempts: number;

  constructor(agent: string, step: string, attempt: number, maxAttempts: number, lastError: any) {
    const message = `Auto-correction attempt ${attempt}/${maxAttempts} failed for agent "${agent}" at step "${step}"`;
    super("AUTO_CORRECTION_FAILED", message, {
      agent,
      step,
      attempt,
      maxAttempts,
      lastError: lastError.message,
    });
    this.name = "AutoCorrectionError";
    this.attempt = attempt;
    this.maxAttempts = maxAttempts;
  }
}

/**
 * Memory Error (Vector DB / MongoDB)
 */
export class MemoryError extends AxodusError {
  constructor(operation: string, details: string) {
    const message = `Memory operation failed: ${operation} — ${details}`;
    super("MEMORY_ERROR", message, { operation, details });
    this.name = "MemoryError";
  }
}

/**
 * MCP Tool Error (External Service)
 */
export class MCPToolError extends AxodusError {
  public readonly tool: string;
  public readonly statusCode?: number;

  constructor(tool: string, message: string, statusCode?: number) {
    super("MCP_TOOL_ERROR", message, { tool, statusCode });
    this.name = "MCPToolError";
    this.tool = tool;
    this.statusCode = statusCode;
  }
}

/**
 * Timeout Error
 */
export class TimeoutError extends AxodusError {
  public readonly timeoutMs: number;
  public readonly operation: string;

  constructor(operation: string, timeoutMs: number) {
    const message = `Operation "${operation}" timed out after ${timeoutMs}ms`;
    super("TIMEOUT", message, { operation, timeoutMs });
    this.name = "TimeoutError";
    this.operation = operation;
    this.timeoutMs = timeoutMs;
  }
}
