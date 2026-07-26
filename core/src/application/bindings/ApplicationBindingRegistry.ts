import type { CommandBindingDescriptor, QueryBindingDescriptor } from "./ApplicationBindingTypes.js";
import type { OperationCommandDto, QueryDto, AggregateDto, CommittedOperationResultDto } from "../dto/ApplicationContext.js";
import type { ApplicationCommandContext, QueryContext } from "../dto/ApplicationContext.js";
import type { ApplicationCommandRunner } from "../services/ApplicationCommandRunner.js";
import type { ApplicationQueryRunner } from "../services/ApplicationQueryRunner.js";

export type AnyCommandDescriptor = CommandBindingDescriptor<OperationCommandDto, never, CommittedOperationResultDto>;
export type AnyQueryDescriptor = QueryBindingDescriptor<QueryDto, never, AggregateDto | null | readonly AggregateDto[]>;

export interface ApplicationBindings {
  readonly commands: Readonly<Record<string, AnyCommandDescriptor>>;
  readonly queries: Readonly<Record<string, AnyQueryDescriptor>>;
}

export function commandKey(context: string, operation: string): string { return `${context}.${operation}`; }
export function queryKey(context: string, operation: string): string { return `${context}.${operation}`; }

function confirmedOperationResult(transactionId: string, resourceType: string, resourceId: string): CommittedOperationResultDto {
  return Object.freeze({ transactionId, status: "COMMITTED", resourceReferences: Object.freeze([{ resourceType, resourceId }]) });
}

function requestResourceId(request: OperationCommandDto): string {
  if (request.targetId !== undefined && request.targetId.trim() !== "") return request.targetId;
  const candidate = request.payload.id ?? request.payload.agentId ?? request.payload.executionId ?? request.payload.missionId;
  if (typeof candidate !== "string" || candidate.trim() === "") throw new Error("Committed operation has no resource identity");
  return candidate;
}

export function executeBoundCommand<Request extends OperationCommandDto, Result, Repositories = import("../services/TransactionalRepositorySession.js").TransactionalRepositorySession>(descriptor: CommandBindingDescriptor<Request, Result, CommittedOperationResultDto, Repositories>, runner: ApplicationCommandRunner, request: Request, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> {
  const command = descriptor.requestMapper(request);
  descriptor.validator(command, context);
  const replay = descriptor.replay === undefined
    ? descriptor.confirmedResourceType === undefined
      ? undefined
      : { resolve: async (transactionId: string) => confirmedOperationResult(transactionId, descriptor.confirmedResourceType as string, requestResourceId(command)) }
    : { resolve: async (transactionId: string, _normalized: typeof command, originalContext: ApplicationCommandContext) => descriptor.replay?.kind === "FULL_CONFIRMED_RESULT" ? descriptor.replay.resolver.resolve(transactionId, request, originalContext) : descriptor.replay?.resolver.resolve(transactionId, request, originalContext) as unknown as Result };
  const handler = async (input: typeof command, validated: import("../services/ApplicationCommandRunner.js").ValidatedCommandContext, repositories: import("../services/TransactionalRepositorySession.js").TransactionalRepositorySession) => {
    const selected = descriptor.repositorySelector === undefined ? repositories : descriptor.repositorySelector(repositories);
    return descriptor.handler(input, validated, selected as Repositories);
  };
  return runner.execute(descriptor.boundedContext, descriptor.operationName, command, context, handler, replay as import("../services/ApplicationCommandRunner.js").CommandReplay<typeof command, Result> | undefined).then((result) => descriptor.responseMapper(result));
}

export function executeBoundQuery<Query extends QueryDto, Result, Response, Repositories = import("../services/TransactionalRepositorySession.js").ReadRepositorySession>(descriptor: QueryBindingDescriptor<Query, Result, Response, Repositories>, runner: ApplicationQueryRunner, request: Query, context: QueryContext): Promise<Response> {
  const query = descriptor.requestMapper(request);
  const handler = async (input: typeof query, queryContext: QueryContext, repositories: import("../services/TransactionalRepositorySession.js").ReadRepositorySession) => {
    const selected = descriptor.repositorySelector === undefined ? repositories : descriptor.repositorySelector(repositories);
    return descriptor.handler(input, queryContext, selected as Repositories);
  };
  return runner.execute(query, context, handler, descriptor.validator).then((result) => descriptor.responseMapper(result));
}
