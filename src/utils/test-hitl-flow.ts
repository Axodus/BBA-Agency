import "dotenv/config";
import { hitl } from "./intervention";

async function testHitlFlow() {
  console.log("\n[TEST] HITL flow");

  const result = await hitl.requestApproval({
    campaignId: "hitl-test-001",
    action: "approve-test-deploy",
    budget: 5000,
    summary: "Teste automatizado do fluxo de aprovacao humana.",
    payload: { test: true },
    timeout_ms: 5000,
  });

  if (result !== "approved") {
    console.error("[FAIL] Era esperado approved em modo demo, recebido:", result);
    process.exit(1);
  }

  console.log("[PASS] HITL flow aprovado em modo demo");
}

testHitlFlow().catch((error) => {
  console.error("[FAIL] HITL test error:", error);
  process.exit(1);
});
