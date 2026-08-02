import type { ApplicationCommandContext, MutableCommandDto, QueryContext, QueryDto } from "../dto/ApplicationContext.js";
import type { TransactionalRepositorySession, ReadRepositorySession } from "../services/TransactionalRepositorySession.js";
import type { ValidatedCommandContext } from "../services/ApplicationCommandRunner.js";

export interface ReadRepositoryViewDescriptor { readonly repositories: readonly string[]; }
export interface RepositoryViewDescriptor { readonly repositories: readonly string[]; }
export interface CommittedResultResolver<C, R> { resolve(transactionId: string, command: C, context: ApplicationCommandContext): Promise<R>; }
export interface CommittedReferenceResolver<C> { resolve(transactionId: string, command: C, context: ApplicationCommandContext): Promise<ConfirmedReferenceResult>; }
export type ReplayResolution<C, R> =
  | { readonly kind: "FULL_CONFIRMED_RESULT"; readonly resolver: CommittedResultResolver<C, R>; }
  | { readonly kind: "CONFIRMED_REFERENCE"; readonly resolver: CommittedReferenceResolver<C>; };
export interface ConfirmedReferenceResult { readonly transactionId: string; readonly resourceIds: readonly string[]; readonly status: "COMMITTED"; }
export interface CommandBindingDescriptor<Request extends MutableCommandDto, Result, Response, Repositories = TransactionalRepositorySession> {
  readonly boundedContext: string;
  readonly exportName: string;
  readonly operationName: string;
  readonly apiPortMethod: string;
  readonly repositoryView: RepositoryViewDescriptor;
  readonly useCaseExport: string;
  readonly requestMapper: (request: Request) => MutableCommandDto & { readonly payload: import("../../shared/common/serialization.js").JsonObject };
  readonly validator: (command: MutableCommandDto & { readonly payload: import("../../shared/common/serialization.js").JsonObject }, context: ApplicationCommandContext) => void;
  readonly handler: (command: MutableCommandDto & { readonly payload: import("../../shared/common/serialization.js").JsonObject }, context: ValidatedCommandContext, repositories: Repositories) => Promise<Result>;
  readonly repositorySelector?: (repositories: TransactionalRepositorySession) => Repositories;
  readonly replay?: ReplayResolution<Request, Result>;
  readonly confirmedResourceType?: string;
  readonly responseMapper: (result: Result) => Response;
}
export interface QueryBindingDescriptor<Query extends QueryDto, Result, Response, Repositories = ReadRepositorySession> {
  readonly boundedContext: string;
  readonly exportName: string;
  readonly operationName: string;
  readonly apiPortMethod: string;
  readonly repositoryView: ReadRepositoryViewDescriptor;
  readonly requestMapper: (request: Query) => QueryDto;
  readonly validator: (query: QueryDto, context: QueryContext) => void;
  readonly handler: (query: QueryDto, context: QueryContext, repositories: Repositories) => Promise<Result>;
  readonly repositorySelector?: (repositories: ReadRepositorySession) => Repositories;
  readonly responseMapper: (result: Result) => Response;
}
