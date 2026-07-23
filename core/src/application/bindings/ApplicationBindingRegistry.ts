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

export function executeBoundCommand<Request extends OperationCommandDto, Result>(descriptor: CommandBindingDescriptor<Request, Result, CommittedOperationResultDto>, runner: ApplicationCommandRunner, request: Request, context: ApplicationCommandContext): Promise<CommittedOperationResultDto> {
  const command = descriptor.requestMapper(request);
  descriptor.validator(command, context);
  const replay = { resolve: async (transactionId: string, _normalized: typeof command, originalContext: ApplicationCommandContext) => descriptor.replay.kind === "FULL_CONFIRMED_RESULT" ? descriptor.replay.resolver.resolve(transactionId, request, originalContext) : descriptor.replay.resolver.resolve(transactionId, request, originalContext) as unknown as Result };
  return runner.execute(descriptor.boundedContext, descriptor.operationName, command, context, descriptor.handler, replay).then((result) => descriptor.responseMapper(result));
}

export function executeBoundQuery<Query extends QueryDto, Result, Response>(descriptor: QueryBindingDescriptor<Query, Result, Response>, runner: ApplicationQueryRunner, request: Query, context: QueryContext): Promise<Response> {
  const query = descriptor.requestMapper(request);
  return runner.execute(query, context, descriptor.handler, descriptor.validator).then((result) => descriptor.responseMapper(result));
}
