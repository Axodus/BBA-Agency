// ─────────────────────────────────────────────────────────────
// TEST: Contract violation detection
// Valida que schemas rejeitam payloads invalidos por step
// ─────────────────────────────────────────────────────────────

import { validateAgentOutput } from "../contracts/schemas";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function runCase(
  label: string,
  step: Parameters<typeof validateAgentOutput>[0],
  payload: unknown
): void {
  const result = validateAgentOutput(step, payload);
  assert(!result.success, `${label}: esperado failure`);
  assert(!!result.error, `${label}: esperado ContractViolationError`);
  console.log(`[PASS] ${label}`);
}

async function main() {
  console.log("[TEST] Contract violation detection");

  runCase("interpret rejects incomplete payload", "interpret", {
    core_problem: "curto",
    confidence: 0.9,
  });

  runCase("strategy rejects malformed ICP", "strategy", {
    segment: "ICP incompleto",
    device: "tablet",
    platforms: [],
    confidence: 1.2,
  });

  runCase("trends rejects empty trends list", "trends", {
    trends: [],
    primary_trend: "none",
    warnings: [],
    confidence: 0.4,
  });

  runCase("branding rejects weak payload", "branding", {
    brand_positioning_statement: "vaga",
    confidence: 0.7,
  });

  console.log("[PASS] Contract violation checks completed");
}

main().catch((error) => {
  console.error("[FAIL] Contract test error:", error);
  process.exit(1);
});
