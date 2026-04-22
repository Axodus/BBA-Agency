import {
  BrandStrategy,
  Brief,
  CampaignContext,
  CampaignMetrics,
  CreativeConcept,
  TrendInsight,
} from "../../types";
import { BriefInterpreterAgent } from "../strategy/brief-interpreter.agent";
import { AudienceProfilerAgent } from "../strategy/audience-profiler.agent";
import { TrendAnalystAgent } from "../strategy/trend-analyst.agent";
import { BrandStrategistAgent } from "../strategy/brand-strategist.agent";
import { CreativeDirectorAgent } from "../creative/creative-director.agent";
import { ParallelIdeationEngine } from "../creative/parallel-ideation.engine";
import { DataAnalystAgent } from "../performance/data-analyst.agent";
import { CopywriterAgent } from "../creative/copywriter.agent";
import { AnalyticsAgent } from "../performance/analytics.agent";
import { BaseAgent } from "../base.agent";
import { hitl } from "../../utils/intervention";
import { CostAuditor } from "../../utils/cost-auditor";
import { randomUUID } from "crypto";

interface OrchestratorConfig {
  goal: string;
  brief: Brief;
  metrics?: CampaignMetrics;
}

export class Orchestrator {
  private agents = {
    briefInterpreter: new BriefInterpreterAgent(),
    audienceProfiler: new AudienceProfilerAgent(),
    trendAnalyst: new TrendAnalystAgent(),
    brandStrategist: new BrandStrategistAgent(),
    creativeDirector: new CreativeDirectorAgent(),
    dataAnalyst: new DataAnalystAgent(),
    copywriter: new CopywriterAgent(),
    analytics: new AnalyticsAgent(),
  };

  async run(config: OrchestratorConfig): Promise<CampaignContext> {
    const campaignId = randomUUID();
    const costAuditor = new CostAuditor(config.brief.budget ?? 10000);
    const ideationEngine = new ParallelIdeationEngine(costAuditor);
    BaseAgent.setCostAuditor(costAuditor);

    console.log(`\n[Orchestrator] Campanha ${campaignId} iniciada`);
    console.log(`[Orchestrator] Cliente: ${config.brief.client}`);
    console.log(`[Orchestrator] Goal: ${config.goal}\n`);

    try {
      let ctx: CampaignContext = {
        id: campaignId,
        brief: config.brief,
      };

      console.log("[Orchestrator] STEP 1/9 -> BriefInterpreter");
      const interpreted = await this.agents.briefInterpreter.run(ctx);
      const interpretedData = interpreted.data as any;
      ctx = {
        ...ctx,
        interpretedBrief: interpretedData,
        constraints: interpretedData.brand_voice_constraints,
      };

      console.log("[Orchestrator] STEP 2/9 -> AudienceProfiler");
      const audience = await this.agents.audienceProfiler.run(ctx);
      ctx = { ...ctx, icp: audience.data as any };

      console.log("[Orchestrator] STEP 3/9 -> TrendAnalyst");
      const trendAnalysis = await this.agents.trendAnalyst.run(ctx);
      ctx = {
        ...ctx,
        trends: ((trendAnalysis.data as any).trends ?? []) as TrendInsight[],
      };

      console.log("[Orchestrator] STEP 4/9 -> BrandStrategist");
      const brandStrategy = await this.agents.brandStrategist.run(ctx);
      ctx = {
        ...ctx,
        brandStrategy: brandStrategy.data as unknown as BrandStrategy,
      };

      console.log("[Orchestrator] STEP 5/9 -> ParallelIdeationEngine");
      const ideation = await ideationEngine.diverge(ctx);
      const concepts = ideation.allConcepts.map((concept) => ({
        ...concept,
        id: concept.id || concept.concept_id || randomUUID(),
      }));
      ctx = { ...ctx, concepts };
      console.log(`[Orchestrator] Conceitos divergidos: ${concepts.length}`);

      console.log("[Orchestrator] STEP 6/9 -> DataAnalyst");
      const validation = await this.agents.dataAnalyst.run(ctx);
      const validationData = validation.data as any;
      const rankedConcepts = validationData.ranked_concepts ?? validationData.rankedConcepts ?? [];
      const bestConceptId = rankedConcepts[0]?.concept_id;
      const selectedConcept =
        ctx.concepts?.find(
          (concept) => concept.id === bestConceptId || concept.concept_id === bestConceptId
        ) ?? ctx.concepts?.[0];

      ctx = {
        ...ctx,
        selectedConcept,
      };

      console.log(`[Orchestrator] Conceito selecionado: ${ctx.selectedConcept?.title ?? "nenhum"}`);

      console.log("[Orchestrator] STEP 7/9 -> Copywriter");
      const copy = await this.agents.copywriter.run(ctx);
      const copyData = copy.data as any;
      ctx = {
        ...ctx,
        assets: [
          {
            type: "copy",
            content: JSON.stringify(copyData, null, 2),
          },
        ],
      };

      console.log("[Orchestrator] STEP 8/9 -> HITL");
      const approval = await hitl.requestApproval({
        campaignId,
        action: "approve-deploy-preparation",
        budget: config.brief.budget ?? 0,
        timeout_ms: 10000,
        summary: `Aprovar preparacao de deploy para ${config.brief.client} com o conceito ${ctx.selectedConcept?.title ?? "sem conceito"}.`,
        payload: {
          client: config.brief.client,
          concept: ctx.selectedConcept?.title ?? null,
          channels: config.brief.channels ?? [],
          assetCount: ctx.assets?.length ?? 0,
        },
      });

      if (approval !== "approved") {
        throw new Error(`[Orchestrator] Fluxo interrompido por HITL: ${approval}`);
      }

      if (config.metrics) {
        console.log("[Orchestrator] STEP 9/9 -> AnalyticsAgent");
        ctx = { ...ctx, metrics: config.metrics };
        await this.agents.analytics.run(ctx);
      }

      console.log(costAuditor.getReport());
      console.log(`\n[Orchestrator] Campanha ${campaignId} concluida`);
      return ctx;
    } finally {
      BaseAgent.setCostAuditor(undefined);
    }
  }
}
