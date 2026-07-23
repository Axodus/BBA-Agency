import { ApplicationError } from "../errors/ApplicationError.js";
import type { QueryContext, QueryDto } from "../dto/ApplicationContext.js";
import { validateQueryContext } from "../validation/ApplicationValidation.js";
import type { ReadRepositorySession, ReadRepositorySessionFactory } from "./TransactionalRepositorySession.js";

export type QueryHandler<Q extends QueryDto, R> = (query: Q, context: QueryContext, repositories: ReadRepositorySession) => Promise<R>;

export class ApplicationQueryRunner {
  public constructor(private readonly sessions: ReadRepositorySessionFactory) {}
  public async execute<Q extends QueryDto, R>(query: Q, context: QueryContext, handler: QueryHandler<Q, R>, validate?: (query: Q, context: QueryContext) => void): Promise<R> {
    try { validateQueryContext(context); validate?.(query, context); return await handler(query, context, this.sessions.open(context)); }
    catch (error) { if (error instanceof ApplicationError) throw error; throw new ApplicationError("APPLICATION_FAILURE", "Application query failed", {}, context.correlationId, { cause: error }); }
  }
}
