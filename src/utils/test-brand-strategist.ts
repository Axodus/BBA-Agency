// ─────────────────────────────────────────────────────────────
// TEST: BrandStrategistAgent
// Valida ICP + trends -> brand positioning
// ─────────────────────────────────────────────────────────────

import "dotenv/config";
import { v4 as uuid } from "uuid";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BrandStrategistAgent } from "../agents/strategy/brand-strategist.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { BrandStrategistOutputSchema } from "../contracts/schemas";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

async function testBrandStrategist() {
  console.log("\n[TEST] BrandStrategistAgent");

  await memory.init();
  try {

  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "BBA Agency",
      goal: "conversion",
      budget: 18000,
      channels: ["LinkedIn", "Meta Ads"],
      deadline: "2026-06-15",
      rawText: `
Queremos posicionar nossa operacao de campanhas com IA como uma alternativa mais rapida
e mais orientada a resultado para times de marketing que estao presos em retrabalho.
O desafio e evitar a percepcao de "mais uma ferramenta de automacao" e provar valor real logo no inicio.
      `,
    },
  };

  const briefInterpreter = new BriefInterpreterAgent();
  const audienceProfiler = new AudienceProfilerAgent();
  const trendAnalyst = new TrendAnalystAgent();
  const brandStrategist = new BrandStrategistAgent();

  const briefOutput = await briefInterpreter.run(context);
  context.interpretedBrief = briefOutput.data;

  const audienceOutput = await audienceProfiler.run(context);
  context.icp = audienceOutput.data as any;

  const trendOutput = await trendAnalyst.run(context);
  context.trends = (trendOutput.data as any).trends ?? [];

  const brandOutput = await brandStrategist.run(context);
  const validation = BrandStrategistOutputSchema.safeParse(brandOutput.data);

  if (!validation.success) {
    console.error("[FAIL] BrandStrategist schema invalido");
    console.error(validation.error.flatten());
    process.exit(1);
  }

  console.log("[PASS] BrandStrategist schema valido");
  console.log(JSON.stringify(validation.data, null, 2));
  } finally {
    await memory.close();
  }
}

testBrandStrategist().catch((error) => {
  console.error("[FAIL] BrandStrategist test error:", error);
  process.exit(1);
});
