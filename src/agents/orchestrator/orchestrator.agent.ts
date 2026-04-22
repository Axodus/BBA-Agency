import {
  Brief,
  CampaignContext,
  CampaignMetrics,
  CreativeConcept,
} from "../../types";
import { BriefInterpreterAgent } from "../strategy/brief-interpreter.agent";
import { AudienceProfilerAgent } from "../strategy/audience-profiler.agent";
import { CreativeDirectorAgent } from "../creative/creative-director.agent";
import { DataAnalystAgent } from "../performance/data-analyst.agent";
import { CopywriterAgent } from "../creative/copywriter.agent";
import { AnalyticsAgent } from "../performance/analytics.agent";
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
    creativeDirector: new CreativeDirectorAgent(),
    dataAnalyst: new DataAnalystAgent(),
    copywriter: new CopywriterAgent(),
    analytics: new AnalyticsAgent(),
  };

  async run(config: OrchestratorConfig): Promise<CampaignContext> {
    const campaignId = randomUUID();
    console.log(`\n[Orchestrator] Campanha ${campaignId} iniciada`);
    console.log(`[Orchestrator] Cliente: ${config.brief.client}`);
    console.log(`[Orchestrator] Goal: ${config.goal}\n`);

    let ctx: CampaignContext = {
      id: campaignId,
      brief: config.brief,
    };

    console.log("[Orchestrator] STEP 1/6 -> BriefInterpreter");
    const interpreted = await this.agents.briefInterpreter.run(ctx);
    const interpretedData = interpreted.data as any;
    ctx = {
      ...ctx,
      interpretedBrief: interpretedData,
      constraints: interpretedData.constraints,
    };

    console.log("[Orchestrator] STEP 2/6 -> AudienceProfiler");
    const audience = await this.agents.audienceProfiler.run(ctx);
    ctx = { ...ctx, icp: audience.data as any };

    console.log("[Orchestrator] STEP 3/6 -> CreativeDirector");
    const ideation = await this.agents.creativeDirector.run(ctx);
    const concepts = ((ideation.data as { concepts?: CreativeConcept[] }).concepts ?? []).map((concept) => ({
      ...concept,
      id: concept.id || randomUUID(),
    }));
    ctx = { ...ctx, concepts };

    console.log("[Orchestrator] STEP 4/6 -> DataAnalyst");
    const validation = await this.agents.dataAnalyst.run(ctx);
    const validationData = validation.data as any;
    const bestConceptTitle = validationData.rankedConcepts[0]?.conceptId;
    const selectedConcept =
      ctx.concepts?.find((concept) => concept.title === bestConceptTitle) ?? ctx.concepts?.[0];

    ctx = {
      ...ctx,
      selectedConcept,
    };

    console.log(`[Orchestrator] Conceito selecionado: ${ctx.selectedConcept?.title ?? "nenhum"}`);

    console.log("[Orchestrator] STEP 5/6 -> Copywriter");
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

    if (config.metrics) {
      console.log("[Orchestrator] STEP 6/6 -> AnalyticsAgent");
      ctx = { ...ctx, metrics: config.metrics };
      await this.agents.analytics.run(ctx);
    }

    console.log(`\n[Orchestrator] Campanha ${campaignId} concluida`);
    return ctx;
  }
}
