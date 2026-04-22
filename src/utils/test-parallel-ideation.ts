import "dotenv/config";
import { v4 as uuid } from "uuid";
import { ParallelIdeationEngine } from "../agents/creative/parallel-ideation.engine";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types";

process.env.USE_MOCK_LLM ??= "true";

async function testParallelIdeation() {
  console.log("\n[TEST] ParallelIdeationEngine");

  try {
    await memory.init();

  const engine = new ParallelIdeationEngine();
  const context: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "AxodusBBA",
      goal: "conversion",
      budget: 15000,
      channels: ["LinkedIn", "Meta Ads"],
      rawText: "Gerar ideias criativas divergentes para uma campanha B2B com IA.",
    },
    icp: {
      segment: "Gestores de marketing B2B",
      pain_points: ["Lentidao operacional", "Falta de previsibilidade"],
      language: "Direto e orientado a performance",
      device: "both",
      platforms: ["LinkedIn", "Meta Ads"],
      timing: "Horario comercial",
    },
    brandStrategy: {
      brand_positioning_statement: "Uma operacao de campanha mais rapida e mais clara.",
      value_proposition: "Menos retrabalho e mais velocidade de teste.",
      differentiators: ["Loop criativo orientado a dados", "Menos gargalo operacional"],
      messaging_pillars: ["Clareza", "Velocidade", "Prova"],
      proof_points: ["Iteracao continua", "Memoria de campanha"],
      recommended_cta_angle: "Ganhe previsibilidade de trials",
      confidence: 0.8,
    },
    memory: {
      winningHooks: ["Seu time ainda faz manualmente o que a IA resolve hoje?"],
      similarCampaigns: [],
      audienceInsights: [],
    },
  };

    const result = await engine.diverge(context);

    if (result.allConcepts.length !== 6) {
      console.error("[FAIL] Era esperado total de 6 conceitos, recebido:", result.allConcepts.length);
      process.exit(1);
    }

    if (Object.keys(result.byInstance).length !== 3) {
      console.error("[FAIL] Era esperado 3 instancias retornadas");
      process.exit(1);
    }

    console.log("[PASS] Ideation paralela retornou 3 instancias e 6 conceitos");
  } finally {
    await memory.close();
  }
}

testParallelIdeation().catch((error) => {
  console.error("[FAIL] Parallel ideation test error:", error);
  process.exit(1);
});
