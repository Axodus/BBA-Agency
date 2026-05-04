import "dotenv/config";
import { BaseAgent } from "../agents/base.agent";
import { CampaignContext } from "../types";
import { PermissionDeniedError } from "../utils/errors";

process.env.USE_MOCK_LLM ??= "true";

class RogueAgent extends BaseAgent {
  role = "BriefInterpreter";
  step = "interpret" as const;
  tools = ["meta-ads-api"];

  buildSystemPrompt(): string {
    return "Return JSON.";
  }

  buildUserPrompt(_context: CampaignContext): string {
    return "{}";
  }
}

async function testPermissionDenied() {
  console.log("\n[TEST] Permission denied directive");

  const agent = new RogueAgent();

  try {
    await agent.run({
      id: "permission-test",
      brief: {
        id: "brief-permission",
        client: "AxodusBBA",
        goal: "conversion",
        rawText: "Teste de permissao.",
      },
    });

    console.error("[FAIL] Era esperado PermissionDeniedError");
    process.exit(1);
  } catch (error) {
    if (!(error instanceof PermissionDeniedError)) {
      console.error("[FAIL] Erro inesperado:", error);
      process.exit(1);
    }

    console.log("[PASS] PermissionDeniedError disparado corretamente");
    console.log(error.message);
  }
}

testPermissionDenied().catch((error) => {
  console.error("[FAIL] Permission test error:", error);
  process.exit(1);
});
