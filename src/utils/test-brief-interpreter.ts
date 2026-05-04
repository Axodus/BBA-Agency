// ─────────────────────────────────────────────────────────────
// AXODUS — Test: BriefInterpreterAgent
// Valida o primeiro agente especializado
// ─────────────────────────────────────────────────────────────

import "dotenv/config";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types/index";
import { v4 as uuid } from "uuid";

async function testBriefInterpreter() {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║  AXODUS — BriefInterpreterAgent Test                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // 1. Inicializar memória
  console.log("[Setup] Inicializando memória...");
  await memory.init();
  let exitCode = 0;
  try {
  console.log("✓ Memória carregada\n");

  // 2. Criar instância do agente
  const agent = new BriefInterpreterAgent();
  console.log(`[Agent] Instância criada: ${agent.role}\n`);

  // 3. Preparar contexto com um brief de teste
  const testContext: CampaignContext = {
    id: uuid(),
    brief: {
      id: uuid(),
      client: "TechCorp SaaS",
      goal: "conversion",
      rawText: `
Olá! Somos uma SaaS de gestão de projetos e queremos aumentar nossas vendas. 
Estamos tendo dificuldade em converter visitantes do site em clientes pagos. 
Nosso target são gerentes de projeto em empresas de 50-500 pessoas.

Temos um budget de R$ 10.000 para uma campanha de teste.
Queremos rodar em LinkedIn e Google Ads.
Precisa estar pronta em 2 semanas.

O problema é que muitos visitantes não entendem o valor que oferecemos.
Queremos um copy que transmita "simplicidade" e "economiza tempo".
`,
      budget: 10000,
      deadline: "2026-05-05",
      channels: ["linkedin", "google-ads"],
    },
    memory: undefined, // Será carregada no agente
  };

  console.log("[Brief] Contexto preparado:");
  console.log(`  Cliente: ${testContext.brief.client}`);
  console.log(`  Goal: ${testContext.brief.goal}`);
  console.log(`  Budget: R$ ${testContext.brief.budget}`);
  console.log(`  Deadline: ${testContext.brief.deadline}\n`);

  // 4. Executar o agente
  console.log("[Execution] Executando BriefInterpreterAgent...\n");
  let output;
  try {
    output = await agent.run(testContext);
  } catch (err) {
    console.error("[ERROR] Falha ao executar agente:", err);
    exitCode = 1;
    return;
  }

  // 5. Analisar resultado
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  RESULTADO DA INTERPRETAÇÃO                               ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  const interpreted = output.data;

  console.log(`Agent Role: ${output.agentRole}`);
  console.log(`Step: ${output.step}`);
  console.log(`Confidence: ${(output.confidence * 100).toFixed(0)}%`);
  console.log(`Timestamp: ${output.timestamp}\n`);

  console.log("───── INTERPRETED BRIEF ─────\n");

  console.log(`🎯 CORE PROBLEM:`);
  console.log(`   "${interpreted.core_problem}\n"`);

  console.log(`📊 MEASURABLE GOAL:`);
  const goal = interpreted.measurable_goal as any;
  if (goal) {
    console.log(`   Metric: ${goal.metric}`);
    console.log(`   Target: ${goal.target}`);
    console.log(`   Timeframe: ${goal.timeframe}\n`);
  }

  console.log(`🎨 BRAND VOICE CONSTRAINTS:`);
  const constraints = interpreted.brand_voice_constraints as string[];
  if (constraints && constraints.length > 0) {
    constraints.forEach((c) => console.log(`   • ${c}`));
  }
  console.log("");

  console.log(`💡 HIDDEN INSIGHTS:`);
  const insights = interpreted.hidden_insights as string[];
  if (insights && insights.length > 0) {
    insights.forEach((i) => console.log(`   • ${i}`));
  }
  console.log("");

  // 6. Validação de schema
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  SCHEMA VALIDATION                                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  const requiredFields = [
    "core_problem",
    "target_audience_id",
    "measurable_goal",
    "brand_voice_constraints",
    "hidden_insights",
    "confidence",
  ];

  let allFieldsPresent = true;
  for (const field of requiredFields) {
    const present = field in interpreted;
    const status = present ? "✓" : "✗";
    console.log(`${status} ${field}`);
    if (!present) allFieldsPresent = false;
  }

  console.log("");

  if (allFieldsPresent) {
    console.log("✅ All required fields present!");
    console.log("✅ Contract validation PASSED!\n");
  } else {
    console.log("❌ Missing fields! Contract validation FAILED!\n");
exitCode = 1;
return;
  }

  // 7. Debug: Raw output JSON
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  RAW JSON OUTPUT                                           ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  console.log(JSON.stringify(interpreted, null, 2));
  } finally {
    await memory.close();
  }

  if (exitCode !== 0) {
    process.exit(exitCode);
  }

  console.log("\n✅ TEST PASSED — BriefInterpreterAgent working correctly!\n");
}

testBriefInterpreter().catch((err) => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
