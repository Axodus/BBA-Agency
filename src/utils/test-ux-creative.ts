import "dotenv/config";
import { v4 as uuid } from "uuid";
import { CopywriterAgent } from "../agents/creative/copywriter.agent";
import { CreativeDirectorAgent } from "../agents/creative/creative-director.agent";
import { UXCreativeAgent } from "../agents/creative/ux-creative.agent";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { UXCreativeOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testUxCreative() {
  console.log("\n[TEST] UXCreativeAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 14000,
      channels: ["Landing Page", "Meta Ads"],
      rawText: "Precisamos transformar copy e conceito em uma UX de conversao clara.",
    },
  };

  context.interpretedBrief = (await new BriefInterpreterAgent().run(context)).data;
  context.icp = (await new AudienceProfilerAgent().run(context)).data as any;
  context.trends = ((await new TrendAnalystAgent().run(context)).data as any).trends ?? [];
  context.brandStrategy = (await new BrandStrategistAgent().run(context)).data as any;
  context.concepts = ((await new CreativeDirectorAgent().run(context)).data as any).concepts ?? [];
  context.selectedConcept = context.concepts?.[0];
  const copy = await new CopywriterAgent().run(context);
  context.assets = [{ type: "copy", content: JSON.stringify(copy.data) }];

    const uxOutput = await new UXCreativeAgent().run(context);
    const validation = UXCreativeOutputSchema.safeParse(uxOutput.data);

    if (!validation.success) {
      console.error("[FAIL] UXCreative schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] UXCreative schema valido");
  } finally {
    await memory.close();
  }
}

testUxCreative().catch((error) => {
  console.error("[FAIL] UXCreative test error:", error);
  process.exit(1);
});
