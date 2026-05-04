import "dotenv/config";
import { v4 as uuid } from "uuid";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { CreativeDirectorAgent } from "../agents/creative/creative-director.agent";
import { CopywriterAgent } from "../agents/creative/copywriter.agent";
import { VisualDesignerAgent } from "../agents/creative/visual-designer.agent";
import { VisualDesignerOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testVisualDesigner() {
  console.log("\n[TEST] VisualDesignerAgent");

  try {
    await memory.init();

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 18000,
      channels: ["LinkedIn", "Meta Ads"],
      deadline: "2026-06-15",
      rawText: `
Queremos uma campanha criativa para vender uma stack de operacao de marketing com IA.
Precisamos de um sistema visual que mostre contraste entre caos operacional e clareza de execucao.
      `,
    },
  };

  const briefInterpreter = new BriefInterpreterAgent();
  const audienceProfiler = new AudienceProfilerAgent();
  const trendAnalyst = new TrendAnalystAgent();
  const brandStrategist = new BrandStrategistAgent();
  const creativeDirector = new CreativeDirectorAgent();
  const copywriter = new CopywriterAgent();
  const visualDesigner = new VisualDesignerAgent();

  context.interpretedBrief = (await briefInterpreter.run(context)).data;
  context.icp = (await audienceProfiler.run(context)).data as any;
  context.trends = ((await trendAnalyst.run(context)).data as any).trends ?? [];
  context.brandStrategy = (await brandStrategist.run(context)).data as any;
  context.concepts = ((await creativeDirector.run(context)).data as any).concepts ?? [];
  context.selectedConcept = context.concepts?.[0];

  const copyOutput = await copywriter.run(context);
  context.assets = [
    {
      type: "copy",
      content: JSON.stringify(copyOutput.data),
    },
  ];

    const designOutput = await visualDesigner.run(context);
    const validation = VisualDesignerOutputSchema.safeParse(designOutput.data);

    if (!validation.success) {
      console.error("[FAIL] VisualDesigner schema invalido");
      console.error(validation.error.flatten());
      process.exit(1);
    }

    console.log("[PASS] VisualDesigner schema valido");
    console.log(JSON.stringify(validation.data, null, 2));
  } finally {
    await memory.close();
  }
}

testVisualDesigner().catch((error) => {
  console.error("[FAIL] VisualDesigner test error:", error);
  process.exit(1);
});
