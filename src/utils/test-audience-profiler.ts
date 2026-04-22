// ─────────────────────────────────────────────────────────────
// TEST: AudienceProfilerAgent
// Valida que o agente cria ICP estruturado a partir de core_problem
// ─────────────────────────────────────────────────────────────

import "dotenv/config";
import { AudienceProfilerAgent } from "../agents/strategy/audience-profiler.agent";
import { BriefInterpreterAgent } from "../agents/strategy/brief-interpreter.agent";
import { memory } from "../memory/memory.manager";
import { CampaignContext } from "../types/index";
import { ICPOutputSchema } from "../contracts/schemas";
import { v4 as uuid } from "uuid";

/**
 * ── TEST: AudienceProfilerAgent ───────────────────────────
 * Flow:
 * 1. Initialize memory
 * 2. Prepare brief context (SaaS example)
 * 3. Run BriefInterpreter to get core_problem
 * 4. Run AudienceProfiler to get ICP
 * 5. Validate ICP schema
 * 6. Display results
 */
async function testAudienceProfiler() {
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║     TEST: AudienceProfilerAgent (Fase 4.2)                ║");
  console.log("╚═══════════════════════════════════════════════════════════╝\n");

  try {
    // ─ SETUP: Initialize memory ──────────────────────────────
    console.log("[SETUP] Inicializando memória...");
    await memory.init();
    console.log("✓ Memória carregada\n");

    console.log("[SETUP] Criando instâncias dos agentes...");
    const briefInterpreter = new BriefInterpreterAgent();
    const audienceProfiler = new AudienceProfilerAgent();
    console.log("✓ Agentes criados\n");

    // ─ STEP 1: Criar contexto com brief bruto ───────────────
    console.log("[STEP 1] Preparando brief...");

    const briefContext: CampaignContext = {
      id: uuid(),
      brief: {
        id: uuid(),
        client: "TechFlow Pro",
        goal: "conversion",
        budget: 25000,
        channels: ["LinkedIn", "Google Search"],
        deadline: "2026-05-22",
        rawText: `
Somos uma plataforma SaaS de automação de workflows para agências criativas. 
Nossas agências clientes estão tendo dificuldade em adotar a plataforma porque 
o onboarding é complexo (muita documentação, UI pouco intuitiva).

Queremos aumentar o número de trial sign-ups de agências que COMPLETAM onboarding 
com sucesso. Atualmente, 40% das agências que criam trial nunca entram no app além 
do primeiro acesso.

Nosso diferencial é que somos 3x mais rápido que Zapier/Make, mas os usuários 
não veem isso porque se perdem no onboarding.

Objetivo: aumentar a conversão de trial em cliente pagante (SaaS). 
Hoje estamos com 8% (trial → cliente em 30 dias), queremos chegar a 15%.
Temos leads de qualidade alta (ICP bem-definido), o problema é retenção/onboarding.

Público-alvo: Donos de agências criativas (design, marketing, produção) com 
5-30 pessoas. Estão acostumados com Figma, Asana, Zapier. Precisam de automação 
mas têm medo de complexidade ("Não tenho dev na minha agência").`,
      },
      memory: undefined, // Será carregada no agente
    };

    // ─ STEP 2: Executar BriefInterpreter ────────────────────
    console.log("[STEP 2] Executando BriefInterpreter...");
    console.log("  → Interpretando core_problem, meta, restrições...\n");

    const briefOutput = await briefInterpreter.run(briefContext);

    console.log("✓ BriefInterpreter concluído");
    const briefData = briefOutput.data as any;
    console.log(`  • core_problem: ${briefData?.core_problem}`);
    console.log(`  • confidence: ${briefOutput.confidence}\n`);

    // Atualizar contexto com resultado do BriefInterpreter
    briefContext.interpretedBrief = briefOutput.data;

    // ─ STEP 3: Executar AudienceProfiler ────────────────────
    console.log("[STEP 3] Executando AudienceProfiler...");
    console.log("  → Criando ICP baseado em core_problem...\n");

    const icpOutput = await audienceProfiler.run(briefContext);

    console.log("✓ AudienceProfiler concluído\n");

    // ─ STEP 4: Validar schema ────────────────────────────────
    console.log("[VALIDATION] Validando ICPOutputSchema...");

    const icpData = icpOutput.data as any;
    const validation = ICPOutputSchema.safeParse(icpData);

    if (!validation.success) {
      console.error("❌ Schema validation FAILED:");
      console.error(validation.error.flatten());
      throw new Error("ICP output não é válido segundo schema");
    }

    console.log("✓ Schema validation PASSED\n");

    // ─ STEP 5: Exibir resultados ─────────────────────────────
    console.log("═══════════════════════════════════════════════════════════");
    console.log("📊 RESULTADO: ICP ESTRUTURADO");
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("📌 BRIEF INTERPRETADO:");
    const goal = briefData?.measurable_goal as any;
    console.log(`   Problem: ${briefData?.core_problem}`);
    console.log(`   Goal: ${goal?.metric} → ${goal?.target}`);

    console.log("\n👥 PERSONA IDENTIFICADA:");
    console.log(`   Segment: ${icpData?.segment}`);
    console.log(`   Language: ${icpData?.language_profile}`);

    console.log("\n💔 PAIN POINTS:");
    const painPoints = icpData?.pain_points as string[];
    if (painPoints && painPoints.length > 0) {
      painPoints.forEach((pp) => {
        console.log(`   • ${pp}`);
      });
    }

    console.log("\n📱 COMPORTAMENTO:");
    console.log(`   Device: ${icpData?.device}`);
    const platforms = icpData?.platforms as string[];
    console.log(`   Platforms: ${platforms?.join(", ")}`);
    console.log(`   Timing: ${icpData?.timing}`);

    console.log("\n🔥 BUYING TRIGGERS:");
    const triggers = icpData?.buying_triggers as string[];
    if (triggers && triggers.length > 0) {
      triggers.forEach((bt) => {
        console.log(`   • ${bt}`);
      });
    }

    console.log("\n🚧 OBJECTIONS TO OVERCOME:");
    const objections = icpData?.objections as string[];
    if (objections && objections.length > 0) {
      objections.forEach((obj) => {
        console.log(`   • ${obj}`);
      });
    }

    console.log(`\n📊 Confidence: ${icpData?.confidence}`);

    // ─ STEP 6: Raw JSON output ───────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("📄 RAW JSON OUTPUT:");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(JSON.stringify(icpData, null, 2));

    // ─ SUMMARY ───────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("✅ TEST PASSED — AudienceProfilerAgent working correctly!");
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
testAudienceProfiler().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
