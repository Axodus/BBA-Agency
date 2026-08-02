import type { PersistenceProviderPort } from "./PersistencePorts.js";
import { createProviderBackedRepositories } from "./ProviderBackedRepositories.js";
import type { TransactionContext } from "./TransactionContext.js";

/** Creates all provider-backed adapters with one explicit transaction context. */
export class RepositoryFactory {
  public constructor(private readonly provider: PersistenceProviderPort) {}
  public create(context: TransactionContext): ReturnType<typeof createProviderBackedRepositories> {
    return createProviderBackedRepositories(this.provider, context);
  }
}
