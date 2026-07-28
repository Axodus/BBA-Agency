import type { KnowledgePolicyCommandApiPort, KnowledgePolicyQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { ApplicationCommandContext, CommittedOperationResultDto, CreateKnowledgeRequestDto, CreatePolicyRequestDto, CreatePolicyVersionRequestDto, CurateKnowledgeRequestDto, GetKnowledgeRequestDto, GetPolicyRequestDto, KnowledgeDto, LinkKnowledgeAssetRequestDto, ListKnowledgeRequestDto, ListPoliciesRequestDto, PolicyDto, QueryContext } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import type { KnowledgeReferenceValidationPort } from "../../modules/knowledge-policy/ports/KnowledgeReferenceValidationPort.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { createKnowledgePolicyBindings } from "./KnowledgePolicyBindings.js";

export class KnowledgePolicyApplicationApi implements KnowledgePolicyCommandApiPort, KnowledgePolicyQueryApiPort {
  private readonly bindings;
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner, validation: KnowledgeReferenceValidationPort) { this.bindings = createKnowledgePolicyBindings(validation); }
  public createKnowledge(command: CreateKnowledgeRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings.createKnowledge, this.commands, command, context); }
  public curateKnowledge(command: CurateKnowledgeRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings.curateKnowledge, this.commands, command, context); }
  public linkKnowledgeAsset(command: LinkKnowledgeAssetRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings.linkKnowledgeAsset, this.commands, command, context); }
  public createPolicy(command: CreatePolicyRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings.createPolicy, this.commands, command, context); }
  public createPolicyVersion(command: CreatePolicyVersionRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings.createPolicyVersion, this.commands, command, context); }
  public getKnowledge(query: GetKnowledgeRequestDto, context: QueryContext): Promise<KnowledgeDto | null> { return executeBoundQuery(this.bindings.getKnowledge, this.queries, query, context); }
  public listKnowledge(query: ListKnowledgeRequestDto, context: QueryContext): Promise<readonly KnowledgeDto[]> { return executeBoundQuery(this.bindings.listKnowledge, this.queries, query, context); }
  public getPolicy(query: GetPolicyRequestDto, context: QueryContext): Promise<PolicyDto | null> { return executeBoundQuery(this.bindings.getPolicy, this.queries, query, context); }
  public listPolicies(query: ListPoliciesRequestDto, context: QueryContext): Promise<readonly PolicyDto[]> { return executeBoundQuery(this.bindings.listPolicies, this.queries, query, context); }
}
