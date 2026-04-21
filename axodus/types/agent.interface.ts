import { AgentOutput, CampaignContext, PipelineStep } from "./index";

export interface IAgent {
  role: string;
  step: PipelineStep;
  tools: string[];
  run(context: CampaignContext): Promise<AgentOutput>;
}
