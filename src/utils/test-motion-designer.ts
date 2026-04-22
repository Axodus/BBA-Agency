import "dotenv/config";
import { v4 as uuid } from "uuid";
import { CopywriterAgent } from "../agents/creative/copywriter.agent";
import { CreativeDirectorAgent } from "../agents/creative/creative-director.agent";
import { MotionDesignerAgent } from "../agents/creative/motion-designer.agent";
import { VisualDesignerAgent } from "../agents/creative/visual-designer.agent";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { MotionDesignerOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testMotionDesigner() {
  console.log("\n[TEST] MotionDesignerAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 15000,
      channels: ["Meta Ads", "LinkedIn"],
      rawText: "Precisamos transformar um conceito e design em motion de alta clareza.",
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
  context.designSpec = (await new VisualDesignerAgent().run(context)).data as any;

    const motionOutput = await new MotionDesignerAgent().run(context);
    const validation = MotionDesignerOutputSchema.safeParse(motionOutput.data);

    if (!validation.success) {
      console.error("[FAIL] MotionDesigner schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] MotionDesigner schema valido");
  } finally {
    await memory.close();
  }
}

testMotionDesigner().catch((error) => {
  console.error("[FAIL] MotionDesigner test error:", error);
  process.exit(1);
});
