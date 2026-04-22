import "dotenv/config";
import { CostAuditor } from "./cost-auditor";
import { CostExceededError } from "./errors";

function testCostOverflow() {
  console.log("\n[TEST] Cost overflow");

  const auditor = new CostAuditor(100, 0.01);

  try {
    auditor.record({
      agent: "StressTester",
      step: "validation",
      input_tokens: 150000,
      output_tokens: 75000,
    });

    console.error("[FAIL] Era esperado CostExceededError");
    process.exit(1);
  } catch (error) {
    if (!(error instanceof CostExceededError)) {
      console.error("[FAIL] Erro inesperado:", error);
      process.exit(1);
    }

    console.log("[PASS] CostExceededError disparado corretamente");
    console.log(error.message);
  }
}

testCostOverflow();
