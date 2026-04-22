import "dotenv/config";
import { memory } from "../memory/memory.manager";

async function testMemoryNamespaces() {
  console.log("\n[TEST] Memory namespaces");

  try {
    await memory.init();

    const timestamp = new Date().toISOString();

    await memory.saveEpisodic({
      id: "episodic-test-001",
      client: "AxodusBBA",
      campaign_name: "Teste episodico",
      hook: "Hook episodico",
      format: "video_30s",
      ctr: 0.025,
      conversion: 0.01,
      budget: 1200,
      timestamp,
      summary: "Campanha episodica para validar recuperacao por cliente.",
    });

    const semanticSaved = await memory.saveSemantic({
      id: "semantic-test-001",
      hook: "Hook semantico vencedor",
      format: "ugc",
      sector: "saas_b2b",
      ctr: 0.051,
      conversion: 0.026,
      budget: 4000,
      timestamp,
      summary: "Campanha com performance acima do threshold para entrar no playbook.",
    });

    await memory.saveAudienceInsights("Gestores de marketing B2B", [
      "Preferem prova concreta a discurso amplo.",
    ]);

    const episodic = await memory.recallEpisodic(
      "AxodusBBA",
      "recuperar campanha episodica por cliente",
      3
    );
    const semantic = await memory.recallSemantic("hook semantico vencedor", { sector: "saas_b2b" }, 3);
    const audience = await memory.getAudienceInsights("Gestores de marketing B2B");
    const health = await memory.healthCheck();

    if (!episodic.length) {
      console.error("[FAIL] Episodic namespace nao retornou registros");
      process.exit(1);
    }

    if (!semanticSaved || !semantic.length) {
      console.error("[FAIL] Semantic namespace nao retornou registros");
      process.exit(1);
    }

    if (!audience.length) {
      console.error("[FAIL] Audience insights nao retornaram registros");
      process.exit(1);
    }

    console.log("[PASS] Memory namespaces funcionando");
    console.log(JSON.stringify(health, null, 2));
  } finally {
    await memory.close();
  }
}

testMemoryNamespaces().catch((error) => {
  console.error("[FAIL] Memory namespaces test error:", error);
  process.exit(1);
});
