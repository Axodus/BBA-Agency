import "dotenv/config";
import { v4 as uuid } from "uuid";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { CampaignPlannerAgent } from "../agents/strategy/campaign-planner.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { CampaignPlannerOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testCampaignPlanner() {
  console.log("\n[TEST] CampaignPlannerAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 22000,
      channels: ["LinkedIn", "Meta Ads", "Google"],
      deadline: "2026-06-10",
      rawText: `
Queremos lancar uma operacao de campanhas com IA para times de marketing B2B.
Precisamos gerar trials com previsibilidade, sem aumentar o time operacional.
O desafio e transformar estrategia em um plano claro de canais, cadencia e metricas.
      `,
    },
  };

  const briefInterpreter = new BriefInterpreterAgent();
  const audienceProfiler = new AudienceProfilerAgent();
  const trendAnalyst = new TrendAnalystAgent();
  const brandStrategist = new BrandStrategistAgent();
  const campaignPlanner = new CampaignPlannerAgent();

  context.interpretedBrief = (await briefInterpreter.run(context)).data;
  context.icp = (await audienceProfiler.run(context)).data as any;
  context.trends = ((await trendAnalyst.run(context)).data as any).trends ?? [];
  context.brandStrategy = (await brandStrategist.run(context)).data as any;

    const plannerOutput = await campaignPlanner.run(context);
    const validation = CampaignPlannerOutputSchema.safeParse(plannerOutput.data);

    if (!validation.success) {
      console.error("[FAIL] CampaignPlanner schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] CampaignPlanner schema valido");
    console.log(JSON.stringify(validation.data, null, 2));
  } finally {
    await memory.close();
  }
}

testCampaignPlanner().catch((error) => {
  console.error("[FAIL] CampaignPlanner test error:", error);
  process.exit(1);
});
