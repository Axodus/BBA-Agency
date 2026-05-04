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
import { CampaignPlannerAgent } from "../strategy/campaign-planner.agent";
import { CreativeDirectorAgent } from "../creative/creative-director.agent";
import { ParallelIdeationEngine } from "../creative/parallel-ideation.engine";
import { VisualDesignerAgent } from "../creative/visual-designer.agent";
import { MotionDesignerAgent } from "../creative/motion-designer.agent";
import { UXCreativeAgent } from "../creative/ux-creative.agent";
import { DataAnalystAgent } from "../performance/data-analyst.agent";
import { CopywriterAgent } from "../creative/copywriter.agent";
import { AdsSpecialistAgent } from "../performance/ads-specialist.agent";
import { GrowthHackerAgent } from "../performance/growth-hacker.agent";
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
    campaignPlanner: new CampaignPlannerAgent(),
    dataAnalyst: new DataAnalystAgent(),
    copywriter: new CopywriterAgent(),
    visualDesigner: new VisualDesignerAgent(),
    motionDesigner: new MotionDesignerAgent(),
    uxCreative: new UXCreativeAgent(),
    adsSpecialist: new AdsSpecialistAgent(),
    growthHacker: new GrowthHackerAgent(),
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

      console.log("[Orchestrator] STEP 1/13 -> BriefInterpreter");
      const interpreted = await this.agents.briefInterpreter.run(ctx);
      const interpretedData = interpreted.data as any;
      ctx = {
        ...ctx,
        interpretedBrief: interpretedData,
        constraints: interpretedData.brand_voice_constraints,
      };

      console.log("[Orchestrator] STEP 2/13 -> AudienceProfiler");
      const audience = await this.agents.audienceProfiler.run(ctx);
      ctx = { ...ctx, icp: audience.data as any };

      console.log("[Orchestrator] STEP 3/13 -> TrendAnalyst");
      const trendAnalysis = await this.agents.trendAnalyst.run(ctx);
      ctx = {
        ...ctx,
        trends: ((trendAnalysis.data as any).trends ?? []) as TrendInsight[],
      };

      console.log("[Orchestrator] STEP 4/13 -> BrandStrategist");
      const brandStrategy = await this.agents.brandStrategist.run(ctx);
      ctx = {
        ...ctx,
        brandStrategy: brandStrategy.data as unknown as BrandStrategy,
      };

      console.log("[Orchestrator] STEP 5/13 -> ParallelIdeationEngine");
      const ideation = await ideationEngine.diverge(ctx);
      const concepts = ideation.allConcepts.map((concept) => ({
        ...concept,
        id: concept.id || concept.concept_id || randomUUID(),
      }));
      ctx = { ...ctx, concepts };
      console.log(`[Orchestrator] Conceitos divergidos: ${concepts.length}`);

      console.log("[Orchestrator] STEP 6/13 -> DataAnalyst");
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

      console.log("[Orchestrator] STEP 7/13 -> Copywriter");
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

      console.log("[Orchestrator] STEP 7b/13 -> CampaignPlanner");
      const plan = await this.agents.campaignPlanner.run(ctx);
      ctx = { ...ctx, campaignPlan: plan.data as any };

      console.log("[Orchestrator] STEP 7c/13 -> VisualDesigner");
      const design = await this.agents.visualDesigner.run(ctx);
      ctx = { ...ctx, designSpec: design.data as any };

      console.log("[Orchestrator] STEP 7d/13 -> MotionDesigner");
      const motion = await this.agents.motionDesigner.run(ctx);
      ctx = { ...ctx, motionSpec: motion.data as any };

      console.log("[Orchestrator] STEP 7e/13 -> UXCreative");
      const ux = await this.agents.uxCreative.run(ctx);
      ctx = { ...ctx, uxPlan: ux.data as any };

      console.log("[Orchestrator] STEP 8/13 -> HITL");
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

      console.log("[Orchestrator] STEP 9/13 -> AdsSpecialist");
      const deploy = await this.agents.adsSpecialist.run(ctx);
      ctx = { ...ctx, deploymentPlan: deploy.data as any };

      console.log("[Orchestrator] STEP 10/13 -> GrowthHacker");
      const growth = await this.agents.growthHacker.run(ctx);
      ctx = { ...ctx, growthExperiments: growth.data as any };

      if (config.metrics) {
        console.log("[Orchestrator] STEP 11/13 -> AnalyticsAgent");
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
