import "dotenv/config";
import { v4 as uuid } from "uuid";
import { CreativeDirectorAgent } from "../agents/creative/creative-director.agent";
import { AdsSpecialistAgent } from "../agents/performance/ads-specialist.agent";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { CampaignPlannerAgent } from "../agents/strategy/campaign-planner.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { AdsSpecialistOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testAdsSpecialist() {
  console.log("\n[TEST] AdsSpecialistAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 25000,
      channels: ["Meta Ads", "Google"],
      deadline: "2026-06-20",
      rawText: `
Queremos preparar um deploy de campanha para gerar trials com Meta Ads e Google.
Precisamos de um rollout claro, com budget por plataforma e checklist de lancamento.
      `,
    },
  };

  const briefInterpreter = new BriefInterpreterAgent();
  const audienceProfiler = new AudienceProfilerAgent();
  const trendAnalyst = new TrendAnalystAgent();
  const brandStrategist = new BrandStrategistAgent();
  const campaignPlanner = new CampaignPlannerAgent();
  const creativeDirector = new CreativeDirectorAgent();
  const adsSpecialist = new AdsSpecialistAgent();

  context.interpretedBrief = (await briefInterpreter.run(context)).data;
  context.icp = (await audienceProfiler.run(context)).data as any;
  context.trends = ((await trendAnalyst.run(context)).data as any).trends ?? [];
  context.brandStrategy = (await brandStrategist.run(context)).data as any;
  context.campaignPlan = (await campaignPlanner.run(context)).data as any;
  context.concepts = ((await creativeDirector.run(context)).data as any).concepts ?? [];
  context.selectedConcept = context.concepts?.[0];

    const adsOutput = await adsSpecialist.run(context);
    const validation = AdsSpecialistOutputSchema.safeParse(adsOutput.data);

    if (!validation.success) {
      console.error("[FAIL] AdsSpecialist schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] AdsSpecialist schema valido");
    console.log(JSON.stringify(validation.data, null, 2));
  } finally {
    await memory.close();
  }
}

testAdsSpecialist().catch((error) => {
  console.error("[FAIL] AdsSpecialist test error:", error);
  process.exit(1);
});
