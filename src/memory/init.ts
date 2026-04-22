import "dotenv/config";
import { memory } from "./memory.manager";

async function init(): Promise<void> {
  await memory.init();

  await memory.saveEpisodic({
    id: "seed-001",
    client: "Axodus",
    campaign_name: "Campanha de lancamento SaaS B2B",
    summary: "Campanha de lancamento SaaS B2B com foco em produtividade para gestores de marketing.",
    hook: "Voce ainda perde 3h por dia em tarefas que uma IA faz em 10min?",
    format: "video_30s",
    ctr: 0.047,
    conversion: 0.023,
    budget: 5000,
    timestamp: new Date().toISOString(),
  });

  await memory.saveAudienceInsights("gestores de marketing B2B", [
    "Respondem melhor a comparacoes de tempo economizado do que a promessas abstratas de IA.",
    "Valorizam prova social, benchmarks e argumentos orientados a processo.",
  ]);

  console.log("[Memory] Seeds inseridos. Sistema pronto.");
}

init().catch((error) => {
  console.error("[Memory] ERRO:", error);
  process.exit(1);
});
