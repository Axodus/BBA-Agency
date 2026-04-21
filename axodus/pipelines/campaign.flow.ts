import "dotenv/config";
import { appEnv } from "../config/env";
import { Orchestrator } from "../agents/orchestrator/orchestrator.agent";
import { memory } from "../memory/memory.manager";
import { Brief } from "../types";

async function main(): Promise<void> {
  await memory.init();

  if (appEnv.useMockLlm || !appEnv.anthropicApiKey) {
    console.log("[Pipeline] Rodando em modo mock para LLM.");
  }

  const orchestrator = new Orchestrator();

  const brief: Brief = {
    id: "brief-001",
    client: "Axodus",
    goal: "conversion",
    rawText: `
      Queremos lancar nossa plataforma de automacao com AI para times de marketing.
      Produto: SaaS B2B. Ticket medio: R$497/mes. Publico: gestores de marketing
      em empresas de 50-500 funcionarios. Meta: 100 trials em 30 dias.
      Orcamento: R$15.000. Canais: LinkedIn + Meta Ads + Google.
    `,
    budget: 15000,
    channels: ["LinkedIn", "Meta Ads", "Google"],
    deadline: "30 dias",
  };

  const result = await orchestrator.run({
    goal: "Gerar 100 trials em 30 dias",
    brief,
  });

  console.log("\n==================================");
  console.log("RESULTADO FINAL");
  console.log("==================================");
  console.log("ICP:", JSON.stringify(result.icp, null, 2));
  console.log("\nConceito selecionado:", result.selectedConcept?.title);
  console.log("Hook:", result.selectedConcept?.hook);
  console.log("\nAssets gerados:", result.assets?.length ?? 0);

  if (result.assets?.[0]) {
    const copy = JSON.parse(result.assets[0].content);
    console.log("\nCopy gerado:");
    console.log("Headline:", copy.headline);
    console.log("CTA:", copy.cta);
    console.log("Video hook:", copy.videoScript?.hook);
  }
}

main().catch((error) => {
  console.error("[Pipeline] ERRO:", error);
  process.exit(1);
});
