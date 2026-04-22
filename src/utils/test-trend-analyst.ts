// ─────────────────────────────────────────────────────────────
// TEST: TrendAnalystAgent
// Valida que o agente identifica trends relevantes baseado em problema + ICP
// ─────────────────────────────────────────────────────────────

import "dotenv/config";
import { TrendAnalystAgent } from "../agents/strategy/trend-analyst.agent";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types/index";
import { TrendAnalystOutputSchema } from "../contracts/schemas";
import { v4 as uuid } from "uuid";

/**
 * ── TEST: TrendAnalystAgent ───────────────────────────────
 * Flow (Full Pipeline):
 * 1. Initialize memory
 * 2. BriefInterpreter → core_problem
 * 3. AudienceProfiler → ICP
 * 4. TrendAnalyst → Trends
 * 5. Validate schema
 * 6. Display results
 */
async function testTrendAnalyst() {
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║      TEST: TrendAnalystAgent (Fase 4.3)                  ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  try {
    // ─ SETUP: Initialize memory ──────────────────────────────
    console.log("[SETUP] Inicializando memória...");
    await memory.init();
    console.log("✓ Memória carregada\n");

    console.log("[SETUP] Criando instâncias dos agentes...");
    const briefInterpreter = new BriefInterpreterAgent();
    const audienceProfiler = new AudienceProfilerAgent();
    const trendAnalyst = new TrendAnalystAgent();
    console.log("✓ Agentes criados\n");

    // ─ STEP 1: Criar contexto com brief bruto ───────────────
    console.log("[STEP 1] Preparando brief...");

    const briefContext: CampaignContext = {
      id: uuid(),
      brief: {
        id: uuid(),
        client: "EdTech Startup",
        goal: "conversion",
        budget: 20000,
        channels: ["TikTok", "Instagram", "LinkedIn"],
        deadline: "2026-05-20",
        rawText: `
Somos uma plataforma de educação online focada em desenvolvimento de habilidades 
técnicas (programação, data science, design). Nosso público-alvo são profissionais 
em transição de carreira (25-40 anos) que querem aprender rapidamente.

Problema: Nossos cursos são bons, mas a adesão de alunos é baixa porque:
1. Muita gente pensa "cursos online = chato e desengajante"
2. Não transmitimos senso de comunidade e suporte
3. Competição feroz com Udemy, Coursera, YouTube
4. Pessoas preferem "proof of results" antes de começar

Objetivo: Aumentar conversão de visitantes → alunos pagos de 3% para 8% em 3 meses.

Dados: Nossos alunos que SÃO bem-sucedidos compartilham muito (UGC). 
Vemos muito buzz em comunidades de tech (Discord, Reddit) mas nem sempre 
conseguimos capitalizar.

Queremos uma campanha que explore trends atuais de educação. TikTok está cheio 
de "skill-building" content que está viralizando. LinkedIn mostra muito sobre 
career transitions. Mas como fazer isso sem parecer "fake" ou desesperado?

Budget: R$ 20k para testar. Temos 3 meses até launch.`,
      },
      memory: undefined,
    };

    // ─ STEP 2: Executar BriefInterpreter ────────────────────
    console.log("[STEP 2] Executando BriefInterpreter...");
    const briefOutput = await briefInterpreter.run(briefContext);
    const briefData = briefOutput.data as any;
    console.log("✓ BriefInterpreter concluído");
    console.log(`  • core_problem: ${briefData?.core_problem?.substring(0, 60)}...`);
    console.log(`  • confidence: ${briefOutput.confidence}\n`);
    briefContext.interpretedBrief = briefOutput.data;

    // ─ STEP 3: Executar AudienceProfiler ────────────────────
    console.log("[STEP 3] Executando AudienceProfiler...");
    const icpOutput = await audienceProfiler.run(briefContext);
    const icpData = icpOutput.data as any;
    console.log("✓ AudienceProfiler concluído");
    console.log(`  • segment: ${icpData?.segment?.substring(0, 50)}...`);
    console.log(`  • devices: ${icpData?.device}`);
    console.log(`  • platforms: ${icpData?.platforms?.join(", ")}\n`);
    briefContext.icp = icpOutput.data as any;

    // ─ STEP 4: Executar TrendAnalyst ────────────────────────
    console.log("[STEP 4] Executando TrendAnalyst...");
    console.log("  → Identificando trends relevantes para este contexto...\n");
    const trendOutput = await trendAnalyst.run(briefContext);
    const trendData = trendOutput.data as any;
    console.log("✓ TrendAnalyst concluído\n");

    // ─ STEP 5: Validar schema ────────────────────────────────
    console.log("[VALIDATION] Validando TrendAnalystOutputSchema...");
    const validation = TrendAnalystOutputSchema.safeParse(trendData);
    if (!validation.success) {
      console.error("❌ Schema validation FAILED:");
      console.error(validation.error.flatten());
      throw new Error("Trend output não é válido segundo schema");
    }
    console.log("✓ Schema validation PASSED\n");

    // ─ STEP 6: Exibir resultados ─────────────────────────────
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📊 RESULTADO: TRENDS IDENTIFICADOS");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("📌 CONTEXTO RESUMIDO:");
    console.log(`   Problem: ${briefData?.core_problem?.substring(0, 70)}...`);
    console.log(`   Segment: ${icpData?.segment?.substring(0, 50)}...`);

    console.log("\n🎯 TRENDS IDENTIFICADOS:");
    const trends = trendData?.trends as any[];
    if (trends && trends.length > 0) {
      trends.forEach((trend, idx) => {
        console.log(`\n   ${idx + 1}. ${trend.name}`);
        console.log(`      Score: ${trend.relevance_score}/10 — ${trend.relevance_rationale}`);
        console.log(`      Opportunity: ${trend.opportunity}`);
        if (trend.risk) {
          console.log(`      Risk: ${trend.risk}`);
        }
        console.log(`      Timeline: ${trend.expected_timeline}`);
      });
    }

    console.log(`\n🏆 PRIMARY TREND: ${trendData?.primary_trend}`);

    if (trendData?.killer_combo) {
      console.log(`\n💥 KILLER COMBO: ${trendData.killer_combo}`);
    }

    console.log("\n⚠️ WARNINGS (trends to avoid):");
    const warnings = trendData?.warnings as string[];
    if (warnings && warnings.length > 0) {
      warnings.forEach((w) => console.log(`   • ${w}`));
    } else {
      console.log("   (none)");
    }

    console.log(`\n📊 Confidence: ${trendData?.confidence}`);

    // ─ STEP 7: Raw JSON output ───────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("📄 RAW JSON OUTPUT:");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(JSON.stringify(trendData, null, 2));

    // ─ SUMMARY ───────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("✅ TEST PASSED — TrendAnalystAgent working correctly!");
    console.log("═══════════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error instanceof Error ? error.message : error);
    console.error("\nStack trace:", error);
    process.exit(1);
  }
}

// Run test
testTrendAnalyst().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
