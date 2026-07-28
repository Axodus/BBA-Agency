import type { WorkflowCommandApiPort, WorkflowQueryApiPort } from "../ports/ApplicationApiPorts.js";
import type { ApplicationCommandContext, CommittedOperationResultDto, GetWorkflowExecutionRequestDto, GetWorkflowRequestDto, QueryContext, WorkflowCommandRequestDto, WorkflowDto, WorkflowExecutionDto } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";
import { executeBoundCommand, executeBoundQuery } from "./ApplicationBindingRegistry.js";
import { createWorkflowBindings, type WorkflowDependencies } from "./WorkflowBindings.js";

export class WorkflowApplicationApi implements WorkflowCommandApiPort, WorkflowQueryApiPort {
  private readonly bindings;
  public constructor(private readonly commands: ApplicationCommandRunner, private readonly queries: ApplicationQueryRunner, dependencies: WorkflowDependencies) { this.bindings = createWorkflowBindings(dependencies); }
  private command(name: string, command: WorkflowCommandRequestDto, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> { return executeBoundCommand(this.bindings[name] as never, this.commands, command, context); }
  public createWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("createWorkflow", c, x); }
  public activateWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("activateWorkflow", c, x); }
  public archiveWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("archiveWorkflow", c, x); }
  public startWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("startWorkflow", c, x); }
  public advanceStage(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("advanceStage", c, x); }
  public pauseWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("pauseWorkflow", c, x); }
  public resumeWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("resumeWorkflow", c, x); }
  public recordTaskState(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("recordTaskState", c, x); }
  public recordTaskFailure(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("recordTaskFailure", c, x); }
  public completeWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("completeWorkflow", c, x); }
  public cancelWorkflow(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("cancelWorkflow", c, x); }
  public failWorkflowExecution(c: WorkflowCommandRequestDto, x: ApplicationCommandContext) { return this.command("failWorkflowExecution", c, x); }
  public getWorkflow(q: GetWorkflowRequestDto, x: QueryContext): Promise<WorkflowDto | null> { return executeBoundQuery(this.bindings.getWorkflow as never, this.queries, q, x); }
  public getWorkflowExecution(q: GetWorkflowExecutionRequestDto, x: QueryContext): Promise<WorkflowExecutionDto | null> { return executeBoundQuery(this.bindings.getWorkflowExecution as never, this.queries, q, x); }
}
