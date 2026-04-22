import "dotenv/config";
import { v4 as uuid } from "uuid";
import { CreativeDirectorAgent } from "../agents/creative/creative-director.agent";
import { AdsSpecialistAgent } from "../agents/performance/ads-specialist.agent";
import { GrowthHackerAgent } from "../agents/performance/growth-hacker.agent";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { CampaignPlannerAgent } from "../agents/strategy/campaign-planner.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { GrowthHackerOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testGrowthHacker() {
  console.log("\n[TEST] GrowthHackerAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 20000,
      channels: ["Meta Ads", "Google", "LinkedIn"],
      deadline: "2026-06-25",
      rawText: `
Queremos operar um ciclo de growth apos o lancamento da campanha,
com experimentos claros de criativo, segmentacao e mensagem para aumentar trials.
      `,
    },
    metrics: {
      ctr: 0.031,
      conversion: 0.014,
      spend: 6400,
    },
  };

  const briefInterpreter = new BriefInterpreterAgent();
  const audienceProfiler = new AudienceProfilerAgent();
  const trendAnalyst = new TrendAnalystAgent();
  const brandStrategist = new BrandStrategistAgent();
  const campaignPlanner = new CampaignPlannerAgent();
  const creativeDirector = new CreativeDirectorAgent();
  const adsSpecialist = new AdsSpecialistAgent();
  const growthHacker = new GrowthHackerAgent();

  context.interpretedBrief = (await briefInterpreter.run(context)).data;
  context.icp = (await audienceProfiler.run(context)).data as any;
  context.trends = ((await trendAnalyst.run(context)).data as any).trends ?? [];
  context.brandStrategy = (await brandStrategist.run(context)).data as any;
  context.campaignPlan = (await campaignPlanner.run(context)).data as any;
  context.concepts = ((await creativeDirector.run(context)).data as any).concepts ?? [];
  context.selectedConcept = context.concepts?.[0];
  context.deploymentPlan = (await adsSpecialist.run(context)).data as any;

    const growthOutput = await growthHacker.run(context);
    const validation = GrowthHackerOutputSchema.safeParse(growthOutput.data);

    if (!validation.success) {
      console.error("[FAIL] GrowthHacker schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] GrowthHacker schema valido");
    console.log(JSON.stringify(validation.data, null, 2));
  } finally {
    await memory.close();
  }
}

testGrowthHacker().catch((error) => {
  console.error("[FAIL] GrowthHacker test error:", error);
  process.exit(1);
});
